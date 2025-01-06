import React, { useState, useRef, useEffect } from "react";
import ChannelCover from "../../assets/channel_images/channel_cover.svg";
import Settings from "../../assets/icons/setting.svg";
import Edit from "../../assets/icons/Edit.svg";
import Stack from "../../assets/icons/stack.svg";
import SettingIcon from "../../assets/icons/setting_icon.svg";
import AddIcon from "../../assets/icons/add_btn.svg";
import useModal from "./../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import { createGeneralTopic } from "./../../redux/slices/channelItemsSlice";
import {
  setChannelField,
  removeCover,
  saveCover,
  fetchChannel,
  createChannelInvite,
  joinChannel,
  joinChannelInvite,
} from "../../redux/slices/channelSlice.js";
import {
  createClearChannel,
  setCreateChannelField,
  setCreateChannelItems,
} from "../../redux/slices/createChannelSlice.js";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const ChannelPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channel);
  const channelstatus = useSelector((state) => state.channel.channelstatus);
  const [file, setFile] = useState(null);
  const [isEditCover, setIsEditCover] = useState(null);
  const { channelId } = useParams();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");

  const myData = useSelector((state) => state.myData);
  const isOwner = myData?._id === channel?.user;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    dispatch(fetchChannel(channelId));
    if (inviteCode) {
      dispatch(setChannelField({ field: "code", value: inviteCode }));
    }
  }, [channelId]);

  const closeDropdown = (event) => {
    setIsDropdownOpen(false);
  };

  const handleShareChannel = (id) => {
    handleOpenModal("modalShareChannelOpen", id);
  };
  const handleOwnerShareChannel = (id) => {
    dispatch(createChannelInvite(id))
      .unwrap()
      .then((invite) => {
        console.log(invite.code);
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
          navigate(`c-id/${channel._id}/topic/${topic._id}`);
        })
        .catch((error) => {
          alert(error);
        });
    }
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
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          setChannelField({ field: "cover_image", value: reader.result })
        );
        dispatch(setChannelField({ field: "imageSource", value: "upload" }));
      };
      reader.readAsDataURL(file);
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

  const handleJoinChannel = () => {
    if (isLoggedIn) {
      if (inviteCode) {
        const formDataToSend = new FormData();
        formDataToSend.append("channelId", channel._id);
        formDataToSend.append("code", inviteCode);
        dispatch(joinChannelInvite(formDataToSend))
          .unwrap()
          .then(() => {
            navigate(`c-id/${channel._id}/topic/${channel.topics[0]}`);
          })
          .catch((error) => {
            alert(error);
          });
      } else {
        if (channel.members.includes(myData._id)) {
          navigate(`c-id/${channel._id}/topic/${channel.topics[0]}`);
        } else if (channel.requests.includes(myData._id)) {
          return;
        } else {
          dispatch(joinChannel(channel._id))
            .unwrap()
            .then(() => {
              navigate(`c-id/${channel._id}/topic/${channel.topics[0]}`);
            })
            .catch((error) => {
              alert(error);
            });
        }
      }
    } else {
      navigate("/get-started", { replace: true });
    }
  };

  return (
    <div className="dark:bg-secondaryBackground-dark w-full h-full flex flex-col">
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
        <div className="w-16 h-16 rounded-lg mt-3 dark:bg-secondaryText-dark flex-shrink-0">
          {channel.logo && <img src={channel.logo} alt="logo" />}
        </div>
        <div className="flex flex-col ml-4 w-full">
          <div className="flex flex-row justify-between items-center">
            <p className=" text-lg sm:text-xl dark:text-secondaryText-dark font-inter font-semibold">
              {channel.name}
            </p>
            {/* <img src={SettingIcon} alt="setting-icon" className=" w-5 h-5" /> */}
          </div>
          <p className="mt-1 text-xs font-nromal dark:text-primaryText-dark">
            {channel.description}
          </p>
          <div className="flex flex-row space-x-4 mt-3">
            {isOwner ? (
              <div
                className="py-2 px-3 cursor-pointer dark:text-secondaryText-dark dark:bg-buttonEnable-dark rounded-lg text-xs sm:text-sm font-inter"
                onClick={() => handleOwnerShareChannel(channel._id)}
              >
                Share join link
              </div>
            ) : (
              <div
                className="py-2 px-3 cursor-pointer dark:text-secondaryText-dark dark:bg-buttonEnable-dark rounded-lg text-xs sm:text-sm font-inter"
                onClick={() => handleJoinChannel(channel._id)}
              >
                {channel.requests?.includes(myData._id)
                  ? "Channel Request"
                  : channel.members?.includes(myData._id)
                  ? "Get in"
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
        {/* <div className="px-4 py-6 dark:bg-chatDivider-dark rounded-lg flex-col justify-start w-max items-center">
          <img src={AddIcon} alt="add" className="ml-2" />
          <div className="text-center mt-2 text-[#e4e4e4] text-xs font-medium font-inter">
            New Topic
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ChannelPage;
