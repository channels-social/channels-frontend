import Smiley from "../../assets/icons/smiley.svg";
import SendButton from "../../assets/icons/send_btn.svg";
import ChatIcon from "../../assets/icons/chat_icon.svg";
import Verified from "../../assets/icons/verified.svg";
import ChatIcon2 from "../../assets/icons/chat_icon2.svg";
import AddButton from "../../assets/icons/add_btn.svg";
import AddButtonLight from "../../assets/lightIcons/chat_light.svg";
import StorageManager from "../EmbedChannels/utility/storage_manager";
import Menu from "../../assets/icons/menu.svg";
import Media from "../../assets/icons/media.svg";
import Document from "../../assets/icons/document.svg";
// import Poll from "../../assets/icons/graph.svg";
import Event from "../../assets/icons/calendar.svg";
import EventLight from "../../assets/lightIcons/calendar_light.svg";
import EmojiPicker from "emoji-picker-react";
import PageChatData from "./PageChatData";
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
  createBrandChat,
  clearMedia,
  markAsRead,
} from "../../redux/slices/chatSlice";
import { setEventField } from "../../redux/slices/eventSlice";
import {
  updateWhatsAppNumber,
  saveWhatsAppNumber,
} from "../../redux/slices/myDataSlice";
import OtpInput from "react-otp-input";
import PhoneInput from "react-phone-input-2";
import { visitTopic } from "../../redux/slices/topicSlice";
import PageHeader from "./PageHeader";
import PageChatData2 from "./PageChatData2";
import {
  React,
  useState,
  useEffect,
  useRef,
  useDispatch,
  useSelector,
  useModal,
  isEmbeddedOrExternal,
} from "../../globals/imports";

