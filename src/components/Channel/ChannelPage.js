import ChannelCover from "../../assets/channel_images/channel_cover.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import Settings from "../../assets/icons/setting.svg";
import Edit from "../../assets/icons/Edit.svg";
import EditLight from "../../assets/lightIcons/edit_light.svg";
import Stack from "../../assets/icons/stack.svg";
import StackLight from "../../assets/lightIcons/curation_light.svg";
import ChannelLogo from "../../assets/icons/default_channel_logo.svg";
import { createGeneralTopic } from "./../../redux/slices/channelItemsSlice";
import Dots from "../../assets/icons/three_dots.svg";
import DotsLight from "../../assets/lightIcons/faqs_dots_light.svg";
import {
  clearCreateTopic,
  setCreateTopicField,
} from "./../../redux/slices/createTopicSlice";
import {
  setChannelField,
  removeCover,
  saveCover,
  fetchChannel,
  createChannelInvite,
  joinChannel,
  leaveChannel,
} from "../../redux/slices/channelSlice.js";
import {
  setCreateChannelField,
  setCreateChannelItems,
} from "../../redux/slices/createChannelSlice.js";
import { setModalModal } from "../../redux/slices/modalSlice.js";

import ChannelSkeleton from "./../skeleton/channelSkeleton";
import InviteChannelPage from "./InviteChannelPage";
import { domainUrl } from "./../../utils/globals";
import { fetchTopics } from "../../redux/slices/reorderTopicSlice.js";
import TopicsTab from "./Tabs/TopicsTab";
import MembersTab from "./Tabs/MembersTab";
import Compressor from "compressorjs";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";
import Delete from "../../assets/icons/Delete.svg";
import DeleteLight from "../../assets/lightIcons/delete_light.svg";

import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSearchParams,
  useSelector,
  useParams,
  useModal,
  useLocation,
  isEmbeddedOrExternal,
} from "../../globals/imports";
import {
  setChannelIdToDelete,
  setChannelNameToDelete,
} from "../../redux/slices/deleteChannelSlice.js";

const ChannelPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(null);
  const dropdownEditRef = useRef(null);
  const navigate = useNavigate();
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channel);

  const loading = useSelector((state) => state.channel.loading);
  const channelstatus = useSelector((state) => state.channel.channelstatus);
  const [file, setFile] = useState(null);
  const [isEditCover, setIsEditCover] = useState(null);

  const location = useLocation();
  const fromGallery = location.state?.fromGallery;
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const params = useParams();
  const { channelId } = params;
  const username = fromGallery ? galleryUsername : params.username || "";

  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [activeTab, setActiveTab] = useState("topics");

  const tabs = [
    { id: 1, name: "Topics", href: "topics" },
    { id: 2, name: "Members", href: "members" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEditRef.current &&
        !dropdownEditRef.current.contains(event.target)
      ) {
        setIsEditDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab === "members") {
      setActiveTab(tab);
    } else {
      setActiveTab("topics");
    }
  }, []);

  const handleTabClick = (event, href) => {
    event.preventDefault();
    const scrollY = window.scrollY;
    setActiveTab(href);
    if (href === "topics") {
      window.history.pushState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `?tab=${href}`);
    }
    window.scrollTo(0, scrollY);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleEditDropdown = (id) => {
    setIsEditDropdownOpen(id);
  };

  useEffect(() => {
    if (channelId) {
      dispatch(fetchChannel(channelId));
      dispatch(fetchTopics(channelId));
    }
  }, [channelId, dispatch]);

  const closeDropdown = (event) => {
    setIsDropdownOpen(false);
  };

  const handleShareChannel = (id) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    handleOpenModal("modalShareChannelOpen", id);
  };
  const handleOwnerShareChannel = (id) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    dispatch(createChannelInvite(id))
      .unwrap()
      .then((invite) => {
        dispatch(setChannelField({ field: "code", value: invite.code }));
        setTimeout(() => {
          handleOpenModal("modalShareChannelOpen", id);
        }, 500);
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleCreateTopic = () => {
    if (channel._id) {
      dispatch(createGeneralTopic(channel._id))
        .unwrap()
        .then((topic) => {
          navigate(`c-id/topic/${topic._id}`);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));
    handleOpenModal("modalTopicOpen");
  };
  const handleReorderTopicModal = (channelId) => {
    handleOpenModal("modalTopicReorderOpen", channelId);
  };

  const handleRemoveCover = () => {
    setFile(null);
    dispatch(removeCover(channel._id));
    dispatch(setChannelField({ field: "cover_image", value: "" }));
    dispatch(setChannelField({ field: "imageSource", value: "" }));
    closeDropdown();
  };
  const handleSaveCover = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("channel", channel._id);
    if (file) {
      formDataToSend.append("file", file);
    }
    dispatch(saveCover(formDataToSend))
      .unwrap()
      .then(() => {
        setIsEditCover(false);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleCoverUpload = (event) => {
    closeDropdown();
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert(
          `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
        );
        return;
      }
      if (file.size >= 7 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.6,
          maxWidth: 1920,
          maxHeight: 1080,
          success(result) {
            setFile(result);
            const reader = new FileReader();
            reader.onloadend = () => {
              dispatch(
                setChannelField({ field: "cover_image", value: reader.result })
              );
              dispatch(
                setChannelField({ field: "imageSource", value: "upload" })
              );
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            alert("Image compression failed: " + err);
          },
        });
      } else {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(
            setChannelField({ field: "cover_image", value: reader.result })
          );
          dispatch(setChannelField({ field: "imageSource", value: "upload" }));
        };
        reader.readAsDataURL(file);
      }

      setIsEditCover(true);
    }
  };

  const handleEditChannel = () => {
    const transformedData = {
      ...channel,
    };
    dispatch(setCreateChannelItems(transformedData));
    dispatch(setCreateChannelField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalChannelOpen");
    }, 500);
  };
  const handleJoinChannel = (channel) => {
    if (isLoggedIn) {
      if (channel?.members?.includes(myData?._id)) {
        navigate(
          `${getAppPrefix()}/user/${username}/channel/${
            channel._id
          }/c-id/topic/${channel.topics[0]}`
        );
      } else if (channel?.requests?.includes(myData?._id)) {
        return;
      } else {
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
            if (response.visit) {
              if (response.channel.topics.length > 0) {
                navigate(
                  `${getAppPrefix()}/user/${username}/channel/${
                    channel._id
                  }/c-id/topic/${response.channel.topics[0]}`
                );
              } else {
                navigate(
                  `${getAppPrefix()}/user/${username}/channel/${channel._id}`
                );
              }
            }
          })
          .catch((error) => {
            alert(error);
          });
      }
    } else {
      if (isSubdomain) {
        window.location.replace(
          `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}&redirect=/user/${username}/channel/${channel._id}`
        );
      } else {
        navigate(
          `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/user/${username}/channel/${
            channel._id
          }`
        );
      }
    }
  };

  const handleLeaveChannel = () => {
    dispatch(setModalModal({ field: "channelId", value: channel._id }));
    handleOpenModal("modalLeaveChannelOpen");
    // if (isLoggedIn) {
    //   dispatch(leaveChannel(channel._id))
    //     .unwrap()
    //     .then((response) => {
    //       if (response.sucess) {
    //         navigate(`${getAppPrefix()}/user/${myData.username}/profile`);
    //       }
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     });
    // }
  };

  if (loading) {
    return <ChannelSkeleton />;
  }

  if (inviteCode) {
    dispatch(setChannelField({ field: "loading", value: false }));
    return (
      <InviteChannelPage
        code={inviteCode}
        channelId={channelId}
        username={username}
      />
    );
  }

  const isOwner = myData?._id.toString() === channel?.user?.toString();

  // console.log(myData);
  // console.log(isOwner);
  // console.log(channel.user);
  return (
    <div className="bg-theme-secondaryBackground w-full h-full flex flex-col overflow-y-auto">
      <div className="relative w-full h-44 shrink-0">
        <img
          src={channel.cover_image ? channel.cover_image : ChannelCover}
          alt="channel-cover"
          onClick={closeDropdown}
          className="w-full h-full object-cover shrink-0"
          loading="lazy"
        />
        {!isEmbeddedOrExternal() && (
          <div className="sm:hidden absolute left-6 top-3 text-theme-secondaryText">
            <img
              src={ArrowBack}
              alt="arrow-back"
              className="text-theme-secondaryText w-5 h-5 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>
        )}
        {isEditCover && (
          <div
            className="absolute left-3 top-3 cursor-pointer bg-theme-secondaryText px-3 text-sm font-light py-1.5
         text-theme-primaryBackground rounded-lg"
            onClick={handleSaveCover}
          >
            {channelstatus === "loading" ? "Saving" : "Save"}
          </div>
        )}
      </div>
      {isOwner && (
        <div className="absolute right-4 sm:top-2 top-14">
          <img
            src={Settings}
            alt="settings"
            className=" w-6 h-6 cursor-pointer"
            onClick={toggleDropdown}
          />
          {/* <img
            src={SettingsLight}
            alt="settings"
            className="dark:hidden w-6 h-6 cursor-pointer"
            onClick={toggleDropdown}
          /> */}
        </div>
      )}

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-8 right-4 mt-2 w-max rounded-md shadow-lg
          bg-theme-dropdown  z-50"
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              className="relative flex flex-row px-4 items-center"
              // onClick={handleOpenCover}
            >
              <img src={Edit} alt="edit" className="dark:block hidden " />
              <img src={EditLight} alt="edit" className="dark:hidden" />
              <p
                className="block ml-2 py-2 text-sm text-theme-primaryText cursor-pointer"
                role="menuitem"
              >
                Edit cover
              </p>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleCoverUpload}
              />
            </div>
            <div
              className="flex flex-row px-4 items-center"
              onClick={handleRemoveCover}
            >
              <img
                src={Stack}
                alt="edit"
                className="dark:block hidden w-4 h-4"
              />
              <img
                src={StackLight}
                alt="edit"
                className="dark:hidden w-4 h-4"
              />
              <p
                className="block ml-2 py-2 text-sm text-theme-primaryText cursor-pointer"
                role="menuitem"
              >
                Remove cover
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row items-start w-full mt-4 px-4">
        {channel.logo ? (
          <img
            src={channel.logo}
            alt="logo"
            className="rounded-lg object-cover w-20 h-20 mt-1 flex-shrink-0"
            loading="lazy"
          />
        ) : (
          <img
            src={ChannelLogo}
            alt="logo"
            className="rounded-lg object-cover w-20 h-20 mt-1 flex-shrink-0"
          />
        )}

        <div className="flex flex-col ml-5 w-full">
          <div className="flex flex-row justify-between items-center">
            <p className=" text-lg sm:text-xl text-theme-secondaryText font-inter font-[500]">
              {channel.name}
            </p>
            {/* <img src={SettingIcon} alt="setting-icon" className=" w-5 h-5" /> */}
          </div>
          <p className="text-xs text-theme-emptyEvent font-light">
            {channel.members.length} members
          </p>
          <p
            className="mt-0.5 text-sm font-light text-theme-primaryText mb-1"
            style={{ whiteSpace: "pre-line" }}
          >
            {channel.description}
          </p>
          <div className="flex flex-row space-x-4 mt-2">
            {isOwner ? (
              <div
                className="py-2 px-3 cursor-pointer text-theme-primaryBackground bg-theme-secondaryText rounded-lg text-sm font-inter"
                onClick={() => handleOwnerShareChannel(channel._id)}
              >
                Share join link
              </div>
            ) : channel.members?.includes(myData?._id) && myData?._id ? (
              <div
                className={`border border-theme-primaryText py-2 px-3 rounded-lg cursor-pointer text-theme-secondaryText text-sm font-inter`}
                onClick={() => handleLeaveChannel(channel)}
              >
                Exit channel
              </div>
            ) : (
              <div
                className={`py-2 px-3 cursor-pointer  text-center
                  ${
                    channel.requests?.includes(myData?._id)
                      ? "bg-theme-buttonDisable text-theme-buttonDisableText"
                      : "bg-theme-secondaryText text-theme-primaryBackground"
                  }
                   rounded-lg text-sm font-inter`}
                onClick={() => handleJoinChannel(channel)}
              >
                {channel.requests?.includes(myData?._id)
                  ? "Requested"
                  : "Join channel"}
              </div>
            )}
            {isOwner ? (
              // <div
              //   className="border border-theme-primaryText py-2 px-3 rounded-lg cursor-pointer text-theme-secondaryText text-xs sm:text-sm font-inter"
              //   onClick={handleEditChannel}
              // >
              //   Edit Channel
              // </div>
              <div className="relative flex items-center">
                <img
                  src={Dots}
                  alt="dots"
                  className="dark:block hidden w-6 h-6 mr-2 cursor-pointer"
                  onClick={() => toggleEditDropdown(channel._id)}
                />
                <img
                  src={DotsLight}
                  alt="dots"
                  className="dark:hidden w-6 h-6 mr-2 cursor-pointer"
                  onClick={() => toggleEditDropdown(channel._id)}
                />
                {isEditDropdownOpen === channel._id && (
                  <div
                    ref={dropdownEditRef}
                    className="absolute top-6 left-0 mt-1 ml-3 w-24 rounded-md shadow-lg border  border-theme-chatDivider
                             bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div className="flex flex-row px-3 items-center">
                        <img
                          src={Edit}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={EditLight}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                          onClick={handleEditChannel}
                        >
                          Edit
                        </p>
                      </div>
                      <div
                        className="flex flex-row px-3 items-center"
                        onClick={(e) => {
                          dispatch(setChannelIdToDelete(channel._id));
                          dispatch(setChannelNameToDelete(channel.name));
                          handleOpenModal("modalDeleteChannelOpen");
                        }}
                      >
                        <img
                          src={Delete}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={DeleteLight}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`py-2 px-3 rounded-lg cursor-pointer ${
                  channel.members?.includes(myData?._id)
                    ? "bg-theme-secondaryText text-theme-primaryBackground text-sm"
                    : "border border-theme-primaryText text-theme-secondaryText text-sm font-inter"
                } `}
                onClick={() => handleShareChannel(channel._id)}
              >
                Share Invite
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-3">
        <div className="border-t my-4 border-t-theme-chatDivider "></div>
        {isLoggedIn && channel.topics.length === 0 && (
          <p className="mt-2 text-xl text-theme-secondaryText font-inter font-normal">
            Topics
          </p>
        )}
        {channel.topics.length === 0 && channel.user === myData._id && (
          <div className="mt-2 flex flex-row space-x-3">
            <div className="p-4 bg-theme-sidebarBackground rounded-lg flex-col justify-start items-start w-max border border-theme-sidebarDivider">
              <div className="flex-col justify-start items-start  flex">
                <div className=" text-theme-sidebarColor text-xs font-normal font-inter ">
                  Suggested
                </div>
                <div className="text-theme-primaryText text-xs font-normal font-inter mt-1">
                  For open-ended conversations,
                  <br />
                  you can start with General
                </div>
              </div>

              <div
                className="p-2 rounded border cursor-pointer mt-2 w-max border-theme-primaryText text-theme-secondaryText text-xs justify-center items-center "
                onClick={handleCreateTopic}
              >
                Create General
              </div>
            </div>
          </div>
        )}
        {/* <div className="flex flex-row items-center">
          {isOwner && (
            <div
              className="px-6 py-6 bg-theme-chatDivider rounded-lg flex-col justify-start w-max items-center cursor-pointer"
              onClick={() => handleTopicModal(channel._id)}
            >
              <img src={AddIcon} alt="add" className="mx-auto" />
              <div className="text-center mt-2 text-[#e4e4e4] text-xs font-normal font-inter">
                Add a Topic
              </div>
            </div>
          )}
          {isOwner && (
            <div
              className="px-4 py-6 ml-4 bg-theme-chatDivider rounded-lg flex-col text-center justify-start w-max items-center cursor-pointer"
              onClick={() => handleReorderTopicModal(channel._id)}
            >
              <img src={AddIcon} alt="add" className="mx-auto" />
              <div className="text-center mt-2 text-[#e4e4e4] text-xs font-normal font-inter">
                Reorder Topics
              </div>
            </div>
          )}
        </div> */}
        {(isOwner || channel.members.includes(myData._id)) && (
          <div className="items-center text-center mt-3">
            {tabs.map((tab) => {
              if (tab.name === "Members" && !isOwner) return null;
              return (
                <button
                  key={tab.id}
                  onClick={(event) => handleTabClick(event, tab.href)}
                  className={`mx-2 xs:px-12 px-8 py-3 text-sm transition-colors duration-300 ${
                    activeTab === tab.href
                      ? "border-b-2 text-theme-secondaryText border-theme-secondaryText"
                      : "text-theme-emptyEvent "
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        )}
        {(isOwner || channel.members.includes(myData._id)) && (
          <div
            className={`${
              isOwner ? "w-80" : "w-28"
            } mx-auto border border-theme-chatDivider`}
            style={{ height: "0.1px" }}
          ></div>
        )}
        {(isOwner || channel.members.includes(myData?._id)) && (
          <div className="mt-4 mb-6 h-full">
            {activeTab === "topics" ? (
              <TopicsTab channelId={channelId} isOwner={isOwner} />
            ) : (
              <MembersTab channelId={channelId} isOwner={isOwner} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
