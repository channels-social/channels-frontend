import React, { useState, useEffect } from "react";
import {
  useLocation,
  Link,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";
import ArrowUp from "../../assets/icons/up-arrow.svg";
import Add from "../../assets/icons/add_btn.svg";
import ArrowDown from "../../assets/icons/arrow_drop_down.svg";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyChannels } from "./../../redux/slices/channelItemsSlice";
import {
  setCreateTopicField,
  clearCreateTopic,
} from "./../../redux/slices/createTopicSlice";
import useModal from "./../hooks/ModalHook";
import Close from "../../assets/icons/Close.svg";

const UserSidebar = ({ username, closeSidebar }) => {
  const location = useLocation();
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [expandedChannels, setExpandedChannels] = useState({});
  const myData = useSelector((state) => state.myData);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const { channels, selectedChannel, selectedPage, loading, error } =
    useSelector((state) => state.channelItems);

  const handleChannelModal = () => {
    handleOpenModal("modalChannelOpen");
  };
  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));

    handleOpenModal("modalTopicOpen");
  };
  const toggleChannel = (id) => {
    navigate(`channel/${id}`);
  };

  const toggleChannelExpanded = (channelId) => {
    setExpandedChannels((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const handleTopicSelect = (topicId, channelName, topicName) => {
    setSelectedTopic(topicId);
  };

  useEffect(() => {
    dispatch(fetchMyChannels()).then(() => {
      const initialExpandedState = {};
      channels.forEach((channel) => {
        initialExpandedState[channel._id] = false;
      });
      setExpandedChannels(initialExpandedState);
    });
  }, [dispatch, channels.length]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) return <p>Error loading channels: {error}</p>;
  return (
    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto custom-scrollbar">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>

        <div className="rounded-lg dark:text-primaryBackground-dark font-medium  dark:bg-white w-8 h-8 text-center ml-6 mt-4">
          {myData.logo ? (
            <img
              src={myData.logo}
              alt="logo"
              className="w-full h-full rounded-lg object-cover"
            />
          ) : (
            username.charAt(0).toUpperCase() + username.charAt(1).toUpperCase()
          )}
        </div>

        <nav className="mt-6">
          <Link
            to={`/user/${username}/welcome`}
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
              location.pathname === `/user/${username}/welcome`
                ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
                : "dark:text-primaryText-dark"
            }`}
          >
            Welcome to Channels
          </Link>

          <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>

          <Link
            to={`/user/${username}/profile`}
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
              location.pathname === `/user/${username}/profile`
                ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
                : "dark:text-primaryText-dark"
            }`}
          >
            Profile
          </Link>
          {channels.map((channel, channelIndex) => (
            <div key={channel._id} className="flex flex-col">
              <div className="border border-[1] dark:border-tertiaryBackground-dark my-3"></div>
              <div
                className={`flex flex-row justify-between px-6 mb-1 items-center cursor-pointer
              ${
                location.pathname === `/user/${username}/channel/${channel._id}`
                  ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3 py-1"
                  : "dark:text-primaryText-dark"
              } 
                `}
              >
                <p
                  className="text-sm font-normal font-inter dark:text-primaryText-dark"
                  onClick={() => toggleChannel(channel._id)}
                >
                  {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}
                </p>
                <img
                  src={expandedChannels[channelIndex] ? ArrowUp : ArrowDown}
                  onClick={() => toggleChannelExpanded(channelIndex)}
                  alt={
                    expandedChannels[channelIndex] ? "up-arrow" : "down-arrow"
                  }
                  className="h-7 w-7"
                />
              </div>
              {expandedChannels[channelIndex] && (
                <div className="">
                  {channel.topics.map(
                    (topic, topicIndex) =>
                      (topic.visibility === "anyone" ||
                        channel.user === myData._id) && (
                        <div key={topic._id}>
                          <Link
                            to={`/user/${username}/channel/${channel._id}/c-id/${channel._id}/topic/${topic._id}`}
                            className={`block ${
                              location.pathname ===
                              `/user/${username}/channel/${channel._id}/c-id/${channel._id}/topic/${topic._id}`
                                ? "dark:bg-tertiaryBackground-dark rounded-lg mx-3 my-1"
                                : ""
                            } px-6 py-2.5 text-sm font-inter font-light cursor-pointer dark:text-primaryText-dark`}
                          >
                            # {topic.name}
                          </Link>
                        </div>
                      )
                  )}
                  <p
                    className="text-sm font-normal cursor-pointer my-1.5 mx-6 font-inter dark:text-primaryText-dark "
                    onClick={() => handleTopicModal(channel._id)}
                  >
                    # Add a topic
                  </p>
                </div>
              )}
            </div>
          ))}
          <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>

          <div
            className="flex items-center px-6 py-2 cursor-pointer rounded-lg "
            onClick={handleChannelModal}
          >
            <img src={Add} alt="Add Channel" className="w-6" />
            <p className="text-sm font-normal font-inter dark:text-primaryText-dark pl-2">
              Create a channel
            </p>
          </div>
        </nav>
      </div>
      <div className="mb-2 mt-2">
        {/* <Link
          to="/user/username/account"
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
            location.pathname === `/user/${username}/account`
              ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
              : "dark:text-primaryText-dark"
          }`}
        >
          Account Settings
        </Link> */}

        <div className="border border-[1] dark:border-tertiaryBackground-dark my-2"></div>

        <Link
          to="/user/username/community"
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
            location.pathname === `/user/${username}/community`
              ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg mx-3"
              : "dark:text-primaryText-dark"
          }`}
        >
          Channels Community
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
