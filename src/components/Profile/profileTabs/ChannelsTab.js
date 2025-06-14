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
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper.js";

const ChannelsTab = ({ gallery = false, isOwner }) => {
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { channels } = useSelector((state) => state.channelItems);
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

  const handleLeaveChannel = (channel) => {
    dispatch(setModalModal({ field: "channelId", value: channel._id }));
    dispatch(setModalModal({ field: "isTabChannel", value: true }));
    handleOpenModal("modalLeaveChannelOpen");
  };

  const handleJoinChannel = (channel) => {
    if (isLoggedIn) {
      if (channel.members.includes(myData._id)) {
        navigate(
          `/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${channel.topics[0]._id}`
        );
      } else if (channel.requests.includes(myData._id)) {
        return;
      } else {
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then((response) => {
            if (response.visit) {
              if (response.channel.topics.length > 0) {
                navigate(
                  `${getAppPrefix()}/user/${channel.user.username}/channel/${
                    channel._id
                  }/c-id/topic/${response.channel.topics[0]._id}`
                );
              } else {
                navigate(
                  `${getAppPrefix()}/user/${channel.user.username}/channel/${
                    channel._id
                  }`
                );
              }
            }
            // if (response.visit) {
            //   navigate(
            //     `/user/${channel.user.username}/channel/${channel._id}/c-id/topic/${channel.topics[0]}`
            //   );
            // }
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
          `/get-started?redirect=${getAppPrefix()}/user/${
            channel.user.username
          }/profile`
        );
      }
    }
  };
  if (channels.length === 0 && isOwner) {
    return <EmptyChannelCard />;
  }
  if (channels.length === 0) {
    return (
      <div className="text-theme-secondaryText text-center pt-6">
        No Channels found.
      </div>
    );
  }
  return channels.map((channel) => (
    <div
      key={channel._id}
      className="p-3 rounded-lg mt-4 border border-theme-chatDivider justify-start flex xs:flex-row flex-col items-start"
    >
      {channel.logo ? (
        <img
          src={channel.logo}
          alt="logo"
          className="h-16 w-16 rounded-lg  cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      ) : (
        <img
          src={ChannelLogo}
          alt="logo"
          className="h-16 w-16 rounded-lg  cursor-pointer flex-shrink-0 object-cover "
          onClick={() => handleChannelPage(channel)}
        />
      )}
      <div className="flex flex-col xs:ml-3 xs:mt-0  mt-1.5 ">
        <div
          className="text-theme-secondaryText text-lg font-normal  cursor-pointer"
          onClick={() => handleChannelPage(channel)}
        >
          {channel.name}
        </div>
        <p
          className="text-theme-emptyEvent text-sm font-light xs:mt-0 mt-2.5"
          style={{ whiteSpace: "pre-line" }}
        >
          {channel.description?.length > 150
            ? channel.description.slice(0, 150) + "..."
            : channel.description}
        </p>

        <div className="flex flex-row space-x-4 items-end">
          {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              onClick={() =>
                handleOwnerShareChannel(channel._id, channel.user.username)
              }
              className="cursor-pointer px-3 mt-4 font-normal  py-2.5 bg-theme-secondaryText
                         text-theme-primaryBackground text-xs rounded-lg "
            >
              Share join link
            </button>
          ) : channel.members?.includes(myData?._id) ? (
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
          {isLoggedIn && myData?._id === channel?.user._id ? (
            <button
              className={`px-4 mt-4  py-2.5 border border-theme-secondaryText 
           text-theme-secondaryText font-normal text-xs rounded-lg`}
              onClick={() => handleEditChannel(channel)}
            >
              Edit Channel
            </button>
          ) : (
            <button
              onClick={() =>
                handleShareChannel(channel._id, channel.user.username)
              }
              className={`px-4 mt-4  py-2.5 border border-theme-secondaryText 
         text-theme-secondaryText font-normal text-xs rounded-lg`}
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
