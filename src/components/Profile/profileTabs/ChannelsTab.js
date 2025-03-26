import React from "react";
import useModal from "./../../hooks/ModalHook";
import EmptyChannelCard from "./../Widgets/EmptyChannelCard";
import { useSelector, useDispatch } from "react-redux";
import ChannelLogo from "../../../assets/icons/default_channel_logo.svg";

import {
  setChannelField,
  createChannelInvite,
  joinChannel,
} from "../../../redux/slices/channelSlice.js";
import {
  setCreateChannelField,
  setCreateChannelItems,
} from "../../../redux/slices/createChannelSlice.js";
import { setModalModal } from "../../../redux/slices/modalSlice.js";
import { useNavigate } from "react-router-dom";
import { domainUrl } from "./../../../utils/globals";

const ChannelsTab = ({ gallery = false }) => {
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { userChannels } = useSelector((state) => state.channelItems);
  const dispatch = useDispatch();
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);

  const handleEditChannel = (channel) => {
    const transformedData = {
      ...channel,
    };
    dispatch(setCreateChannelItems(transformedData));
    dispatch(setCreateChannelField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalChannelOpen");
    }, 500);
  };
  const handleShareChannel = (id, username) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    handleOpenModal("modalShareChannelOpen", id);
  };
  const handleOwnerShareChannel = (id, username) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
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

  const handleChannelPage = (channel) => {
    // if (gallery) {
    //   navigate(`/channel/${channel._id}`, { state: { fromGallery: true } });
    // } else {
    navigate(`/user/${channel.user.username}/channel/${channel._id}`);
    // }
  };

  const handleJoinChannel = (channel) => {
    if (isLoggedIn) {
      if (channel.members.includes(myData._id)) {
        navigate(
          `/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${channel.topics[0]}`
        );
      } else if (channel.requests.includes(myData._id)) {
        return;
      } else {
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
            if (response.visit) {
              navigate(
                `/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${channel.topics[0]}`
              );
            }
          })
          .catch((error) => {
            alert(error);
          });
      }
    } else {
      if (isSubdomain) {
        window.location.replace(
          `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}&redirect=/user/${channel.user.username}/profile`
        );
      } else {
        navigate(
          `/get-started?redirect=/user/${channel.user.username}/profile`
        );
      }
    }
  };
  if (userChannels.length === 0 && isLoggedIn) {
    return <EmptyChannelCard />;
  }
  if (userChannels.length === 0) {
    return (
      <div className="dark:text-secondaryText-dark text-center pt-6">
        No Channels found.
      </div>
    );
  }
  return userChannels.map((channel) => (
    <div
      key={channel._id}
      className="p-3 rounded-lg mt-4 border dark:border-chatDivider-dark justify-start flex xs:flex-row flex-col items-start"
    >
      {channel.logo ? (
        <img
          src={channel.logo}
          alt="logo"
          className="h-16 w-16 rounded-lg mt-2 cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      ) : (
        <img
          src={ChannelLogo}
          alt="logo"
          className="h-16 w-16 rounded-lg mt-2 cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      )}
      <div className="flex flex-col xs:ml-3">
        <div
          className="dark:text-secondaryText-dark text-lg font-medium font-inter cursor-pointer"
          onClick={() => handleChannelPage(channel)}
        >
          {channel.name}
        </div>
        <p
          className="dark:text-primaryText-dark text-xs font-normal "
          style={{ whiteSpace: "pre-line" }}
        >
          {channel.description}
        </p>
        <div className="flex flex-row space-x-4">
          {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              onClick={() =>
                handleOwnerShareChannel(channel._id, channel.user.username)
              }
              className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-buttonEnable-dark
                         dark:text-secondaryText-dark text-xs rounded-lg"
            >
              Share join link
            </button>
          ) : (
            <button
              onClick={() => handleJoinChannel(channel)}
              className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-buttonEnable-dark
                          dark:text-secondaryText-dark text-xs rounded-lg"
            >
              {channel.requests?.includes(myData._id)
                ? "Channel Request"
                : channel.members?.includes(myData._id)
                ? "Check updates"
                : "Join channel"}
            </button>
          )}
          {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
           dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
              onClick={() => handleEditChannel(channel)}
            >
              Edit Channel
            </button>
          ) : (
            <button
              onClick={() =>
                handleShareChannel(channel._id, channel.user.username)
              }
              className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
         dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
            >
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  ));
};

export default ChannelsTab;
