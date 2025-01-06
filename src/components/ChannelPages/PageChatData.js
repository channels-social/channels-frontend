import React, { useState, useEffect, useRef } from "react";
import Shape from "../../assets/icons/Shape.png";
import Test from "../../assets/icons/test.png";
import Smiley from "../../assets/icons/smiley.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import ReplyIcon from "../../assets/icons/reply_line.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import {
  fetchTopicChats,
  setChatField,
  pushToResource,
  makeReaction,
} from "./../../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../assets/icons/profile.svg";
import documentImage from "../../assets/images/Attachment.svg";

import useModal from "./../hooks/ModalHook";
import Linkify from "react-linkify";
import { useParams } from "react-router-dom";

const PageChatData = ({ topicId, isLoggedIn, myData }) => {
  const [showReactionsSmiley, setShowReactionsSmiley] = useState(false);
  const { handleOpenModal } = useModal();
  const { username } = useParams();

  const handleClick = () => {
    handleOpenModal("modalDocumentOpen", document);
  };

  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [hoveredMedia, setHoveredMedia] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [hoveredDocument, setHoveredDocument] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showDocumentMenu, setShowDocumentMenu] = useState(false);

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState({});
  const reactionRef = useRef(null);
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const reactionsData = ["❤️", "😂", "👍", "🎉", "😢"];
  const Chats = useSelector((state) => state.chat.chats);

  const handleMouseEnterMedia = (chatId, mediaIndex) => {
    setHoveredMedia({ chatId, mediaIndex });
  };
  const handleMouseEnterDocument = (chatId, mediaIndex) => {
    setHoveredDocument({ chatId, mediaIndex });
  };
  const handleShowMediaMenu = (chatId, mediaIndex) => {
    if (
      showMediaMenu.chatId === chatId &&
      showMediaMenu.mediaIndex === mediaIndex
    ) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowMediaMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };
  const handleShowDocumentMenu = (chatId, mediaIndex) => {
    if (
      showDocumentMenu.chatId === chatId &&
      showDocumentMenu.mediaIndex === mediaIndex
    ) {
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowDocumentMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };

  const handleMouseLeaveMedia = () => {
    setHoveredMedia({ chatId: null, mediaIndex: null });
  };
  const handleMouseLeaveDocument = () => {
    setHoveredDocument({ chatId: null, mediaIndex: null });
  };

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
    setShowReactionsSmiley(false);
    setShowReactionPicker(false);
    setShowMenu(false);
    setHoveredChatId(null);
  };

  const handleshowReaction = () => {
    setShowReactionPicker(!showReactionPicker);
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

    const formDataToSend = new FormData();
    formDataToSend.append("reaction", reaction);
    formDataToSend.append("chatId", chatId);
    dispatch(makeReaction(formDataToSend));
  };

  const handleReplyClick = (id, username) => {
    dispatch(setChatField({ field: "replyTo", value: id }));
    dispatch(setChatField({ field: "replyUsername", value: username }));
  };

  const handleDeleteChat = (id) => {
    dispatch(setChatField({ field: "chatReplyId", value: id }));
    handleOpenModal("modalChatDeleteOpen");
  };
  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link dark:text-buttonEnable-dark"
    >
      {text}
    </a>
  );

  const handlePushResource = (chatId, mediaId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("chatId", chatId);
    formDataToSend.append("mediaId", mediaId);

    dispatch(pushToResource(formDataToSend))
      .unwrap()
      .then(() => {
        setShowMediaMenu({ chatId: null, mediaIndex: null });
        setShowDocumentMenu({ chatId: null, mediaIndex: null });
      })
      .catch((error) => {
        console.error("Issue in pushing to resources. Please try again.");
      });
  };

  const isOwner = username === myData.username;

  return (
    <div className="w-full h-full ">
      {Chats.map((chat) => (
        <div
          key={chat._id}
          className="flex flex-col relative w-full mb-2"
          onMouseEnter={() => setHoveredChatId(chat._id)}
          onMouseLeave={handleMouseLeave}
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
                      onClick={handleshowReaction}
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
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() =>
                                handleReplyClick(chat._id, chat.user.username)
                              }
                            >
                              <img src={ReplyIcon} alt="reply" />
                              <p
                                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                role="menuitem"
                              >
                                Reply
                              </p>
                            </div>
                          </div>
                          {chat.user._id === myData._id && (
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <div
                                className="relative flex flex-row px-4 items-center"
                                onClick={() => handleDeleteChat(chat._id)}
                              >
                                <img src={DeleteIcon} alt="reply" />
                                <p
                                  className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                  role="menuitem"
                                >
                                  Delete
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </span>
                )}
              </p>
              <Linkify componentDecorator={componentDecorator}>
                <p className="dark:text-secondaryText-dark text-sm font-light my-1">
                  {chat.content}
                </p>
              </Linkify>
              <div className="flex flex-row space-x-3 overflow-x-auto w-[90%] custom-scrollbar">
                {chat.media.map((media, index) => (
                  <div
                    className="relative"
                    onMouseEnter={() => handleMouseEnterMedia(chat._id, index)}
                    onMouseLeave={handleMouseLeaveMedia}
                  >
                    {media.type === "image" ? (
                      <div className="relative h-36">
                        <img
                          key={index}
                          src={media.url}
                          alt={media.name}
                          className="h-36 mt-1 rounded-md object-cover w-auto max-w-52"
                        />
                        <div></div>
                      </div>
                    ) : media.type === "video" ? (
                      <video
                        controls
                        className="h-36 object-cover  rounded-t-xl w-auto max-w-52"
                      >
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                    {isOwner &&
                      hoveredMedia.chatId === chat._id &&
                      hoveredMedia.mediaIndex === index && (
                        <div
                          className="absolute top-0 right-1 cursor-pointer"
                          onClick={() => handleShowMediaMenu(chat._id, index)}
                        >
                          <img
                            src={ArrowDropDown}
                            alt="arrow-dop-down"
                            className="w-8 h-8"
                          />
                        </div>
                      )}
                    {isOwner &&
                      showMediaMenu.chatId === chat._id &&
                      showMediaMenu.mediaIndex === index && (
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
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() =>
                                handlePushResource(chat._id, media._id)
                              }
                            >
                              <img src={ReplyIcon} alt="reply" />
                              <p
                                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                role="menuitem"
                              >
                                Push to Resource
                              </p>
                            </div>
                          </div>
                          {/* <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() => handleDeleteChat(chat._id)}
                            >
                              <img src={ReplyIcon} alt="reply" />
                              <p
                                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                role="menuitem"
                              >
                                Delete
                              </p>
                            </div>
                          </div> */}
                        </div>
                      )}
                  </div>
                ))}
              </div>
              <div className="flex flex-row space-x-3 overflow-x-auto custom-scrollbar mt-1 w-1/4 ">
                {chat.media.map(
                  (media, index) =>
                    media.type === "document" && (
                      <div
                        className="w-full rounded-lg dark:bg-tertiaryBackground-dark cursor-pointer relative "
                        onMouseEnter={() =>
                          handleMouseEnterDocument(chat._id, index)
                        }
                        onMouseLeave={handleMouseLeaveDocument}
                        onClick={handleClick}
                      >
                        <div className="flex flex-row items-center justify-start w-full">
                          <img
                            src={documentImage}
                            alt="Document Icon"
                            className="h-14 w-15 object-fill"
                          />
                          <div className="flex flex-col my-1 ml-3 w-full-minus-68">
                            <p className="dark:text-secondaryText-dark text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                              {media.name}
                            </p>
                            <p className="dark:text-primaryText-dark mt-1  text-[10px] xs:text-xs font-light font-inter">
                              {media.size} Kb
                            </p>
                          </div>
                        </div>
                        {isOwner &&
                          hoveredDocument.chatId === chat._id &&
                          hoveredDocument.mediaIndex === index && (
                            <div
                              className="absolute top-0 right-1 cursor-pointer"
                              onClick={() =>
                                handleShowDocumentMenu(chat._id, index)
                              }
                            >
                              <img
                                src={ArrowDropDown}
                                alt="arrow-dop-down"
                                className="w-8 h-8"
                              />
                            </div>
                          )}
                        {isOwner &&
                          showDocumentMenu.chatId === chat._id &&
                          showDocumentMenu.mediaIndex === index && (
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
                                <div
                                  className="relative flex flex-row px-4 items-center"
                                  onClick={() =>
                                    handlePushResource(chat._id, media._id)
                                  }
                                >
                                  <img src={ReplyIcon} alt="reply" />
                                  <p
                                    className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
                                    role="menuitem"
                                  >
                                    Push to Resource
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
          {/* Reactions Below the Chat */}
          <div className="flex flex-row space-x-2 ml-10 ">
            {reactions[chat._id] &&
              Object.entries(reactions[chat._id]).map(
                ([reaction, count], index) => (
                  <div
                    key={index}
                    className="flex items-center dark:bg-chatBackground-dark rounded-full px-1 py-0.5 space-x-1 mb-2 "
                  >
                    <span className="text-sm">{reaction}</span>
                    <span className="text-xs dark:text-secondaryText-dark pr-1">
                      {count}
                    </span>
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
