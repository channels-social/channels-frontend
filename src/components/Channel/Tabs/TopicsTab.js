import React from "react";
import AddIcon from "../../../assets/icons/addIcon.svg";
import useModal from "./../../hooks/ModalHook";
import {
  clearCreateTopic,
  setCreateTopicField,
} from "../../../redux/slices/createTopicSlice";
import { useDispatch, useSelector } from "react-redux";
import ArrowForward from "../../../assets/icons/arrow_forward.svg";
import { useNavigate } from "react-router-dom";

const TopicsTab = ({ channelId, isOwner }) => {
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reorderTopics = useSelector((state) => state.reorderTopic.topics);
  const status = useSelector((state) => state.reorderTopic.status);

  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));
    handleOpenModal("modalTopicOpen");
  };
  const handleReorderTopicModal = (channelId) => {
    handleOpenModal("modalTopicReorderOpen", channelId);
  };
  const handleTopic = (topicId) => {
    navigate(`c-id/topic/${topicId}`);
  };

  if (status === "loading") {
    return (
      <div className="dark:text-secondaryText-dark text-center mt-12 justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {isOwner && (
        <div className="flex flex-row items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleTopicModal(channelId)}
          >
            <div className="rounded-lg mr-2 flex dark:bg-tertiaryBackground-dark p-0.5  justify-center items-center">
              <img
                src={AddIcon}
                alt="Add"
                className="w-5 h-5 dark:text-secondaryText-dark"
              />
            </div>
            <p className="dark:text-emptyEvent-dark font-normal text-sm -ml-1">
              Create new
            </p>
          </div>
          <div className="relative flex pr-2">
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light dark:text-emptyEvent-dark"
              onClick={() => handleReorderTopicModal(channelId)}
            >
              Reorder
            </div>
          </div>
        </div>
      )}
      <div className="mx-1">
        {reorderTopics.length === 0 ? (
          <div className="dark:text-secondaryText-dark text-center mt-12 justify-center items-center">
            No topics found.
          </div>
        ) : (
          reorderTopics.map((topic, index) => (
            <div
              className="dark:bg-tertiaryBackground-dark rounded-lg px-4 py-4 flex cursor-pointer flex-row justify-between items-center my-3 "
              onClick={() => handleTopic(topic._id)}
            >
              <p className="dark:text-primaryText-dark text-sm font-normal">
                #{topic.name}
              </p>
              <img
                src={ArrowForward}
                alt="arrow-forward"
                className="w-5 h-5 "
              />
            </div>
          ))
        )}
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default TopicsTab;
