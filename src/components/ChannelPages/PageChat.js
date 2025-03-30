import React, { useState, useRef, useEffect } from "react";
import Smiley from "../../assets/icons/smiley.svg";
import SendButton from "../../assets/icons/send_btn.svg";
import AddButton from "../../assets/icons/add_btn.svg";
import Media from "../../assets/icons/media.svg";
import Document from "../../assets/icons/document.svg";
// import Poll from "../../assets/icons/graph.svg";
import Event from "../../assets/icons/calendar.svg";
import EmojiPicker from "emoji-picker-react";
import PageChatData from "./PageChatData";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PdfImage from "../../assets/images/pdf_img.svg";
import Delete from "../../assets/icons/Delete.svg";
import Close from "../../assets/icons/Close.svg";
import socket from "../../utils/socket";
import Compressor from "compressorjs";

import {
  setChatField,
  addMediaItem,
  removeMediaItem,
  clearChat,
  createTopicChat,
  clearMedia,
  markAsRead,
} from "../../redux/slices/chatSlice";
import { setEventField } from "../../redux/slices/eventSlice";
import { updateWhatsAppNumber } from "../../redux/slices/myDataSlice";
import useModal from "./../hooks/ModalHook";
import PhoneInput from "react-phone-input-2";
import { visitTopic } from "../../redux/slices/topicSlice";