const PageChat = ({
  topicId,
  topic,
  channelId,
  isLoggedIn,
  myData,
  channelName,
  toggleBottomSheet,
  isOpen,
  username,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isDark = document.documentElement.classList.contains("dark");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [successPage, setSuccessPage] = useState(false);
  const [otpPage, setOtpPage] = useState(false);
  const [otpBackend, setOtpBackend] = useState("");
  const [otp, setOtp] = useState("");
  const [isBrandTalk, setIsBrandTalk] = useState(false);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [error, setError] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const channelChat = useSelector((state) => state.chat);
  const chatStatus = useSelector((state) => state.chat.chatStatus);
  const newMessageScrollRef = useRef(null);
  const Chats = useSelector((state) => state.chat.chats);
  const { handleOpenModal } = useModal();
  const previousChatLength = useRef(0);
  const [isChecked, setIsChecked] = useState(false);

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
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
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
  useEffect(() => {
    if (myData.whatsapp_number === "") {
      setNotificationDropdown(true);
    }
  }, []);

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

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     if (myData._id) {
  //       socket.emit("identify_user", myData._id);
  //       dispatch(markAsRead(topicId));
  //     }
  //   });

  //   return () => {
  //     // socket.disconnect();
  //     socket.off("connect");
  //   };
  // }, [topicId]);

  useEffect(() => {
    if (myData._id && topicId) {
      dispatch(markAsRead(topicId));
    }
  }, [topicId, myData._id]);

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
        if (newMessageScrollRef.current) {
          newMessageScrollRef.current();
        }
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
  const handleSendBrandChat = () => {
    if (!isBrandTalk) {
      return;
    }
    const storedEmbedData = StorageManager.getItem("embedData");
    const { domain } = JSON.parse(storedEmbedData);
    const extractLinks = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    };
    setLoading(true);

    const links = extractLinks(channelChat.content);
    const formDataToSend = new FormData();
    formDataToSend.append("content", channelChat.content);
    formDataToSend.append("media", JSON.stringify(channelChat.media));
    formDataToSend.append("replyTo", channelChat.replyTo || null);
    formDataToSend.append("links", JSON.stringify(links));
    formDataToSend.append("domain", domain);
    fileObjects.forEach((file) => {
      formDataToSend.append("files", file);
    });

    const messageData = {
      userId: myData._id,
      content: channelChat.content,
      media: channelChat.media,
      links: links,
      replyTo: channelChat.replyTo || null,
      domain: domain,
    };
    // socket.emit("send_message", messageData);
    dispatch(createBrandChat(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearChat());
        setLoading(false);
        setFileObjects([]);
        if (newMessageScrollRef.current) {
          newMessageScrollRef.current();
        }

        if (inputRef.current) {
          inputRef.current.style.height = "inherit";
        }
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
  const handleCheckboxChange = () => {
    setIsChecked(true);
  };

  const handleSave = () => {
    if (whatsAppNumber.length < 12) {
      return;
    }
    dispatch(updateWhatsAppNumber(whatsAppNumber))
      .unwrap()
      .then((response) => {
        setOtpBackend(response.otp);
        setOtpPage(true);
        setError("");
      })
      .catch((error) => {
        setError(error);
        setOtpPage(false);
      });
  };

  const handleChangeOtp = async (value) => {
    setOtp(value);
    if (value.length === 6 && value.toString() === otpBackend) {
      dispatch(saveWhatsAppNumber(whatsAppNumber))
        .unwrap()
        .then(() => {
          console.log("done");
          setOtpPage(false);
          setSuccessPage(true);
          setWhatsAppNumber("");
          setError("");
        })
        .catch((error) => {
          setError(error);
        });
    } else if (value.length === 6) {
      setError("Enter Correct Otp");
    }
  };

  const handleCancel = () => {
    setOtpPage(false);
    setIsChecked(false);
    setWhatsAppNumber("");
    setOtp("");
    setOtpBackend("");
  };

  const handleCloseDropdown = () => {
    setOtpPage(false);
    setIsChecked(false);
    setNotificationDropdown(false);
    setWhatsAppNumber("");
    setOtp("");
    setOtpBackend("");
  };
  const handleChangeNumber = () => {
    setOtpPage(false);
    setOtp("");
    setOtpBackend("");
  };

  const handleBrandTalk = () => {
    setIsBrandTalk(!isBrandTalk);
  };

  return (
    <div
      className={` w-full relative flex flex-col ${
        isEmbeddedOrExternal() ? "h-full" : "sm:h-full h-full-height-36 "
      } `}
    >
      {!isBrandTalk && (
        <PageHeader
          channelName={channelName}
          topic={topic}
          topicId={topicId}
          // toggleSidebar={toggleSidebar}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isOpen}
          username={username}
          channelId={channelId}
          // isSidebarOpen={isSidebarOpen}
        />
      )}
      {isBrandTalk && (
        <div className="relative h-8 sm:h-10 bg-theme-secondaryBackground w-full  shrink-0">
          <div
            className="absolute flex flex-row items-center space-x-1 top-4 sm:top-12 left-[40%] sm:left-[45%] border-theme-emptyEvent border rounded-full 
          bg-theme-tertiaryBackground z-20 text-theme-emptyEvent py-1 px-2 font-light text-xs sm:text-sm cursor-pointer"
            onClick={() => setIsBrandTalk(false)}
          >
            <img src={Close} alt="close" className="w-3 h-3" />
            <p> Close Chat</p>
          </div>
        </div>
      )}
      {notificationDropdown && (
        <div
          className="z-40 w-full items-center bg-theme-secondaryText border-b
         border-theme-chatDivider p-3 flex flex-row justify-between"
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              className="appearance-none w-5 h-5 border rounded  cursor-pointer
               checked:bg-transparent checked:border-white checked:before:content-['✓'] 
               checked:before:text-theme-secondaryText checked:before:text-sm checked:before:flex 
               checked:before:items-center checked:before:justify-center bg-theme-buttonEnable
               border-theme-primaryText"
              onChange={handleCheckboxChange}
              checked={isChecked}
            />
            <span className="xs:text-sm text-xs text-theme-primaryBackground">
              Enable WhatsApp notifications for this conversation
            </span>
          </label>

          <img
            src={Close}
            alt="close"
            className="w-4 h-4 cursor-pointer"
            onClick={handleCloseDropdown}
          />
        </div>
      )}
      {isChecked && (
        <div
          className="absolute z-[99] bottom-0 bg-theme-tertiaryBackground border-b w-full
         border-theme-chatDivider p-4 flex flex-col rounded-t-lg h-2/5"
        >
          {!successPage && (
            <p className="text-theme-secondaryText text-sm font-normal">
              {otpPage
                ? `Enter OTP sent on Whatsapp number ${whatsAppNumber}`
                : "Enter your WhastApp Number"}
            </p>
          )}

          {otpPage ? (
            <div className="flex flex-col mt-5">
              <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={6}
                renderSeparator={<span className="w-3"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "34px",
                      height: "40px",
                      border: "none",
                      borderBottom: isDark
                        ? "2px solid white"
                        : "2px solid #edecea", // bottom underline
                      backgroundColor: "transparent", // no box background
                      textAlign: "center",
                      color: isDark ? "white" : "#202020",
                      outline: "none", // removes blue highlight on focus
                      fontSize: "16px",
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />

              <p className="text-theme-secondaryText text-xs font-light mt-8">
                Entered the wrong number?
                <span
                  className="ml-1 underline cursor-pointer"
                  onClick={handleChangeNumber}
                >
                  Update Number
                </span>
              </p>
            </div>
          ) : successPage ? (
            <div>
              <div className="text-theme-secondaryText text-sm font-normal flex flex-row space-x-2 items-center">
                <img src={Verified} alt="success" className="h-4 w-4" />
                <p>Success!</p>
              </div>

              <p className="text-theme-secondaryText text-sm font-normal mt-4">
                Whatsapp notifications have been turned on. You can change your
                preferences on the settings page later.
              </p>

              <button
                className={`w-full py-2.5 mt-5 rounded-lg 
               text-theme-secondaryText bg-theme-buttonEnable
             font-normal text-sm`}
                onClick={handleCloseDropdown}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="relative mt-4">
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
                className={`w-full py-2.5 mt-5 rounded-lg ${
                  whatsAppNumber.length < 12
                    ? "text-theme-buttonDisableText bg-theme-buttonDisable"
                    : " bg-theme-secondaryText text-theme-primaryBackground"
                } font-normal text-sm`}
                onClick={handleSave}
              >
                Verify
              </button>
              <button
                className={`w-full py-2.5 mt-3 rounded-lg font-normal text-sm text-theme-secondaryText border border-theme-secondaryText`}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
          {!successPage && (
            <p className="mt-6 text-theme-error text-sm font-normal">{error}</p>
          )}
        </div>
      )}
      {isBrandTalk && (
        <div className=" bg-theme-primaryBackground w-full h-full overflow-y-auto  ">
          <PageChatData2
            topicId={topicId}
            isLoggedIn={isLoggedIn}
            myData={myData}
            user_id={topic.user}
            onNewMessageSent={(fn) => (newMessageScrollRef.current = fn)}
          />
        </div>
      )}
      {!isBrandTalk && (
        <div className=" bg-theme-secondaryBackground w-full h-full overflow-y-auto pt-1 ">
          <PageChatData
            topicId={topicId}
            isLoggedIn={isLoggedIn}
            myData={myData}
            onNewMessageSent={(fn) => (newMessageScrollRef.current = fn)}
          />
        </div>
      )}

      <div className={`absolute ${"bottom-24"}  w-full `}>
        {channelChat.media.length > 0 && (
          <div
            className="w-full bg-theme-chatDivider flex flex-row  space-x-5 overflow-x-auto custom-scrollbar flex-shrink-0 z-50
        pl-4 pr-2 pt-4 pb-2"
          >
            {channelChat.media.map((item, index) => (
              <div className="bg-theme-tertiaryBackground rounded-lg p-2 relative ">
                <div className="flex flex-col">
                  <div
                    className="absolute -top-2 -right-1 cursor-pointer bg-theme-emptyEvent rounded-full p-1"
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
                  <p className="text-theme-secondaryText mt-1 font-normal text-xs truncate max-w-24">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {channelChat.replyTo && channelChat.replyUsername && (
          <div className="text-theme-secondaryText bg-theme-chatDivider  mt-1 py-1 px-4 text-sm font-light w-full flex flex-row justify-between items-center">
            <p>Replying to {channelChat.replyUsername}</p>
            <div
              className="p-2 rounded-full bg-theme-secondaryBackground cursor-pointer"
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
        <div className="flex flex-col items-center px-2 pt-2 pb-3 space-x-2 bg-theme-secondaryBackground border-t border-t-theme-chatDivider">
          <div className="relative flex flex-row items-center w-full">
            <img
              src={Smiley}
              alt="emoji"
              className="absolute right-2  cursor-pointer w-8 h-8"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            <textarea
              type="text"
              placeholder="Type your message"
              className="pl-3 bg-transparent  pr-10 py-2 
              rounded-3xl text-theme-secondaryText placeholder:text-theme-emptyEvent placeholder:font-light 
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
                    isBrandTalk ? handleSendBrandChat() : handleSendChat();
                  }
                }
              }}
            />
            {showEmojiPicker && (
              <div className="absolute right-0 bottom-full mb-2" ref={emojiRef}>
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  skinTonesDisabled={true}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? "dark"
                      : "light"
                  }
                  height={350}
                  searchDisabled={true}
                  lazyLoadEmojis={true}
                  previewConfig={previewConfig}
                />
              </div>
            )}
          </div>
          <div className="flex flex-row justify-between items-center w-full px-2 mt-2">
            <div className="flex flex-row justify-start">
              <img
                src={AddButton}
                ref={addMenuRef}
                alt="add-btn"
                className="dark:block hidden w-8 h-8 cursor-pointer"
                onClick={() => setShowAddMenu((prev) => !prev)}
              />
              <img
                src={AddButtonLight}
                ref={addMenuRef}
                alt="add-btn"
                className="dark:hidden w-8 h-8 cursor-pointer"
                onClick={() => setShowAddMenu((prev) => !prev)}
              />
              {showAddMenu && (
                <div
                  className="absolute bottom-12 left-2 mb-2 bg-theme-tertiaryBackground border
           border-theme-modalBorder shadow-lg rounded-lg p-3 z-10"
                  onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the document
                  ref={addMenuRef}
                >
                  <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
                    <img src={Media} alt="media" className-="w-5 h-5 mr-1" />
                    <p className="block text-theme-emptyEvent" role="menuitem">
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
                    <p className="block text-theme-emptyEvent" role="menuitem">
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
                    <span className="text-theme-emptyEvent">Poll</span>
                  </div> */}
                  {topic.user === myData._id && (
                    <div
                      className="flex flex-row items-center px-1 py-2 cursor-pointer "
                      onClick={handleEventOpen}
                    >
                      <img
                        src={Event}
                        alt="event"
                        className="dark:block hidden w-5 h-5 mr-2"
                      />
                      <img
                        src={EventLight}
                        alt="event"
                        className="dark:hidden w-5 h-5 mr-2"
                      />
                      <span className="text-theme-emptyEvent">Event</span>
                    </div>
                  )}
                </div>
              )}
              {topic.user !== myData._id && (
                <div
                  className={`${
                    isBrandTalk
                      ? " bg-theme-secondaryText text-theme-primaryBackground"
                      : "bg-theme-chatDivider text-theme-buttonDisableText"
                  } 
                  ml-4 text-theme-primaryText rounded-full px-3 py-1.5 text-center flex flex-row cursor-pointer`}
                  onClick={handleBrandTalk}
                >
                  <img
                    src={isBrandTalk ? ChatIcon2 : ChatIcon}
                    alt="icon"
                    className={`w-5 h-5 mr-1`}
                  />
                  <p
                    className={` text-sm font-light ${
                      isBrandTalk
                        ? "text-theme-primaryBackground"
                        : "text-theme-emptyEvent"
                    }`}
                  >
                    Talk to us
                  </p>
                </div>
              )}

              <div
                className={`xl:hidden text-center flex  ${
                  isOpen
                    ? " bg-theme-secondaryText text-theme-primaryBackground"
                    : "bg-theme-chatDivider text-theme-buttonDisableText"
                } 
                  ml-4  rounded-full px-3 py-1.5 flex-row cursor-pointer`}
                onClick={toggleBottomSheet}
              >
                {/* <img
                    src={isBrandTalk ? ChatIcon2 : ChatIcon}
                    alt="icon"
                    className={`w-6 h-6 mr-1`}
                  /> */}
                <p
                  className={` text-sm font-light ${
                    isOpen
                      ? "text-theme-primaryBackground"
                      : "text-theme-emptyEvent"
                  }`}
                >
                  Resource
                </p>
              </div>
              {/* <div className="flex flex-row">
                  <img
                    src={isOpen ? Close : Menu}
                    alt="menu"
                    className={`cursor-pointer xl:hidden sm:flex hidden ${
                      isOpen ? "w-4 h-4" : "w-7 h-7"
                    } `}
                    onClick={toggleBottomSheet}
                  />
                  {isOpen ? (
                    <img
                      src={Close}
                      alt="menu"
                      className={`cursor-pointer flex sm:hidden ${
                        isOpen ? "w-4 h-4" : "w-7 h-7"
                      } `}
                      onClick={toggleBottomSheet}
                    />
                  ) : (
                    <div
                      className="sm:hidden flex space-x-1 cursor-pointer"
                      onClick={toggleBottomSheet}
                    >
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                      <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
                    </div>
                  )}
                </div> */}
            </div>

            {(channelChat.content || channelChat.media.length > 0) && (
              <div className="relative ">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center pl-2 ">
                    <div className="w-5 h-5 border-[3px] border-t-[3px] border-gray-900 mr-2 border-theme-secondaryText rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img
                    src={SendButton}
                    alt="send-btn"
                    className="w-9 h-9 cursor-pointer"
                    onClick={isBrandTalk ? handleSendBrandChat : handleSendChat}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageChat;
