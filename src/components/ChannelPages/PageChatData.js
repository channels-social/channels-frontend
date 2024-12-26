import React, { useState, useEffect, useRef } from "react";
import Shape from "../../assets/icons/Shape.png";
import Test from "../../assets/icons/test.png";
import Smiley from "../../assets/icons/smiley.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import ReplyIcon from "../../assets/icons/reply_line.svg";
import { fetchTopicChats } from "./../../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../assets/icons/profile.svg";

const PageChatData = ({ topicId }) => {
  const [showReactionsSmiley, setShowReactionsSmiley] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState({});
  const reactionRef = useRef(null);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const reactionsData = ["❤️", "😂", "👍", "🎉", "😢"];
  const Chats = useSelector((state) => state.chat.chats);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactionPicker(false);
        setShowReactionsSmiley(false);
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchTopicChats(topicId));
  }, [dispatch, topicId]);

  const handleMouseLeave = () => {
    if (showReactionPicker === false) {
      setShowReactionsSmiley(false);
      setShowMenu(false);
    }
  };

  const handleshowReaction = () => {
    setShowReactionPicker(true);
  };

  const handleReactionClick = (reaction, chatId) => {
    setReactions((prevReactions) => {
      const newReactions = { ...prevReactions };
      if (!newReactions[chatId]) {
        newReactions[chatId] = {};
      }
      if (newReactions[chatId][reaction]) {
        delete newReactions[chatId][reaction];
      } else {
        newReactions[chatId][reaction] = 1;
      }
      return newReactions;
    });
    setShowReactionPicker(false);
  };
  const handleShowMenu = () => {
    setShowMenu(true);
  };
  return (
    <div className="w-full">
      {Chats.map((chat) => (
        <div
          key={chat._id}
          className="flex flex-col relative w-full mb-6"
          onMouseEnter={() => setHoveredChatId(chat._id)} // Track the hovered chat
          onMouseLeave={() => setHoveredChatId(null)} // Reset on mouse leave
        >
          <div className="flex flex-row w-full relative">
            <img
              src={chat.user?.logo ? chat.user?.logo : Profile}
              alt="logo"
              className="rounded-full w-8 h-8"
            />
            <div className="flex flex-col ml-2 w-full">
              <p className="dark:text-emptyEvent-dark font-medium text-xs flex items-center relative">
                <span>
                  {chat.user.username}{" "}
                  <span className="font-light">
                    {new Date(chat.createdAt).toLocaleString()}
                  </span>
                </span>
                {/* Smiley and Reply Picker aligned to the right */}
                {hoveredChatId === chat._id && (
                  <span className="absolute right-0 flex items-center space-x-2">
                    <img
                      src={Smiley}
                      alt="emoji"
                      className="cursor-pointer w-6 h-6"
                      onClick={() => setShowReactionPicker(true)}
                    />
                    <div
                      className="cursor-pointer relative"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <img
                        src={ArrowDropDown}
                        alt="arrow-dop-down"
                        className="w-8 h-8"
                      />
                      {showMenu && (
                        <div
                          className="absolute top-6 right-0 w-max rounded-md shadow-lg
                          dark:bg-dropdown-dark z-50"
                        >
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div className="relative flex flex-row px-4 items-center">
                              <img src={ReplyIcon} alt="reply" />
                              <p
                                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                role="menuitem"
                              >
                                Reply
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </span>
                )}
              </p>
              <p className="dark:text-secondaryText-dark text-sm font-light my-1">
                {chat.content}
              </p>
              <div className="flex flex-row space-x-3 overflow-x-auto w-[90%] custom-scrollbar">
                {chat.media.map((media, index) => (
                  <img
                    key={index}
                    src={media.url}
                    alt={media.name}
                    className="h-32 mt-1 rounded-md object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Reactions Below the Chat */}
          <div className="flex flex-row space-x-2 mt-2 ml-8">
            {reactions[chat._id] &&
              Object.entries(reactions[chat._id]).map(
                ([reaction, count], index) => (
                  <div
                    key={index}
                    className="flex items-center dark:bg-chatDivider-dark rounded-full px-1 py-0.5 space-x-1 "
                  >
                    <span className="text-sm">{reaction}</span>
                    {count > 1 && (
                      <span className="text-xs dark:text-secondaryText-dark pr-1">
                        {count}
                      </span>
                    )}
                  </div>
                )
              )}
          </div>
          {/* Reaction Picker */}
          {showReactionPicker && hoveredChatId === chat._id && (
            <div className="flex absolute top-0 right-10 mt-6 space-x-2 p-1 dark:bg-tertiaryBackground-dark rounded-full z-10">
              {reactionsData.map((reaction, index) => (
                <div
                  key={index}
                  onClick={() => handleReactionClick(reaction, chat._id)}
                  className="flex items-center w-8 h-8 rounded-full hover:dark:bg-chatBackground-dark cursor-pointer"
                >
                  <span className="text-lg">{reaction}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PageChatData;