const PageChat = ({ topicId, topic, channelId, isLoggedIn, myData }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const channelChat = useSelector((state) => state.chat);
  const chatStatus = useSelector((state) => state.chat.chatStatus);
  const chatContainerRef = useRef(null);
  const Chats = useSelector((state) => state.chat.chats);
  const { handleOpenModal } = useModal();
  const previousChatLength = useRef(0);
  const [isChecked, setIsChecked] = useState(false);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if (Chats.length > previousChatLength.current) {
      scrollToBottom();
    }
    previousChatLength.current = Chats.length;
  }, [Chats]);

  // const handleCheckboxChange = () => {
  //   setIsChecked((prev) => !prev);
  // };

  useEffect(() => {
    if (!topic.channel.members?.includes(myData._id)) {
      dispatch(visitTopic(topicId));
    }
  }, [topicId]);

  useEffect(() => {
    if (myData.whatsapp_number === "") {
      setNotificationDropdown(true);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
    setFileObjects([]);
    handleReplyClear();
    dispatch(clearMedia());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji;
    dispatch(
      setChatField({ field: "content", value: channelChat.content + emoji })
    );
    inputRef.current.focus();
  };

  const previewConfig = {
    showPreview: false,
  };
  const handleRemoveMedia = (index, id) => {
    dispatch(removeMediaItem(index));
    setFileObjects(fileObjects.filter((_, i) => i !== index));
  };

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 20 * 1024 * 1024;

    if (files.length <= 10) {
      const newFiles = []; // Array to hold files, including compressed images
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          if (file.size > maxFileSize) {
            alert(
              `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
            );
            return resolve(null); // Skip the file
          }

          if (
            file.size >= 8 * 1024 * 1024 &&
            file.size <= maxFileSize &&
            file.type.startsWith("image")
          ) {
            // If the file is an image and larger than 8MB, compress it
            new Compressor(file, {
              quality: 0.5,
              maxWidth: 1920,
              maxHeight: 1080,
              success(result) {
                const newFile = {
                  id: uuidv4(),
                  url: URL.createObjectURL(result),
                  name: result.name,
                  type: result.type.startsWith("video") ? "video" : "image",
                  size: result.size,
                };
                dispatch(addMediaItem(newFile)); // Dispatch compressed image
                newFiles.push(result); // Add compressed image to newFiles
                resolve();
              },
              error(err) {
                alert("Image compression failed: " + err);
                reject(err);
              },
            });
          } else {
            const newFile = {
              id: uuidv4(),
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type.startsWith("video") ? "video" : "image",
              size: file.size,
            };
            dispatch(addMediaItem(newFile)); // Dispatch the original file
            newFiles.push(file); // Add original file to newFiles
            resolve();
          }
        });
      });

      Promise.all(promises)
        .then(() => {
          setFileObjects((prevFiles) => [...prevFiles, ...newFiles]);
          setShowAddMenu(false);
        })
        .catch((err) => {
          console.error("Error processing files:", err);
          setShowAddMenu(false);
        });
    } else {
      alert("You can upload up to 10 files only.");
      setShowAddMenu(false);
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 16 * 1024 * 1024;

    const updatedFiles = [];

    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds the 16 MB size limit.`);
          return resolve(null);
        }

        const objectUrl = URL.createObjectURL(file);
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (fileExtension === "pdf") {
          const reader = new FileReader();
          reader.onload = () => {
            const newFile = {
              id: uuidv4(),
              name: file.name,
              url: objectUrl,
              type: "document",
              size: file.size,
            };
            dispatch(addMediaItem(newFile));
            updatedFiles.push(file);
            resolve(file);
          };
          reader.onerror = () => {
            console.error(`Error reading PDF file "${file.name}".`);
            reject(file);
          };
          reader.readAsArrayBuffer(file);
        } else {
          const newFile = {
            id: uuidv4(),
            name: file.name,
            url: objectUrl,
            type: "document",
            size: file.size,
          };
          dispatch(addMediaItem(newFile));
          updatedFiles.push(file);
          resolve(file);
        }
      });
    };

    const filePromises = files.map((file) => processFile(file));
    await Promise.all(filePromises);

    setFileObjects((prevFiles) => [...prevFiles, ...updatedFiles]);
    setShowAddMenu(false);
  };

  useEffect(() => {
    socket.on("connect", () => {
      if (myData._id) {
        socket.emit("identify_user", myData._id);
        dispatch(markAsRead(topicId));
      }
    });

    return () => {
      // socket.disconnect();
      socket.off("connect");
    };
  }, [topicId]);

  useEffect(() => {
    if (channelChat.media.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [channelChat.media]);

  const handleSendChat = () => {
    const extractLinks = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    };
    setLoading(true);

    const links = extractLinks(channelChat.content);
    const formDataToSend = new FormData();
    formDataToSend.append("content", channelChat.content);
    formDataToSend.append("media", JSON.stringify(channelChat.media));
    formDataToSend.append("mentions", JSON.stringify(channelChat.mentions));
    formDataToSend.append("replyTo", channelChat.replyTo || null);
    formDataToSend.append("links", JSON.stringify(links));
    formDataToSend.append("channel", channelId);
    formDataToSend.append("topic", topicId);
    fileObjects.forEach((file) => {
      formDataToSend.append("files", file);
    });

    const messageData = {
      userId: myData._id,
      channel: channelId,
      topic: topicId,
      content: channelChat.content,
      media: channelChat.media,
      links: links,
      mentions: channelChat.mentions,
      replyTo: channelChat.replyTo || null,
    };
    socket.emit("send_message", messageData);
    dispatch(createTopicChat(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearChat());
        setLoading(false);

        setFileObjects([]);
        if (inputRef.current) {
          inputRef.current.style.height = "inherit";
        }
      })
      .catch((error) => {
        setLoading(false);

        alert(error);
        setFileObjects([]);
      });
  };

  useEffect(() => {
    if (myData.username && topicId) {
      socket.emit("join_topic", { username: myData.username, topicId });
      return () => {
        socket.emit("leave_topic", { username: myData.username, topicId });
      };
    }
  }, [topicId, myData.username]);

  const handleReplyClear = () => {
    dispatch(setChatField({ field: "replyTo", value: null }));
    dispatch(setChatField({ field: "replyUsername", value: "" }));
  };

  const handleEventOpen = () => {
    dispatch(setEventField({ field: "topic", value: topicId }));
    handleOpenModal("modalEventOpen");
  };

  const autoExpand = (field) => {
    field.style.height = "inherit";
    field.style.height = `${field.scrollHeight}px`;
  };

  const handlePhoneChange = (value, countryData) => {
    const countryCode = `+${countryData.dialCode}`;
    const phoneNumber = value.slice(countryData.dialCode.length);
    const formattedNumber = `${countryCode}${phoneNumber}`;
    setWhatsAppNumber(formattedNumber);
  };

  const handleSave = () => {
    dispatch(updateWhatsAppNumber(whatsAppNumber))
      .unwrap()
      .then(() => {
        setIsChecked(false);
        setNotificationDropdown(false);
        setWhatsAppNumber("");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const buttonClass =
    whatsAppNumber === ""
      ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
      : "dark:bg-secondaryText-dark dark:text-primaryBackground-dark";

  return (
    <div className=" w-full relative flex flex-col sm:h-full-height-30 h-full-height-96 ">
      {/* {notificationDropdown && (
        <div
          className="absolute z-[99] top-0 w-full items-center dark:bg-primaryBackground-dark border-b
         dark:border-b-chatDivider-dark p-3 flex flex-row justify-between"
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-black dark:bg-transparent  rounded 
               dark:focus:bg-sidebarColor-dark dark:ring-offset-gray-800"
              onChange={handleCheckboxChange}
              checked={isChecked}
            />
            <span className="text-sm text-gray-700 dark:text-secondaryText-dark ">
              Allow notification on whatsapp for this chat.
            </span>
          </label>
          <img
            src={Close}
            alt="close"
            className="w-4 h-4 cursor-pointer"
            onClick={() => setNotificationDropdown(false)}
          />
        </div>
      )} */}
      {isChecked && (
        <div
          className="absolute z-[99] top-11 dark:bg-primaryBackground-dark border-b
         dark:border-b-chatDivider-dark p-2 flex flex-col"
        >
          <p className="dark:text-secondaryText-dark text-sm">
            Update your WhastApp Number
          </p>
          <div className="relative mt-4">
            <label className="absolute left-4 -top-2 text-xs font-light font-inter z-20 dark:bg-primaryBackground-dark dark:text-secondaryText-dark">
              WhatsApp Number
            </label>
            <div className="flex items-center  rounded-md ">
              <PhoneInput
                country="in"
                value={whatsAppNumber}
                onChange={handlePhoneChange}
                containerClass="custom-phone-input"
                dropdownClass="z-50"
                placeholder="Enter contact number"
                excludeCountries={["id"]}
              />
            </div>
            <button
              className={`w-full py-2.5 mt-5 rounded-lg ${buttonClass} font-normal`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div
        className=" dark:bg-secondaryBackground-dark w-full h-full overflow-y-auto pt-1"
        ref={chatContainerRef}
      >
        <PageChatData
          topicId={topicId}
          isLoggedIn={isLoggedIn}
          myData={myData}
        />
      </div>
      <div className="absolute bottom-12 w-full ">
        {channelChat.media.length > 0 && (
          <div
            className="w-full dark:bg-chatDivider-dark flex flex-row  space-x-5 overflow-x-auto custom-scrollbar flex-shrink-0 z-50
        pl-4 pr-2 pt-4 pb-2"
          >
            {channelChat.media.map((item, index) => (
              <div className="dark:bg-tertiaryBackground-dark rounded-lg p-2 relative ">
                <div className="flex flex-col">
                  <div
                    className="absolute -top-2 -right-1 cursor-pointer dark:bg-emptyEvent-dark rounded-full p-1"
                    onClick={() => handleRemoveMedia(index, item._id)}
                  >
                    <img src={Delete} alt="delete" className="w-4 h-4 " />
                  </div>
                  {item.type === "image" ? (
                    <div className="">
                      <img
                        src={item.url}
                        alt="pdf-image"
                        className=" rounded-lg h-24 max-w-32 w-auto "
                      />
                    </div>
                  ) : item.type === "video" ? (
                    <video
                      controls
                      className="w-auto h-24 object-cover max-w-32 rounded-t-xl"
                    >
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={PdfImage}
                      alt="pdf-image"
                      className="rounded-lg h-24 max-w-32 w-auto"
                    />
                  )}
                  <p className="dark:text-secondaryText-dark mt-1 font-normal text-xs truncate max-w-24">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {channelChat.replyTo && channelChat.replyUsername && (
          <div className="dark:text-secondaryText-dark dark:bg-chatDivider-dark mt-0.5  py-1 px-4 text-sm font-light w-full flex flex-row justify-between items-center">
            <p>Replying to {channelChat.replyUsername}</p>
            <div
              className="p-2 rounded-full dark:bg-secondaryBackground-dark cursor-pointer"
              onClick={handleReplyClear}
            >
              <img src={Close} alt="close-icon" className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {(topic.editability === "anyone" ||
        topic.user === myData._id ||
        (topic.editability === "invite" &&
          topic.allowedEditUsers?.includes(myData._id))) && (
        <div className="flex items-center px-4  space-x-2 bg-secondaryBackground-dark ">
          <img
            src={AddButton}
            ref={addMenuRef}
            alt="add-btn"
            className="w-10 h-10 cursor-pointer"
            onClick={() => setShowAddMenu((prev) => !prev)}
          />
          {showAddMenu && (
            <div
              className="absolute bottom-12 left-2 mb-2 dark:bg-tertiaryBackground-dark border
           dark:border-modalBorder-dark shadow-lg rounded-lg p-3 z-10"
              onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the document
              ref={addMenuRef}
            >
              <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
                <img src={Media} alt="media" className-="w-5 h-5 mr-1" />
                <p className="block dark:text-emptyEvent-dark" role="menuitem">
                  Media
                </p>

                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleMediaChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  ref={fileInputRef}
                />
              </div>

              <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
                <img src={Document} alt="doc" className-="w-5 h-5 mr-1" />
                <p className="block dark:text-emptyEvent-dark" role="menuitem">
                  Document
                </p>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  ref={fileInputRef}
                />
              </div>
              {/* <div
              className="flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer "
              onClick={() => console.log("Poll Clicked")}
            >
              <img src={Poll} alt="poll" className-="w-5 h-5 mr-1" />
              <span className="dark:text-emptyEvent-dark">Poll</span>
            </div> */}
              {topic.user === myData._id && (
                <div
                  className="flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer "
                  onClick={handleEventOpen}
                >
                  <img src={Event} alt="event" className-="w-5 h-5 mr-1" />
                  <span className="dark:text-emptyEvent-dark">Event</span>
                </div>
              )}
            </div>
          )}

          <div className="relative flex items-center w-full">
            <img
              src={Smiley}
              alt="emoji"
              className="absolute right-2  cursor-pointer w-8 h-8"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <textarea
              type="text"
              placeholder="Type your message"
              className="pl-3 dark:bg-tertiaryBackground-dark border border-modalBorder-dark pr-10 py-2 
              rounded-3xl dark:text-secondaryText-dark placeholder:dark:text-emptyEvent-dark placeholder:font-light 
              focus:outline-none w-full font-inter font-light resize-none"
              style={{ fontSize: "15px", overflow: "hidden" }}
              value={channelChat.content}
              rows={1}
              ref={inputRef}
              onClick={() => setShowEmojiPicker(false)}
              onChange={(e) => {
                dispatch(
                  setChatField({ field: "content", value: e.target.value })
                );
                autoExpand(e.target);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (
                    channelChat.content.trim() !== "" ||
                    channelChat.media.length > 0
                  ) {
                    handleSendChat();
                  }
                }
              }}
            />
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-full mb-2">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  skinTonesDisabled={true}
                  theme={"dark"}
                  height={350}
                  searchDisabled={true}
                  lazyLoadEmojis={true}
                  previewConfig={previewConfig}
                />
              </div>
            )}
          </div>

          {(channelChat.content || channelChat.media.length > 0) && (
            <div className="relative ">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center pl-2 ">
                  <div className="w-5 h-5 border-[3px] border-t-[3px] border-gray-900 dark:border-secondaryText-dark rounded-full animate-spin"></div>
                </div>
              ) : (
                <img
                  src={SendButton}
                  alt="send-btn"
                  className="w-10 h-10 cursor-pointer"
                  onClick={handleSendChat}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageChat;
