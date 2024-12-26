import React, { useState, useRef, useEffect } from "react";
import Smiley from "../../assets/icons/smiley.svg";
import SendButton from "../../assets/icons/send_btn.svg";
import AddButton from "../../assets/icons/add_btn.svg";
import Media from "../../assets/icons/media.svg";
import Document from "../../assets/icons/document.svg";
import Poll from "../../assets/icons/graph.svg";
import Event from "../../assets/icons/calendar.svg";
import EmojiPicker from "emoji-picker-react";
import PageChatData from "./PageChatData";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PdfImage from "../../assets/images/pdf_img.svg";
import Delete from "../../assets/icons/Delete.svg";
import Close from "../../assets/icons/Close.svg";
import {
  setChatField,
  addMediaItem,
  removeMediaItem,
  clearChat,
  createTopicChat,
  createChannelChatReply,
} from "../../redux/slices/chatSlice";

const PageChat = ({ topicId, channelId }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const channelChat = useSelector((state) => state.chat);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
  //       setShowAddMenu(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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
    const maxFileSize = 16 * 1024 * 1024;

    if (files.length <= 5) {
      const newFiles = [];
      for (let file of files) {
        if (file.size > maxFileSize) {
          alert(
            `The file "${file.name}" exceeds the 16  MB size limit and will not be uploaded.`
          );
          continue;
        }
        const newFile = {
          id: uuidv4(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type.startsWith("video") ? "video" : "image",
          size: file.size,
        };
        dispatch(addMediaItem(newFile));
        newFiles.push(file);
      }
      setFileObjects([...fileObjects, ...newFiles]);
    } else {
      alert("You can upload up to 5 files only.");
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;
    const maxFileSize = 16 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert("File size exceeds 10 MB limit.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension === "pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const newFile = {
            id: uuidv4(),
            name: file.name,
            url: objectUrl,
            type: "document",
            size: file.size,
          };
          dispatch(addMediaItem(newFile));

          setFileObjects([...fileObjects, ...newFile]);
        } catch (error) {
          console.error("Error reading PDF file:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const newFile = {
        id: uuidv4(),
        name: file.name,
        url: objectUrl,
        type: "document",
      };
      dispatch(addMediaItem(newFile));
      setFileObjects([...fileObjects, ...newFile]);
    }
  };

  const handleSendChat = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("content", channelChat.content);
    formDataToSend.append("media", JSON.stringify(channelChat.media));
    formDataToSend.append("reactions", JSON.stringify(channelChat.reactions));
    formDataToSend.append("mentions", JSON.stringify(channelChat.mentions));
    formDataToSend.append("replyTo", channelChat.replyTo || null);
    formDataToSend.append("channel", channelId);
    formDataToSend.append("topic", topicId);
    fileObjects.forEach((file) => {
      formDataToSend.append("files", file);
    });
    dispatch(createTopicChat(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearChat());
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleReplyClear = () => {
    dispatch(setChatField({ field: "replyTo", value: "" }));
    dispatch(setChatField({ field: "replyUsername", value: "" }));
  };

  return (
    <div className=" w-full flex flex-col relative h-full overflow-y-auto custom-scrollbar">
      <div className="flex-1 overflow-y-auto p-4 dark:bg-secondaryBackground-dark w-full">
        <PageChatData topicId={topicId} />
      </div>

      {channelChat.media.length > 0 && (
        <div className="w-full dark:bg-chatDivider-dark flex flex-row mb-2 space-x-5 overflow-x-auto custom-scrollbar pl-4 pr-2 pt-4 pb-2">
          {channelChat.media.map((item, index) => (
            <div className="dark:bg-tertiaryBackground-dark rounded-lg p-2 relative ">
              <div className="flex flex-col">
                <div
                  className="absolute -top-2 -right-1 cursor-pointer dark:bg-emptyEvent-dark rounded-full p-0.5"
                  onClick={() => handleRemoveMedia(index, item._id)}
                >
                  <img src={Delete} alt="delete" className="w-6 h-6 " />
                </div>
                {item.type === "image" ? (
                  <div className="">
                    <img
                      src={item.url}
                      alt="pdf-image"
                      className=" rounded-lg h-24 w-auto"
                    />
                  </div>
                ) : item.type === "video" ? (
                  <video
                    controls
                    className="w-auto h-24 object-cover rounded-t-xl"
                  >
                    <source src={item.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={PdfImage}
                    alt="pdf-image"
                    className="rounded-lg h-24 w-auto"
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
      {channelChat.replyTo && (
        <div className="dark:text-secondaryText-dark dark:bg-chatDivider-dark my-1 py-1 px-4 text-sm font-light w-full flex flex-row justify-between items-center">
          <p>Replying to {channelChat.replyUsername}</p>
          <div
            className="p-2 rounded-full dark:bg-secondaryBackground-dark"
            onClick={handleReplyClear}
          >
            <img src={Close} alt="close-icon" className="w-3 h-3" />
          </div>
        </div>
      )}

      <div className="flex items-center px-4 pb-2  space-x-2 bg-secondaryBackground-dark mb-1">
        <img
          src={AddButton}
          ref={addMenuRef}
          alt="add-btn"
          className="w-10 h-10 cursor-pointer"
          onClick={() => setShowAddMenu((prev) => !prev)}
        />
        {showAddMenu && (
          <div className="absolute bottom-12 left-2 mb-2 dark:bg-tertiaryBackground-dark border dark:border-modalBorder-dark shadow-lg rounded-lg p-3 z-10">
            <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
              <img src={Media} alt="media" className-="w-5 h-5 mr-1" />
              <p className="block dark:text-emptyEvent-dark" role="menuitem">
                Media
              </p>

              <input
                type="file"
                accept="image/*,video/*"
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
            </div>
            <div
              className="flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer "
              onClick={() => console.log("Event Clicked")}
            >
              <img src={Event} alt="event" className-="w-5 h-5 mr-1" />
              <span className="dark:text-emptyEvent-dark">Event</span>
            </div> */}
          </div>
        )}

        <div className="relative flex items-center w-full">
          <img
            src={Smiley}
            alt="emoji"
            className="absolute right-2  cursor-pointer w-8 h-8"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          <input
            type="text"
            placeholder="Type your message"
            className="pl-3 dark:bg-tertiaryBackground-dark border border-modalBorder-dark pr-10 py-2 
            rounded-3xl dark:text-secondaryText-dark placeholder:dark:text-emptyEvent-dark placeholder:font-light focus:outline-none w-full font-inter font-light"
            style={{ fontSize: "15px" }}
            value={channelChat.content}
            ref={inputRef}
            onClick={() => setShowEmojiPicker(false)}
            onChange={(e) =>
              dispatch(
                setChatField({ field: "content", value: e.target.value })
              )
            }
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
        {channelChat.content && (
          <img
            src={SendButton}
            alt="send-btn"
            className="w-10 h-10 cursor-pointer"
            onClick={handleSendChat}
          />
        )}
      </div>
    </div>
  );
};

export default PageChat;
