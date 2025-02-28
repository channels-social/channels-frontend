import React, { useState, useRef, useEffect } from "react";
import ChannelCover from "../../assets/channel_images/channel_cover.svg";
import Settings from "../../assets/icons/setting.svg";
import AddIcon from "../../assets/icons/addIcon.svg";
import Edit from "../../assets/icons/Edit.svg";
import Stack from "../../assets/icons/stack.svg";
import ChannelLogo from "../../assets/icons/default_channel_logo.svg";
import useModal from "./../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import { createGeneralTopic } from "./../../redux/slices/channelItemsSlice";
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
} from "../../redux/slices/channelSlice.js";
import {
  setCreateChannelField,
  setCreateChannelItems,
} from "../../redux/slices/createChannelSlice.js";
import { setModalModal } from "../../redux/slices/modalSlice.js";
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ChannelSkeleton from "./../skeleton/channelSkeleton";
import InviteChannelPage from "./InviteChannelPage";
import { domainUrl } from "./../../utils/globals";
import { fetchTopics } from "../../redux/slices/reorderTopicSlice.js";
import TopicsTab from "./Tabs/TopicsTab";
import MembersTab from "./Tabs/MembersTab";
import Compressor from "compressorjs";

const ChannelPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
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
  const username = fromGallery ? galleryUsername : params.username;

  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");
  const myData = useSelector((state) => state.myData);
  const isOwner = myData?._id === channel?.user;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);

  const tabs = [
    { id: 1, name: "Topics", href: "" },
    { id: 2, name: "Members", href: "#members" },
  ];

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (window.location.hash) {
      setActiveTab(window.location.hash);
    } else {
      setActiveTab("");
    }
  }, [location]);

  const handleTabClick = (href) => {
    window.location.hash = href;
    setActiveTab(href);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  //
  useEffect(() => {
    dispatch(fetchChannel(channelId));
    dispatch(fetchTopics(channelId));
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
          `/user/${username}/channel/${channel._id}/c-id/topic/${channel.topics[0]}`
        );
      } else if (channel?.requests?.includes(myData?._id)) {
        return;
      } else {
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
            if (response.visit) {
              navigate(`c-id/topic/${channel.topics[0]}`);
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
          `/get-started?redirect=/user/${username}/channel/${channel._id}`
        );
      }
    }
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

  return (
    <div className="dark:bg-secondaryBackground-dark w-full h-screen flex flex-col overflow-y-auto">
      <div className="relative w-full h-44">
        <img
          src={channel.cover_image ? channel.cover_image : ChannelCover}
          alt="channel-cover"
          onClick={closeDropdown}
          className="w-full h-full object-cover"
        />
        {isEditCover && (
          <div
            className="absolute left-3 top-3 cursor-pointer dark:bg-buttonEnable-dark px-3 text-sm font-light py-1.5
         dark:text-secondaryText-dark rounded-lg"
            onClick={handleSaveCover}
          >
            {channelstatus === "loading" ? "Saving" : "Save"}
          </div>
        )}
      </div>
      {isOwner && (
        <div className="absolute right-3 sm:top-3 top-10">
          <img
            src={Settings}
            alt="settings"
            className="w-6 h-6 cursor-pointer"
            onClick={toggleDropdown}
          />
        </div>
      )}

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-8 right-4 mt-2 w-max rounded-md shadow-lg
          dark:bg-dropdown-dark  z-50"
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
              <img src={Edit} alt="edit" className="" />
              <p
                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
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
              <img src={Stack} alt="edit" className="w-4 h-4" />
              <p
                className="block ml-2 py-2 text-sm dark:text-primaryText-dark cursor-pointer"
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
            <p className=" text-lg sm:text-xl dark:text-secondaryText-dark font-inter font-[500]">
              {channel.name}
            </p>
            {/* <img src={SettingIcon} alt="setting-icon" className=" w-5 h-5" /> */}
          </div>
          <p className="text-[10px] dark:text-emptyEvent-dark font-light">
            {channel.members.length} members
          </p>
          <p
            className="mt-0.5 text-sm font-light dark:text-primaryText-dark mb-1"
            style={{ whiteSpace: "pre-line" }}
          >
            {channel.description}
          </p>
          <div className="flex flex-row space-x-4 mt-2">
            {isOwner ? (
              <div
                className="py-2 px-3 cursor-pointer dark:text-secondaryText-dark dark:bg-buttonEnable-dark rounded-lg text-xs sm:text-sm font-inter"
                onClick={() => handleOwnerShareChannel(channel._id)}
              >
                Share join link
              </div>
            ) : (
              <div
                className={`py-2 px-3 cursor-pointer dark:text-secondaryText-dark 
                  ${
                    channel.requests?.includes(myData._id)
                      ? "dark:bg-chatBackground-dark"
                      : "dark:bg-buttonEnable-dark"
                  }
                   rounded-lg text-xs sm:text-sm font-inter`}
                onClick={() => handleJoinChannel(channel)}
              >
                {channel.requests?.includes(myData._id)
                  ? "Requested"
                  : channel.members?.includes(myData._id)
                  ? "Check updates"
                  : "Join channel"}
              </div>
            )}
            {isOwner ? (
              <div
                className="border dark:border-primaryText-dark py-2 px-3 rounded-lg cursor-pointer dark:text-secondaryText-dark text-xs sm:text-sm font-inter"
                onClick={handleEditChannel}
              >
                Edit Channel
              </div>
            ) : (
              <div
                className="border dark:border-primaryText-dark py-2 px-3 rounded-lg cursor-pointer dark:text-secondaryText-dark text-sm font-inter"
                onClick={() => handleShareChannel(channel._id)}
              >
                Share
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-3">
        <div className="border-t my-4 dark:border-t-chatDivider-dark "></div>
        {channel.topics.length === 0 && (
          <p className="mt-2 text-xl dark:text-white font-inter font-normal">
            Topics
          </p>
        )}
        {channel.topics.length === 0 && (
          <div className="mt-2 flex flex-row space-x-3">
            <div className="p-4 dark:bg-chatDivider-dark rounded-lg flex-col justify-start items-start w-max">
              <div className="flex-col justify-start items-start  flex">
                <div className=" dark:text-sidebarColor-dark text-xs font-normal font-inter ">
                  Suggested
                </div>
                <div className="dark:text-primaryText-dark text-xs font-normal font-inter mt-1">
                  For open-ended conversations,
                  <br />
                  you can start with General
                </div>
              </div>

              <div
                className="p-2 rounded border cursor-pointer mt-2 w-max dark:border-primaryText-dark dark:text-secondaryText-dark text-xs justify-center items-center "
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
              className="px-6 py-6 dark:bg-chatDivider-dark rounded-lg flex-col justify-start w-max items-center cursor-pointer"
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
              className="px-4 py-6 ml-4 dark:bg-chatDivider-dark rounded-lg flex-col text-center justify-start w-max items-center cursor-pointer"
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.href)}
                className={`mx-2 xs:px-12 px-8 py-3 text-sm transition-colors duration-300 ${
                  activeTab === tab.href
                    ? "border-b-2 dark:text-secondaryText-dark dark:border-secondaryText-dark"
                    : "dark:text-primaryText-dark "
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}
        {(isOwner || channel.members.includes(myData._id)) && (
          <div
            className="w-80 mx-auto border dark:border-chatDivider-dark "
            style={{ height: "0.1px" }}
          ></div>
        )}
        {(isOwner || channel.members.includes(myData._id)) && (
          <div className="mt-4 mb-6 h-full">
            {activeTab === "" ? (
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
