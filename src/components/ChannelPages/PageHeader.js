import DropDown from "../../assets/icons/arrow_drop_down.svg";
import DropDownLight from "../../assets/lightIcons/arrow_drop_down_light.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import { fetchOtherTopics } from "../../redux/slices/reorderTopicSlice.js";
import {
  setCreateTopicField,
  setCreateTopicItems,
} from "../../redux/slices/createTopicSlice";
import { fetchChannels } from "./../../redux/slices/channelItemsSlice";
import {
  createTopicInvite,
  setTopicField,
} from "../../redux/slices/topicSlice";
import { setModalModal } from "../../redux/slices/modalSlice";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";

import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useModal,
  isEmbeddedOrExternal,
} from "../../globals/imports";

const PageHeader = ({
  channelName,
  topic,
  topicId,
  toggleBottomSheet,
  // toggleSidebar,
  isOpen,
  // isSidebarOpen,
  username,
  channelId,
}) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const reorderTopics = useSelector((state) => state.reorderTopic);
  const channels = useSelector((state) => state.channelItems.channels);
  const myData = useSelector((state) => state.myData);
  const [channelsData, setChannelsData] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const handleEditModal = () => {
    const transformedData = {
      ...topic,
    };
    dispatch(setCreateTopicItems(transformedData));
    dispatch(setCreateTopicField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalTopicOpen");
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (username && !hasFetched.current) {
      dispatch(fetchChannels(username))
        .unwrap()
        .then((channels) => {
          setChannelsData(channels);
          hasFetched.current = true;
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [username, dispatch]);

  // useEffect(() => {
  //   dispatch(fetchChannels(username));
  // }, []);

  useEffect(() => {
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", topicId);
    formDataToSend.append("channelId", channelId);
    dispatch(fetchOtherTopics(formDataToSend));
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOwnerShareTopic = (id) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    dispatch(setModalModal({ field: "channelId", value: channelId }));
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", id);
    formDataToSend.append("channelId", channelId);
    dispatch(createTopicInvite(formDataToSend))
      .unwrap()
      .then((invite) => {
        // console.log(invite.code);
        dispatch(setTopicField({ field: "code", value: invite.code }));
        setTimeout(() => {
          handleOpenModal("modalShareTopicOpen", id);
        }, 500);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const toggleTopic = (newTopicId) => {
    navigate(
      `${getAppPrefix()}/user/${username}/channel/${channelId}/c-id/topic/${newTopicId}`
    );
  };

  const toggleChannel = (newChannelId) => {
    navigate(`${getAppPrefix()}/user/${username}/channel/${newChannelId}`);
  };

  const handleBrandProfile = () => {
    navigate(`${getAppPrefix()}/user/${username}/profile`);
  };

  const handleMessagePage = () => {
    navigate(`${getAppPrefix()}/user/${myData.username}/messages/list`);
  };

  const isOwner = topic.user === myData._id;

  return (
    <div className="flex flex-col w-full bg-theme-secondaryBackground border-b border-b-theme-chatDivider">
      <div
        className={`flex flex-row ${
          isEmbeddedOrExternal() ? "" : "py-3"
        }  justify-between items-center px-6 `}
      >
        {/* <div
            className="flex-row items-center w-max cursor-pointer sm:hidden flex"
            // onClick={toggleBottomSheet}
          >
            <p className="text-theme-secondaryText text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>
          </div> */}
        {!isEmbeddedOrExternal() && (
          <div className="flex-row items-center flex relative">
            <p className="sm:hidden flex text-theme-secondaryText xs:text-xl text-lg sm:text-2xl font-normal font-inter tracking-wide">
              {channelName.charAt(0).toUpperCase() + channelName.slice(1)}
            </p>
            <p className="sm:flex hidden text-theme-secondaryText text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>

            <img
              src={DropDown}
              alt="arrow-right"
              className="hidden dark:inline-block w-6 h-6 ml-1 cursor-pointer sm:hidden"
              onClick={toggleDropdown}
            />

            <img
              src={DropDownLight}
              alt="arrow-right"
              className="inline-block dark:hidden w-6 h-6 ml-1 cursor-pointer sm:hidden"
              onClick={toggleDropdown}
            />

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 top-6 mt-2 w-max rounded-md shadow-lg border 
      border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {channelsData?.map(
                    (channel) =>
                      channel.name !== channelName && (
                        <div
                          key={channel._id}
                          className="flex px-3 items-center sm:py-2 py-2 text-center 
                          text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                          onClick={() => toggleChannel(channel._id)}
                        >
                          <p className="mr-1">{channel.name}</p>
                        </div>
                      )
                  )}
                  <div className="border-t border-t-theme-chatDivider"></div>
                  <p
                    className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                    onClick={handleBrandProfile}
                  >
                    Brand Profile
                  </p>
                  <div className="border-t border-t-theme-chatDivider"></div>
                  <p
                    className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                    onClick={handleMessagePage}
                  >
                    Messages
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* {isEmbeddedOrExternal() && ( */}
        {!isEmbeddedOrExternal() && (
          <div
            className="rounded-full h-7 w-7 sm:hidden flex"
            onClick={() =>
              navigate(`/embed/channels/user/${myData.username}/profile`)
            }
          >
            {/* <img
            src={myData.logo ? myData.logo : ProfileIcon}
            alt="profile"
            className="w-full h-full object-cover cursor-pointer"
          /> */}
            {myData.logo ? (
              <img
                src={myData.logo}
                alt="profile-icon"
                className="rounded-full w-full h-full object-cover shrink-0"
              />
            ) : myData?.color_logo ? (
              <div
                className="rounded-full w-full h-full shrink-0"
                style={{ backgroundColor: myData.color_logo }}
              ></div>
            ) : (
              <img
                src={ProfileIcon}
                alt="profile-icon"
                className="rounded-full w-full h-full object-cover shrink-0"
              />
            )}
          </div>
        )}
        {/* )} */}
        {/* <p className="text-xs text-theme-primaryText font-normal tracking-tight">
            {topic.allowedVisibleUsers.length} members
          </p> */}
      </div>
      {/* <div className="block border  border-theme-chatDivider mt-1"></div> */}
      <div className="sm:hidden flex flex-row space-x-3 w-full overflow-x-auto pl-6 pr-2 pt-0.5 mb-0.5 pb-3">
        {reorderTopics.otherTopics.map((topic) => {
          return (
            <div
              key={topic._id}
              className={`flex ${
                topic._id === topicId
                  ? "bg-theme-secondaryText text-theme-primaryBackground"
                  : "border flex-flex-row border-theme-emptyEvent text-theme-secondaryText"
              } px-3  items-center font-light
                sm:py-1.5 py-1 text-center  whitespace-nowrap rounded-full cursor-pointer`}
              onClick={() => toggleTopic(topic._id)}
            >
              <p className="mr-1 text-xs">{topic.name}</p>
              {/* {topic.unreadCount > 0 && (
                <div className="w-5 h-5 flex items-center justify-center text-xs bg-theme-sidebarColor rounded-full text-theme-secondaryText">
                  {topic.unreadCount}
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PageHeader;
