import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";
import ProfileIcon from "../../../assets/icons/profile.svg";
import { useSelector } from "react-redux";

const DMMessages = ({}) => {
  const chats = useSelector((state) => state.dmChat.messages);
  const { username } = useParams();

  const handleChatNavigation = (chat) => {
    navigate(
      `${getAppPrefix()}/user/${username}/messages/list/${
        chat.otherUser.username
      }`
    );
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col mt-1 h-full">
      {chats.length !== 0 && (
        <div className=" h-full w-full pt-4 px-2">
          {chats.map((chat) => {
            return (
              <div
                key={chat._id}
                className={`flex flex-row justify-between px-3 items-center mb-4 
                sm:py-1.5 py-1 rounded-full cursor-pointer text-theme-secondaryText`}
                onClick={() => handleChatNavigation(chat)}
              >
                <div className="flex flex-row sm:space-x-4 space-x-2 items-center">
                  {chat.OtherUser?.logo ? (
                    <img
                      src={chat.otherUser?.logo}
                      alt="profile-icon"
                      className="rounded-full sm:w-11 sm:h-11 w-9 h-9 object-cover"
                    />
                  ) : chat.otherUser?.color_logo ? (
                    <div
                      className="rounded-full sm:w-11 sm:h-11 w-9 h-9 shrink-0"
                      style={{ backgroundColor: chat.otherUser?.color_logo }}
                    ></div>
                  ) : (
                    <img
                      src={ProfileIcon}
                      alt="profile-icon"
                      className="rounded-full sm:w-11 sm:h-11 w-9 h-9 object-cover"
                    />
                  )}
                  <p className="sm:text-lg text-md font-normal pb-1 tracking-wide">
                    {chat.otherUser.username}
                  </p>
                </div>
                {/* {chat.unread > 0 && (
                  <div className="bg-theme-sidebarColor rounded-full px-1 text-xs">
                    {chat.unread}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      )}
      {chats.length === 0 && (
        <div
          className="bg-theme-secondaryBackground h-full w-full mx-auto items-center flex flex-col
         justify-center text-theme-secondaryText sm:text-2xl text-lg"
        >
          No Conversation ...Start one
        </div>
      )}
    </div>
  );
};

export default DMMessages;
