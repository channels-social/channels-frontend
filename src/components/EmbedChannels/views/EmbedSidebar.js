import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import ArrowUp from "../../../assets/icons/up-arrow.svg";
import Logo from "../../../assets/icons/logo.svg";
import Add from "../../../assets/icons/add_btn.svg";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import { useDispatch, useSelector } from "react-redux";
import { setEmbedCredentials } from "../embedSlices/embedAuthSlice";

import {
  setCreateTopicField,
  clearCreateTopic,
} from "./../../../redux/slices/createTopicSlice";
import useModal from "./../../hooks/ModalHook";
import Close from "../../../assets/icons/Close.svg";
import SidebarSkeleton from "./../../skeleton/SidebarSkeleton";
import { domainUrl } from "./../../../utils/globals";

const EmbedSidebar = ({
  closeSidebar,
  channels,
  selectedChannel,
  selectedTopic,
  loading,
}) => {
  const location = useLocation();
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [expandedCommunityChannel, setExpandedCommunityChannel] =
    useState(false);
  const [expandedChannels, setExpandedChannels] = useState({});

  const galleryUsername = useSelector((state) => state.galleryData.username);
  const domain = window.location.href;

  const handleChannelModal = () => {
    handleOpenModal("modalChannelOpen");
  };
  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));

    handleOpenModal("modalTopicOpen");
  };
  const toggleChannel = (id, username) => {
    closeSidebar();
    navigate(`/user/${username}/channel/${id}`);
  };

  useEffect(() => {
    const initialExpandedState = {};
    channels.forEach((channel) => {
      initialExpandedState[channel._id] = channel._id === selectedChannel;
    });
    setExpandedChannels(initialExpandedState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedChannel, channels.length]);

  const toggleChannelExpanded = (channelId) => {
    if (expandedCommunityChannel === true) {
      setExpandedCommunityChannel(false);
    }
    setExpandedChannels((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const handleLogout = () => {
    closeSidebar();
    handleOpenModal("modalLogoutOpen");
  };

  const handleLogin = () => {
    const loginWindow = window.open(
      `https://channels.social/embed/channels/auth-login?redirectDomain=${domain}`,
      "LoginPopup",
      "width=600,height=600"
    );

    const messageListener = (event) => {
      if (event.origin !== "https://channels.social") return;

      const { success, user, token } = event.data;
      if (success && token) {
        dispatch(setEmbedCredentials({ user, token }));
        StorageManager.setItem("auth_token", token);
        StorageManager.setItem("user", JSON.stringify(user));

        loginWindow.close();

        window.location.reload();
      }
      window.removeEventListener("message", messageListener);
    };

    window.addEventListener("message", messageListener);
  };

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto custom-side-scrollbar">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>

        <div className="ml-6 mt-4" onClick={() => navigate(`/`)}>
          <img
            src={Logo}
            alt="logo"
            className="cursor-pointer  w-8 h-8   rounded-sm object-contain"
          />
        </div>

        <nav className="mt-2">
          {channels.map((channel, channelIndex) => (
            <div key={channel._id} className="flex flex-col">
              <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>
              <div
                className={`flex flex-row justify-between px-6 mb-1 items-center cursor-pointer
               ${
                 location.pathname ===
                 `/user/${channel?.user?.username}/channel/${channel._id}`
                   ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3 py-1"
                   : "dark:text-primaryText-dark"
               }
                 `}
              >
                <p
                  className="text-sm font-normal font-inter dark:text-primaryText-dark"
                  onClick={() =>
                    toggleChannel(channel._id, channel.user.username)
                  }
                >
                  {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}
                </p>
                <img
                  src={expandedChannels[channel._id] ? ArrowUp : ArrowDown}
                  onClick={() => toggleChannelExpanded(channel._id)}
                  alt={
                    expandedChannels[channel._id] ? "up-arrow" : "down-arrow"
                  }
                  className="h-7 w-7"
                />
              </div>
              {expandedChannels[channel._id] && (
                <div className="">
                  {channel.topics.map(
                    (topic, topicIndex) =>
                      (channel.visibility === "anyone" ||
                        channel.user._id === myData._id) && (
                        <div key={topic._id}>
                          <Link
                            to={`/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`}
                            className={`block ${
                              location.pathname ===
                              `/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`
                                ? "dark:bg-tertiaryBackground-dark rounded-lg mx-3 my-1"
                                : ""
                            } px-6 py-2.5 text-sm font-inter font-light cursor-pointer dark:text-primaryText-dark`}
                            onClick={closeSidebar}
                          >
                            # {topic.name}
                          </Link>
                        </div>
                      )
                  )}
                  {channel.user._id === myData._id && (
                    <div
                      className="flex flex-row items-center w-max mx-6 my-1.5 cursor-pointer  "
                      onClick={() => handleTopicModal(channel._id)}
                    >
                      <p className="dark:text-primaryText-dark text-md">+</p>
                      <p className="text-sm font-normal font-inter ml-2 dark:text-primaryText-dark ">
                        Add a topic
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>

          {isLoggedIn && (
            <div
              className="flex items-center px-6 py-2 mb-2 cursor-pointer rounded-lg "
              onClick={handleChannelModal}
            >
              <img src={Add} alt="Add Channel" className="w-6" />
              <p className="text-sm font-normal font-inter dark:text-primaryText-dark pl-2">
                Create a new channel
              </p>
            </div>
          )}
        </nav>
      </div>
      <div className="mb-2 mt-2">
        <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>
        {isLoggedIn && (
          <p
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 dark:text-primaryText-dark`}
            onClick={handleLogout}
          >
            Logout
          </p>
        )}
        {!isLoggedIn && (
          <p
            onClick={handleLogin}
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6  dark:text-primaryText-dark`}
          >
            Login
          </p>
        )}
      </div>
    </div>
  );
};

export default EmbedSidebar;
