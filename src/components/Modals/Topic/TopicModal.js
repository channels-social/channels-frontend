import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { postRequestAuthenticated } from "./../../../services/rest";
import { useSelector, useDispatch } from "react-redux";
import useModal from "./../../hooks/ModalHook";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  setCreateTopicField,
  clearCreateTopic,
  createTopic,
  updateTopic,
} from "../../../redux/slices/createTopicSlice.js";

const TopicModal = () => {
  const topic = useSelector((state) => state.createTopic);
  const Topicstatus = useSelector((state) => state.topic.topicstatus);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(clearCreateTopic());
    dispatch(closeModal("modalTopicOpen"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCharCount(value.length);
    }
    dispatch(setCreateTopicField({ field: name, value: value }));
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setError("");
    const name = topic.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("visibility", topic.visibility);
      formDataToSend.append("editability", topic.editability);
      formDataToSend.append("channel", topic.channel);
      dispatch(createTopic(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(clearCreateTopic());
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const handleEditTopic = async (e) => {
    e.preventDefault();
    setError("");
    const name = topic.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("_id", topic._id);
      formDataToSend.append("visibility", topic.visibility);
      formDataToSend.append("editability", topic.editability);
      dispatch(updateTopic(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(clearCreateTopic());
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const topicNameError = useSelector((state) => state.topic.channelNameError);

  const [charCount, setCharCount] = useState(0);
  const maxChars = 30;
  const isNameEmpty = topic.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
    : "dark:text-secondaryText-dark dark:bg-buttonEnable-dark";
  const isOpen = useSelector((state) => state.modals.modalTopicOpen);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="dark:bg-tertiaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[90%] overflow-y-auto custom-scrollbar w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="dark:text-white text-lg font-normal font-inter">
                  New Topic
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-4">
                <div className="flex flex-row justify-between">
                  <p className="dark:text-white text-sm font-normal font-inter">
                    Name of the topic
                  </p>
                  <div className="dark:text-subtitle-dark text-xs font-light font-inter">
                    {charCount}/{maxChars}
                  </div>
                </div>
                <input
                  id="topic-name"
                  className="w-full mt-2 p-1 rounded bg-transparent border-b dark:border-b-chatDivider-dark
                   placeholder:font-normal placeholder:text-sm text-white focus:outline-none placeholder:dark:text-placeholder-dark"
                  type="text"
                  name="name"
                  value={topic.name}
                  onChange={handleChange}
                  maxLength={maxChars}
                  placeholder="Enter topic of discussion"
                />
                {topicNameError && (
                  <p
                    className={`text-errorLight  font-light ml-1 font-inter text-xs`}
                  >
                    {topic.name === ""
                      ? "Name can't be empty"
                      : "Curation name already exist."}
                  </p>
                )}
              </div>

              <div className="mb-4 mt-1">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Who can view this topic?
                </p>
                <div className="flex mt-3 items-center space-x-6">
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="anyone"
                      className="mr-2 custom-radio"
                      checked={topic.visibility === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Everyone in channel</span>
                  </label>
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="invite"
                      className="mr-2 custom-radio"
                      checked={topic.visibility === "invite"}
                      onChange={handleChange}
                    />
                    <span>Invite only</span>
                  </label>
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="me"
                      className="mr-2 custom-radio"
                      checked={topic.visibility === "me"}
                      onChange={handleChange}
                    />
                    <span>Only me</span>
                  </label>
                </div>
              </div>
              {/* <div className="mb-4 mt-1">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Who can write in this topic?
                </p>
                <div className="flex mt-3 items-center space-x-6">
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="anyone"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Anyone</span>
                  </label>
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="admins"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "admins"}
                      onChange={handleChange}
                    />
                    <span>Admins</span>
                  </label>
                  <label className="dark:text-primaryText-dark text-sm font-normal flex items-center">
                    <input
                      type="radio"
                      name="editability"
                      value="me"
                      className="mr-2 custom-radio"
                      checked={topic.editability === "me"}
                      onChange={handleChange}
                    />
                    <span>Only me</span>
                  </label>
                </div>
              </div> */}

              {error && (
                <div className="my-2 text-errorLight font-light text-sm">
                  {error}
                </div>
              )}
              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-full ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={topic.isEdit ? handleEditTopic : handleCreateTopic}
              >
                {Topicstatus === "loading"
                  ? "Please wait..."
                  : topic.isEdit
                  ? "Save Changes"
                  : "Create topic"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TopicModal;
