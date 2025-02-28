import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMembers,
  setReorderTopicField,
} from "../../../redux/slices/reorderTopicSlice";
import useModal from "./../../hooks/ModalHook";

const MembersTab = ({ channelId, isOwner }) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const reorderMembers = useSelector((state) => state.reorderTopic.members);
  const memberStatus = useSelector((state) => state.reorderTopic.memberStatus);

  useEffect(() => {
    dispatch(fetchMembers(channelId));
  }, [channelId, dispatch]);

  const handleRemoveMember = (user, channelId) => {
    dispatch(
      setReorderTopicField({ field: "removeChannelId", value: channelId })
    );
    dispatch(setReorderTopicField({ field: "removeUser", value: user }));
    handleOpenModal("modalRemoveMemberOpen");
  };

  if (memberStatus === "loading") {
    return (
      <div className="dark:text-secondaryText-dark text-center mt-12 justify-center items-center">
        Loading...
      </div>
    );
  }

  if (reorderMembers.length === 0) {
    return (
      <div className="dark:text-secondaryText-dark text-center mt-12 justify-center items-center">
        No members found.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {reorderMembers.map((member, index) => (
        <div className="flex flex-col">
          <div className="rounded-lg px-2 py-3 flex flex-row justify-between items-center ">
            <div
              className="flex flex-row items-start justify-start w-max cursor-pointer"
              onClick={() => {
                window.open(
                  `https://${member.username}.channels.social`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              {member.logo ? (
                <img
                  src={member.logo}
                  alt="logo"
                  className="rounded-full w-10 h-10"
                />
              ) : (
                <div className="rounded-full w-10 h-10 dark:bg-emptyEvent-dark"></div>
              )}
              <div className="flex flex-col ml-2 justify-between">
                <p className="dark:text-secondaryText-dark font-normal text-sm mr-2">
                  {member.name}
                </p>
                <p className="dark:text-profileColor-dark mt-1  text-[10px] font-normal">
                  {member.username}
                </p>
              </div>
            </div>
            <div className="flex flex-row ">
              {isOwner && (
                <div
                  className="dark:bg-tertiaryBackground-dark rounded-md p-2 dark:text-primaryText-dark text-sm font-light cursor-pointer"
                  onClick={() => handleRemoveMember(member, channelId)}
                >
                  Remove
                </div>
              )}
            </div>
          </div>
          <div className="border-t dark:border-t-chatDivider-dark w-full px-4"></div>
        </div>
      ))}
    </div>
  );
};

export default MembersTab;
