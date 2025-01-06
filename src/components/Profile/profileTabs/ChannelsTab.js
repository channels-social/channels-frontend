import React from "react";
import useModal from "./../../hooks/ModalHook";
import EmptyChannelCard from "./../Widgets/EmptyChannelCard";
import { useSelector, useDispatch } from "react-redux";
import {
  setChannelField,
  removeCover,
  saveCover,
  fetchChannel,
  createChannelInvite,
  joinChannel,
  joinChannelInvite,
} from "../../../redux/slices/channelSlice.js";
import {
  createClearChannel,
  setCreateChannelField,
  setCreateChannelItems,
} from "../../../redux/slices/createChannelSlice.js";
import { useNavigate } from "react-router-dom";

const ChannelsTab = () => {
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const { channels, selectedChannel, selectedPage, loading, error } =
    useSelector((state) => state.channelItems);
  const dispatch = useDispatch();

  const myData = useSelector((state) => state.myData);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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

  const handleJoinChannel = (channel) => {
    if (isLoggedIn) {
      if (channel.members.includes(myData._id)) {
        navigate(`c-id/:channelId/topic/${channel.topics[0]}`);
      } else if (channel.requests.includes(myData._id)) {
        return;
      } else {
        dispatch(joinChannel(channel._id))
          .unwrap()
          .then(() => {
            navigate(`c-id/:channelId/topic/${channel.topics[0]}`);
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
  };

  if (channels.length === 0) {
    return <EmptyChannelCard />;
  }
  return channels.map((channel) => (
    <div className="p-3 rounded-lg mt-4 border dark:border-chatDivider-dark justify-start flex flex-row items-start">
      <div className="h-16 w-16 rounded-lg  dark:bg-secondaryText-dark mt-2">
        {channel.logo && (
          <img src={channel.logo} alt="logo" className="rounded-lg" />
        )}
      </div>
      <div className="flex flex-col ml-3">
        <div className="dark:text-secondaryText-dark text-lg font-medium font-inter ">
          {channel.name}
        </div>
        <p className="dark:text-primaryText-dark text-xs font-normal ">
          {channel.description}
        </p>
        <div className="flex flex-row space-x-4">
          {myData?._id === channel?.user ? (
            <button
              onClick={() => handleOwnerShareChannel(channel._id)}
              className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-buttonEnable-dark
                         dark:text-secondaryText-dark text-xs rounded-lg"
            >
              Share join link
            </button>
          ) : (
            <button
              onClick={() => handleJoinChannel(channel._id)}
              className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-buttonEnable-dark
                          dark:text-secondaryText-dark text-xs rounded-lg"
            >
              {channel.requests?.includes(myData._id)
                ? "Channel Request"
                : channel.members?.includes(myData._id)
                ? "Get in"
                : "Join channel"}
            </button>
          )}
          {myData?._id === channel?.user ? (
            <button
              className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
           dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
              onClick={() => handleEditChannel(channel)}
            >
              Edit Channel
            </button>
          ) : (
            <button
              onClick={() => handleShareChannel(channel._id)}
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
