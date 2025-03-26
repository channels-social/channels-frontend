import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import ArrowUp from "../../assets/icons/up-arrow.svg";
import Logo from "../../assets/icons/logo.svg";
import Add from "../../assets/icons/add_btn.svg";
import ArrowDown from "../../assets/icons/arrow_drop_down.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyChannels,
  fetchCommunityChannel,
} from "./../../redux/slices/channelItemsSlice";
import {
  setCreateTopicField,
  clearCreateTopic,
} from "./../../redux/slices/createTopicSlice";
import useModal from "./../hooks/ModalHook";
import Close from "../../assets/icons/Close.svg";
import SidebarSkeleton from "./../skeleton/SidebarSkeleton";
import { domainUrl } from "./../../utils/globals";

const UserSidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [expandedChannels, setExpandedChannels] = useState({});
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [expandedCommunityChannel, setExpandedCommunityChannel] =
    useState(false);
  const galleryUsername = useSelector((state) => state.galleryData.username);

  const { channels, loading, error, communityChannel } = useSelector(
    (state) => state.channelItems
  );
  const { channelId } = useParams();

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

  const toggleChannelExpanded = (channelId) => {
    if (expandedCommunityChannel === true) {
      setExpandedCommunityChannel(false);
    }
    setExpandedChannels((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const handleCommunityExpansion = () => {
    if (expandedCommunityChannel === false) {
      setExpandedChannels({});
    }
    setExpandedCommunityChannel(!expandedCommunityChannel);
  };

  useEffect(() => {
    dispatch(fetchMyChannels()).then(() => {
      const initialExpandedState = {};
      channels.forEach((channel) => {
        initialExpandedState[channel._id] = channel._id === channelId;
      });
      setExpandedChannels(initialExpandedState);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, channelId, channels.length]);

  useEffect(() => {
    dispatch(fetchCommunityChannel());
  }, [dispatch]);

  const handleLogout = () => {
    closeSidebar();
    handleOpenModal("modalLogoutOpen");
  };

  const handleFeedbackModal = () => {
    handleOpenModal("modalFeedbackOpen");
  };

  const handleLogin = () => {
    if (isSubdomain) {
      window.location.replace(
        `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}`
      );
    } else {
      navigate("/get-started");
    }
  };

  if (loading) {
    return <SidebarSkeleton />;
  }
  if (error) return <p>Error loading channels: {error}</p>;
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
            className="cursor-pointer  w-9 h-9   rounded-sm object-contain"
          />
          {/* {myData.logo ? (
            <img
              src={myData.logo}
              alt="logo"
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase()
          )} */}
        </div>

        <nav className="mt-6">
          <Link
            to={`/user/${myData.username}/welcome`}
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
              location.pathname === `/user/${myData.username}/welcome`
                ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
                : "dark:text-primaryText-dark"
            }`}
            onClick={closeSidebar}
          >
            Welcome to Channels
          </Link>

          {isLoggedIn && (
            <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>
          )}

          {isLoggedIn && (
            <Link
              to={`/user/${myData.username}/profile`}
              className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
                location.pathname === `/user/${myData?.username}/profile`
                  ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
                  : "dark:text-primaryText-dark"
              }`}
              onClick={closeSidebar}
            >
              Profile
            </Link>
          )}

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
        <div
          className={`flex flex-row justify-between pl-6 pr-4 mb-1 items-center cursor-pointer  ${
            location.pathname ===
            `/user/${communityChannel?.user?.username}/channel/${communityChannel?._id}`
              ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3 "
              : "dark:text-primaryText-dark"
          } `}
        >
          <Link
            to={`/user/${communityChannel?.user?.username}/channel/${communityChannel?._id}`}
            className={`block py-2.5 text-sm font-inter font-light cursor-pointer dark:text-primaryText-dark `}
            onClick={closeSidebar}
          >
            Channels Community
          </Link>
          <img
            src={expandedCommunityChannel ? ArrowUp : ArrowDown}
            onClick={handleCommunityExpansion}
            alt={expandedCommunityChannel ? "up-arrow" : "down-arrow"}
            className="h-7 w-7"
          />
        </div>
        <div>
          {expandedCommunityChannel &&
            communityChannel?.topics?.map((topic, topicIndex) => (
              <div key={topic._id}>
                <Link
                  to={`/user/${communityChannel?.user?.username}/channel/${communityChannel._id}/c-id/topic/${topic._id}`}
                  className={`block ${
                    location.pathname ===
                    `/user/${communityChannel?.user?.username}/channel/${communityChannel._id}/c-id/topic/${topic._id}`
                      ? "dark:bg-tertiaryBackground-dark rounded-lg mx-3 my-1"
                      : ""
                  } px-6 py-2.5 text-sm font-inter font-light cursor-pointer dark:text-primaryText-dark`}
                >
                  # {topic.name}
                </Link>
              </div>
            ))}
        </div>
        <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>

        <div
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 dark:text-primaryText-dark`}
          onClick={handleFeedbackModal}
        >
          Feedback
        </div>
        <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>
        <a
          href="https://calendly.com/channels_social/talk-to-us"
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 dark:text-primaryText-dark`}
        >
          Help
        </a>

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

export default UserSidebar;
