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

const PageChat = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [chat, setChat] = useState("");
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setShowAddMenu(false); // Close the Add menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (event, emojiObject) => {
    setChat((prevComment) => prevComment + event.emoji);
    inputRef.current.focus();
  };

  const previewConfig = {
    showPreview: false,
  };

  return (
    <div className="h-full w-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto p-4 dark:bg-secondaryBackground-dark">
        <PageChatData />
      </div>
      <div className="flex items-center px-4 py-2 space-x-2 bg-secondaryBackground-dark mb-1">
        <img
          src={AddButton}
          ref={addMenuRef}
          alt="add-btn"
          className="w-10 h-10 cursor-pointer"
          onClick={() => setShowAddMenu((prev) => !prev)}
        />
        {showAddMenu && (
          <div className="absolute bottom-12 left-2 mb-2 dark:bg-tertiaryBackground-dark border dark:border-modalBorder-dark shadow-lg rounded-lg p-3 z-10">
            <div
              className="flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer"
              onClick={() => console.log("Media Clicked")}
            >
              <img src={Media} alt="media" className-="w-5 h-5 mr-1" />
              <span className="dark:text-emptyEvent-dark">Media</span>
            </div>
            <div
              className="flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer"
              onClick={() => console.log("Document Clicked")}
            >
              <img src={Document} alt="doc" className-="w-5 h-5 mr-1" />
              <span className="dark:text-emptyEvent-dark">Document</span>
            </div>
            <div
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
            </div>
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
            value={chat}
            ref={inputRef}
            onClick={() => setShowEmojiPicker(false)}
            onChange={(e) => setChat(e.target.value)}
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
        {chat && (
          <img
            src={SendButton}
            alt="send-btn"
            className="w-10 h-10 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PageChat;
