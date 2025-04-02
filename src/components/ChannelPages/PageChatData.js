import React, { useState, useEffect, useRef } from "react";
import Smiley from "../../assets/icons/smiley.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import ReplyIcon from "../../assets/icons/reply_icon.svg";
import EmojiPicker from "emoji-picker-react";

import {
  fetchTopicChats,
  setChatField,
  pushToResource,
  toggleReaction,
  addMessage,
} from "./../../redux/slices/chatSlice";
import { pdfjs } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../assets/icons/profile.svg";
import documentImage from "../../assets/images/Attachment.svg";
import {
  deleteTopicChat,
  clearChatIdToDelete,
} from "../../redux/slices/chatSlice";

import useModal from "./../hooks/ModalHook";
import Linkify from "react-linkify";
import { useParams } from "react-router-dom";
import socket from "../../utils/socket";
import TopicChatSkeleton from "./../skeleton/Topic/TopicChatSkeleton";
import EventCard from "./widgets/EventCard";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PageChatData = ({ topicId, isLoggedIn, myData }) => {
  const { handleOpenModal } = useModal();
  const { username } = useParams();

  const handleClick = (document) => {
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
  const [showMediaMenu, setShowMediaMenu] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showDocumentMenu, setShowDocumentMenu] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const dropdownRefs = useRef({});
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState({});
  const reactionRef = useRef(null);
  const dropdownContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const reactionsData = ["❤️", "😂", "👍", "😢"];
  const Chats = useSelector((state) => state.chat.chats);
  const loading = useSelector((state) => state.chat.loading);
  const chatRefs = useRef(new Map());
  const [highlightedChatId, setHighlightedChatId] = useState(null);

  const scrollToChat = (chatId) => {
    const chatElement = chatRefs.current.get(chatId);
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedChatId(chatId);
      setTimeout(() => setHighlightedChatId(null), 2500);
    }
  };

  const addRef = (chatId, mediaIndex, type) => {
    const key = `${type}-${chatId}-${mediaIndex}`;
    if (!dropdownRefs.current[key]) {
      dropdownRefs.current[key] = React.createRef();
    }
    return dropdownRefs.current[key];
  };

  const handleMouseEnterMedia = (chatId, mediaIndex) => {
    setHoveredMedia({ chatId, mediaIndex });
  };
  const handleMouseEnterDocument = (chatId, mediaIndex) => {
    setHoveredDocument({ chatId, mediaIndex });
  };

  const handleToggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleShowMediaMenu = (chatId, mediaIndex) => {
    if (
      showMediaMenu.chatId === chatId &&
      showMediaMenu.mediaIndex === mediaIndex
    ) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
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
      setShowMediaMenu({ chatId: null, mediaIndex: null });
      setShowDocumentMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };

  const handleMouseLeaveMedia = () => {
    setHoveredMedia({ chatId: null, mediaIndex: null });
  };
  const handleMouseLeaveDocument = () => {
    setHoveredDocument({ chatId: null, mediaIndex: null });
  };

  const handleClickOutside = (event) => {
    let clickedInside = false;

    Object.values(dropdownRefs.current).forEach((ref) => {
      if (ref.current && ref.current.contains(event.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
    }
  };

  const previewConfig = {
    showPreview: false,
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchTopicChats(topicId));
  }, [dispatch, topicId]);

  useEffect(() => {
    const handleChatDeleted = (message) => {
      if (message?.topicId === topicId) {
        dispatch(deleteTopicChat(message.chatId));
      }
    };
    socket.on("chat_deleted", handleChatDeleted);

    return () => {
      socket.off("chat_deleted", handleChatDeleted);
    };
  }, [dispatch, topicId, myData?.username]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message?.topic === topicId && message?.user?.username) {
        if (message?.user?.username !== myData?.username) {
          dispatch(addMessage(message));
        }
      }
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [dispatch, topicId, myData?.username]);

  const handleMouseLeave = () => {
    setShowReactionPicker(false);
    setShowMenu(false);
    setHoveredChatId(null);
    setShowEmojiPicker(false);
  };

  const handleshowReaction = () => {
    if (showMenu) {
      setShowMenu(false);
    }
    setShowReactionPicker(!showReactionPicker);
  };
  const handleShowMenu = () => {
    if (showReactionPicker) {
      setShowReactionPicker(false);
    }
    setShowMenu(!showMenu);
  };

  const handleReactionClick = (reaction, chatId) => {
    // setReactions((prevReactions) => {
    //   const newReactions = { ...prevReactions };
    //   if (!newReactions[chatId]) {
    //     newReactions[chatId] = {};
    //   }
    //   if (newReactions[chatId][reaction]) {
    //     delete newReactions[chatId][reaction];
    //   } else {
    //     newReactions[chatId][reaction] = 1;
    //   }
    //   return newReactions;
    // });
    setShowReactionPicker(false);
    setShowEmojiPicker(false);

    const formDataToSend = new FormData();
    formDataToSend.append("reaction", reaction);
    formDataToSend.append("chatId", chatId);
    dispatch(toggleReaction(formDataToSend));
  };

  const handleReplyClick = (id, username) => {
    dispatch(setChatField({ field: "replyTo", value: id }));
    dispatch(setChatField({ field: "replyUsername", value: username }));
  };

  const handleDeleteChat = (id) => {
    dispatch(setChatField({ field: "chatReplyId", value: id }));
    dispatch(setChatField({ field: "topicReplyId", value: topicId }));
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

  const isOwner = username === myData?.username;

  if (loading) {
    return <TopicChatSkeleton />;
  }

  return (
    <div className="w-full h-full max-w-full overflow-x-hidden">
      {Chats.map((chat) => (
        <div
          ref={(el) => chatRefs.current.set(chat._id, el)}
          key={chat._id}
          className={`flex flex-col relative w-full mb-2 px-4 py-1 ${
            hoveredChatId === chat._id
              ? "dark:bg-primaryBackground-dark bg-opacity-20 "
              : highlightedChatId === chat._id
              ? "flicker-highlight"
              : ""
          }`}
          onMouseEnter={() => setHoveredChatId(chat._id)}
          onMouseLeave={handleMouseLeave}
        >
          {chat.replyTo !== null && (
            <div
              className="flex flex-row items-center space-x-1 ml-4 mb-1 w-max cursor-pointer"
              onClick={() => scrollToChat(chat.replyTo._id)}
            >
              <img
                src={ReplyIcon}
                alt="logo"
                className="rounded-full w-8 h-auto object-cover"
              />
              <img
                src={
                  chat.replyTo.user?.logo ? chat.replyTo.user?.logo : Profile
                }
                alt="logo"
                className="rounded-full w-4 h-4 object-cover"
              />
              <p className="dark:text-emptyEvent-dark font-normal text-xs">
                {chat.replyTo.user?.username}
              </p>
              <p className="dark:text-emptyEvent-dark font-light text-xs pl-0.5">
                {chat.replyTo.content
                  ? chat.replyTo.content.length > 150
                    ? `${chat.replyTo.content.substring(0, 150)}...`
                    : chat.replyTo.content
                  : chat.replyTo.media
                  ? "Tap to see Attachment"
                  : chat.replyTo.event
                  ? "Tap to see Event"
                  : "Tap to see Poll"}
              </p>
            </div>
          )}
          <div
            className={`flex w-full relative  px-4 ${
              chat.user?._id === myData?._id ? "justify-end" : "justify-start"
            }`}
          >
            <img
              src={chat.user?.logo ? chat.user?.logo : Profile}
              alt="logo"
              className="rounded-full w-8 h-8 object-cover"
            />
            <div className="flex flex-col ml-2 w-full">
              <p className="dark:text-emptyEvent-dark font-normal text-sm flex items-center relative">
                <span>
                  {chat.user?.username}{" "}
                  <span className="font-light ml-1 text-xs">
                    {new Date(chat.createdAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </span>
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
                      onClick={handleShowMenu}
                    >
                      <img
                        src={ArrowDropDown}
                        alt="arrow-dop-down"
                        className="w-8 h-8"
                      />
                      {showMenu && (
                        <div
                          className="absolute top-6 right-0 w-max dark:bg-tertiaryBackground-dark border
           dark:border-modalBorder-dark shadow-lg rounded-lg  z-10"
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
                                handleReplyClick(chat?._id, chat.user?.username)
                              }
                            >
                              {/* <img src={ReplyIcon} alt="reply" /> */}
                              <p
                                className="block ml-2 py-2 font-normal text-sm dark:text-primaryText-dark cursor-pointer"
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
                                onClick={() => handleDeleteChat(chat?._id)}
                              >
                                {/* <img src={DeleteIcon} alt="reply" /> */}
                                <p
                                  className="block ml-2 font-normal py-2 text-sm dark:text-primaryText-dark cursor-pointer"
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
                <p className="dark:text-secondaryText-dark text-sm font-light my-1 whitespace-pre-wrap break-words mr-8">
                  {chat.content}
                </p>
              </Linkify>
              {chat.event && (
                <EventCard
                  width="w-max"
                  imageHeight="h-32"
                  chatId={chat._id}
                  event={chat.event}
                  color="dark:bg-tertiaryBackground-dark"
                  openDropdownId={openDropdownId}
                  handleToggleDropdown={handleToggleDropdown}
                  btnPadding="px-2"
                  spacing="space-x-4"
                />
              )}
              <div className="flex flex-row  overflow-x-auto w-[95%] custom-scrollbar">
                {chat.media.map((media, index) => (
                  <div
                    className="relative "
                    key={media._id}
                    onMouseEnter={() => handleMouseEnterMedia(chat._id, index)}
                    onMouseLeave={handleMouseLeaveMedia}
                  >
                    {media.type === "image" ? (
                      <div className="relative h-36 mr-3">
                        <img
                          key={index}
                          src={media.url}
                          alt={media.name}
                          className="h-36 mt-1  rounded-md object-cover w-auto max-w-52"
                        />
                      </div>
                    ) : media.type === "video" ? (
                      <video
                        controls
                        className="h-36 object-cover mr-3 mt-1 rounded-md w-auto max-w-52"
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
                          className="absolute top-6 right-0  w-max dark:bg-tertiaryBackground-dark border
           dark:border-modalBorder-dark shadow-lg rounded-lg  z-10"
                          ref={addRef(chat._id, index, "media")}
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
                              {/* <img src={ReplyIcon} alt="reply" /> */}
                              <p
                                className="block ml-2 py-2 font-normal text-sm dark:text-primaryText-dark cursor-pointer"
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
              <div
                className={`flex flex-row overflow-x-auto w-4/5 custom-scrollbar overflow-y-hidden `}
              >
                {chat.media.map(
                  (media, index) =>
                    media.type === "document" && (
                      <div
                        className="w-max rounded-lg dark:bg-tertiaryBackground-dark mt-1.5  relative mr-3 "
                        onMouseEnter={() =>
                          handleMouseEnterDocument(chat._id, index)
                        }
                        onMouseLeave={handleMouseLeaveDocument}
                      >
                        <div className="flex flex-row items-center justify-start w-full">
                          <img
                            src={documentImage}
                            alt="Document Icon"
                            className="h-14 w-15 object-fill cursor-pointer pr-3"
                            onClick={() => handleClick(media)}
                          />
                          <div className="flex flex-col my-1  w-full-minus-68">
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
                              className="absolute top-5 right-0 w-max dark:bg-tertiaryBackground-dark border
           dark:border-modalBorder-dark shadow-lg rounded-lg  z-10 "
                              ref={addRef(chat._id, index, "document")}
                            >
                              <div
                                className="py-1"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="options-menu"
                              >
                                <div
                                  className="relative flex flex-row px-3 items-center"
                                  onClick={() =>
                                    handlePushResource(chat._id, media._id)
                                  }
                                >
                                  <p
                                    className="block ml-2 py-1 text-xs dark:text-primaryText-dark cursor-pointer "
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
            {chat.reactions &&
              chat.reactions.map((reaction, index) => (
                <div
                  key={index}
                  className="flex items-center dark:bg-chatBackground-dark rounded-full px-1 py-0.5 space-x-1 mb-2 cursor-pointer"
                  onClick={() => handleReactionClick(reaction.type, chat._id)}
                >
                  <span className="text-sm mb-0.5">{reaction.type}</span>
                  <span className="text-xs dark:text-secondaryText-dark pr-1">
                    {reaction.users.length}
                  </span>
                </div>
              ))}
          </div>

          {showReactionPicker && hoveredChatId === chat._id && (
            <div className="flex items-center absolute top-0 right-10 mt-6 space-x-2 p-1 dark:bg-tertiaryBackground-dark rounded-full z-10">
              {reactionsData.map((reaction, index) =>
                index === reactionsData.length - 1 ? (
                  <div className="flex flex-row items-center relative">
                    <div
                      key={index}
                      onClick={() => handleReactionClick(reaction, chat._id)}
                      className={`flex items-center text-center ${
                        index === 0 ? "dark:text-[#E63946]" : ""
                      } justify-center w-8 h-8 rounded-full hover:dark:bg-chatBackground-dark cursor-pointer`}
                    >
                      <span className="text-lg text-center mx-auto">
                        {reaction}
                      </span>
                    </div>
                    <img
                      src={Smiley}
                      alt="emoji"
                      className="cursor-pointer w-6 h-6 mx-0.5"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                      <div className="absolute top-6 right-0 bottom-full mb-2">
                        <EmojiPicker
                          onEmojiClick={(event, emojiObject) =>
                            handleReactionClick(event.emoji, chat._id)
                          }
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
                ) : (
                  <div
                    key={index}
                    onClick={() => handleReactionClick(reaction, chat._id)}
                    className="flex items-center text-center justify-center w-8 h-8 rounded-full hover:dark:bg-chatBackground-dark cursor-pointer"
                  >
                    <span className="text-lg text-center mx-auto">
                      {reaction}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PageChatData;
