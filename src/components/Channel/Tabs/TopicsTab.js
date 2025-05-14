import AddIcon from "../../../assets/icons/addIcon.svg";
import AddIconLight from "../../../assets/lightIcons/create_new_light.svg";
import EditIcon from "../../../assets/icons/Edit.svg";
import EditIconLight from "../../../assets/lightIcons/edit_light.svg";
import {
  clearCreateTopic,
  setCreateTopicField,
  setCreateTopicItems,
} from "../../../redux/slices/createTopicSlice";
import ArrowForward from "../../../assets/icons/arrow_forward.svg";

import {
  React,
  useDispatch,
  useSelector,
  useModal,
  useNavigate,
} from "../../../globals/imports";

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
      <div className="text-theme-secondaryText text-center mt-12 justify-center items-center">
        Loading...
      </div>
    );
  }

  const handleEditModal = (topic) => {
    const transformedData = {
      ...topic,
    };
    dispatch(setCreateTopicItems(transformedData));
    dispatch(setCreateTopicField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalTopicOpen");
    }, 500);
  };

  return (
    <div className="flex flex-col">
      {isOwner && (
        <div className="flex flex-row items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleTopicModal(channelId)}
          >
            <div className="rounded-lg mr-2 flex bg-theme-tertiaryBackground p-0.5  justify-center items-center">
              <img
                src={AddIcon}
                alt="Add"
                className="dark:block hidden w-5 h-5 text-theme-secondaryText"
              />
              <img
                src={AddIconLight}
                alt="Add"
                className="dark:hidden w-5 h-5 text-theme-secondaryText"
              />
            </div>
            <p className="text-theme-emptyEvent font-normal text-sm -ml-1">
              Create new
            </p>
          </div>
          <div className="relative flex pr-2">
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light text-theme-emptyEvent"
              onClick={() => handleReorderTopicModal(channelId)}
            >
              Reorder
            </div>
          </div>
        </div>
      )}
      <div className="mx-1">
        {reorderTopics.length === 0 ? (
          <div className="text-theme-emptyEvent text-center mt-12 justify-center items-center">
            No topics found.
          </div>
        ) : (
          reorderTopics.map((topic, index) => (
            <div
              className="bg-theme-tertiaryBackground rounded-lg px-4 py-4 flex cursor-pointer flex-row justify-between items-center my-3 "
              onClick={() => handleTopic(topic._id)}
            >
              <p className="text-theme-primaryText text-sm font-normal">
                #{topic.name}
              </p>
              <div className="flex flex-row space-x-6 items-center">
                {isOwner && (
                  <div
                    className="pl-4 pr-2  cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditModal(topic);
                    }}
                  >
                    <img
                      src={EditIcon}
                      alt="edit"
                      className="dark:block hidden w-4 h-4"
                    />
                    <img
                      src={EditIconLight}
                      alt="edit"
                      className="dark:hidden w-4 h-4"
                    />
                  </div>
                )}
                <img
                  src={ArrowForward}
                  alt="arrow-forward"
                  className="w-5 h-5"
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="h-4"></div>
    </div>
  );
};

export default TopicsTab;
