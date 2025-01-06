import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import Upload from "../../../assets/icons/Upload.svg";
import Unsplash from "../../../assets/icons/Unsplash.svg";
import { postRequestAuthenticated } from "./../../../services/rest";
import { useSelector, useDispatch } from "react-redux";
import useModal from "./../../hooks/ModalHook";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  updateChannel,
  createChannel,
} from "../../../redux/slices/channelItemsSlice.js";
import {
  setCreateChannelField,
  createClearChannel,
} from "../../../redux/slices/createChannelSlice.js";

const ChannelModal = () => {
  const { handleOpenModal } = useModal();
  const channel = useSelector((state) => state.createChannel);
  const Channelstatus = useSelector(
    (state) => state.createChannel.channelstatus
  );

  const handleClose = () => {
    dispatch(createClearChannel());
    setNameError("");
    dispatch(closeModal("modalChannelOpen"));
  };

  const handleUnsplashModal = () => {
    handleOpenModal("modalChannelUnsplashOpen");
  };

  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [file, setFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          setCreateChannelField({ field: "cover_image", value: reader.result })
        );
        dispatch(
          setCreateChannelField({ field: "imageSource", value: "upload" })
        );
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          setCreateChannelField({ field: "logo", value: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleTagSelect = (tag) => {
  //   dispatch(setChannelTag(tag));
  // };

  // const onCustomClick = (tag) => {
  //   handleOpenModal("modalCustomTagOpen");
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCharCount(value.length);
    }
    if (name === "description") {
      setDescCount(value.length);
    }
    dispatch(setCreateChannelField({ field: name, value }));
  };

  const checkChannelName = async (name) => {
    setNameError("");
    if (name !== "") {
      dispatch(
        setCreateChannelField({ field: "channelstatus", value: "loading" })
      );
      try {
        const response = await postRequestAuthenticated("/check/channel/name", {
          name,
        });
        if (response.success) {
          dispatch(
            setCreateChannelField({ field: "channelstatus", value: "idle" })
          );
          setNameError("");
          return true;
        } else {
          dispatch(
            setCreateChannelField({ field: "channelstatus", value: "idle" })
          );
          setNameError("Name already exist.");
          return false;
        }
      } catch (error) {
        dispatch(
          setCreateChannelField({ field: "channelstatus", value: "idle" })
        );
        setNameError(error);
        return false;
      }
    } else {
      dispatch(
        setCreateChannelField({ field: "channelstatus", value: "idle" })
      );
      setNameError("Name can't be empty");
      return false;
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError("");
    setNameError("");

    const isNameUnique = await checkChannelName(channel.name);
    if (!isNameUnique) {
      return;
    }
    const name = channel.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("visibility", channel.visibility);
      formDataToSend.append("description", channel.description);
      if (logoFile && channel.logo) {
        formDataToSend.append("logo", logoFile);
      }
      if (file && channel.imageSource === "upload") {
        formDataToSend.append("cover_image", file);
      } else if (channel.cover_image && channel.imageSource === "unsplash") {
        formDataToSend.append("cover_image", channel.cover_image);
      }
      formDataToSend.append("imageSource", channel.imageSource);
      dispatch(createChannel(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(createClearChannel());
          setFile(null);
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleEditChannel = async (e) => {
    e.preventDefault();
    setError("");
    const name = channel.name.trim();
    if (name !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("_id", channel._id);
      formDataToSend.append("visibility", channel.visibility);
      formDataToSend.append("description", channel.description);
      if (logoFile && channel.logo) {
        formDataToSend.append("logo", logoFile);
      }
      if (file && channel.imageSource === "upload") {
        formDataToSend.append("cover_image", file);
      } else if (channel.cover_image && channel.imageSource === "unsplash") {
        formDataToSend.append("cover_image", channel.cover_image);
      }
      formDataToSend.append("imageSource", channel.imageSource);
      dispatch(updateChannel(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(createClearChannel());
          setFile(null);
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const channelNameError = useSelector(
    (state) => state.createChannel.channelNameError
  );

  const handleImageClear = () => {
    dispatch(setCreateChannelField({ field: "cover_image", value: null }));
    dispatch(setCreateChannelField({ field: "imageSource", value: "" }));
  };
  const handleLogoClear = () => {
    dispatch(setCreateChannelField({ field: "logo", value: null }));
  };

  const [charCount, setCharCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const maxChars = 60;
  const maxDesc = 500;
  const isNameEmpty = channel.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
    : "dark:text-secondaryText-dark dark:bg-buttonEnable-dark";
  const isOpen = useSelector((state) => state.modals.modalChannelOpen);

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
                  {channel.isEdit ? "Edit Channel" : "New Channel"}
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
                    Name of the channel
                  </p>
                  <div className="dark:text-subtitle-dark text-xs font-light font-inter">
                    {charCount}/{maxChars}
                  </div>
                </div>
                <input
                  id="channel-name"
                  className="w-full mt-2 p-1 rounded bg-transparent border-b dark:border-b-chatDivider-dark
                   placeholder:font-normal placeholder:text-sm text-white focus:outline-none placeholder:dark:text-placeholder-dark"
                  type="text"
                  name="name"
                  value={channel.name}
                  onChange={handleChange}
                  maxLength={maxChars}
                  placeholder="Enter the name of your community here"
                />
                {nameError && (
                  <p
                    className={`dark:text-error-dark font-light ml-1 font-inter text-xs`}
                  >
                    {nameError}
                  </p>
                )}
              </div>
              <div className="relative mb-2">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Describe this channel
                </p>
                <p className="dark:text-subtitle-dark text-xs font-normal font-inter mb-2">
                  A good description can get you focused audience.
                </p>
                <textarea
                  value={channel.description}
                  onChange={handleChange}
                  name="description"
                  maxLength={maxDesc}
                  className="w-full text-sm pt-3 font-inter pb-4 pl-4 pr-3 bg-transparent rounded-lg border font-light dark:border-chatDivider-dark 
                   dark:text-secondaryText-dark focus:border-primary focus:ring-0 focus:outline-none placeholder:text-secondaryText-dark"
                  rows="2"
                  placeholder="Add a description"
                />
                <div className="text-right font-light absolute right-2 bottom-3 text-xs dark:text-subtitle-dark">
                  {descCount}/{maxDesc}
                </div>
              </div>
              <div className="mb-4 mt-1">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Who can access this channel?
                </p>
                <div className="flex mt-3 items-center space-x-6">
                  <label
                    className={`${
                      channel.visibility === "anyone"
                        ? "dark:text-secondaryText-dark"
                        : "dark:text-primaryText-dark"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="anyone"
                      className="mr-2 custom-radio"
                      checked={channel.visibility === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Anyone</span>
                  </label>
                  <label
                    className={`${
                      channel.visibility === "invite"
                        ? "dark:text-secondaryText-dark"
                        : "dark:text-primaryText-dark"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="invite"
                      className="mr-2 custom-radio"
                      checked={channel.visibility === "invite"}
                      onChange={handleChange}
                    />
                    <span>Invite only</span>
                  </label>
                  <label
                    className={`${
                      channel.visibility === "me"
                        ? "dark:text-secondaryText-dark"
                        : "dark:text-primaryText-dark"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="me"
                      className="mr-2 custom-radio"
                      checked={channel.visibility === "me"}
                      onChange={handleChange}
                    />
                    <span>Only me</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Add your community's logo{" "}
                  <span className="italic">(optional)</span>
                </p>
                {!channel.logo && (
                  <div className="relative border dark:border-chatDivider-dark w-1/2 px-2 py-3 mt-3 rounded-xl cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <img src={Upload} alt="Upload" className="w-5 h-5 mb-2" />
                      <p className="dark:text-secondaryText-dark text-xs font-light font-inter">
                        Upload logo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleLogoUpload}
                      />
                    </div>
                  </div>
                )}
                {channel.logo && (
                  <div className="relative mt-3">
                    <img
                      src={channel.logo}
                      alt="channel-image"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <div className="absolute right-0 top-0 bg-dark rounded-full w-6 h-6 flex justify-center items-center border">
                      <img
                        src={Close}
                        alt="close"
                        className="w-4 h-4 cursor-pointer"
                        onClick={handleLogoClear}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Add cover image to this channel
                </p>
                {!channel.cover_image && (
                  <div className="flex flex-row mt-3">
                    <div className="relative border dark:border-chatDivider-dark w-1/2 px-2 py-4 rounded-xl cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={Upload}
                          alt="Upload"
                          className="w-5 h-5 mb-2"
                        />
                        <p className="dark:text-secondaryText-dark text-xs font-light font-inter">
                          Upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    <div
                      className="w-1/2 py-4 px-1 border xs:px-2 rounded-xl ml-4 cursor-pointer dark:border-chatDivider-dark"
                      onClick={handleUnsplashModal}
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={Unsplash}
                          alt="Unsplash"
                          className="w-5 h-5 mb-2"
                        />
                        <p className="dark:text-secondaryText-dark text-xs text-center font-light font-inter">
                          Select from Unsplash
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {channel.cover_image && (
                  <div className="relative mt-3">
                    <img
                      src={channel.cover_image}
                      alt="channel-image"
                      className="w-full h-36 object-cover rounded-xl"
                    />
                    <div className="absolute right-0 top-0 bg-dark rounded-full w-6 h-6 flex justify-center items-center border">
                      <img
                        src={Close}
                        alt="close"
                        className="w-4 h-4 cursor-pointer"
                        onClick={handleImageClear}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="mb-4">
                <p className="dark:text-white text-sm font-normal font-inter">
                  Select tags for saving resources shared in this channel. You
                  can create custom tags as well. Example: Project 1
                </p>
                <p className="dark:text-subtitle-dark text-sm font-normal mt-1 font-inter">
                  Tags can make it easier for your audience to look for relevant
                  resources
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag, index) =>
                  tag !== "Custom" ? (
                    <button
                      key={index}
                      className={`px-3 py-0.5 rounded-full text-xs font-normalight  ${
                        channel.tags.includes(tag)
                          ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark font-normal "
                          : "bg-transparent border dark:border-secondaryText-dark dark:text-secondaryText-dark"
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </button>
                  ) : (
                    <div
                      key={index}
                      className={`px-3 py-0.5 items-center rounded-full text-xs flex flex-row font-normalight cursor-pointer
                         ${"bg-transparent border dark:border-secondaryText-dark dark:text-secondaryText-dark"}`}
                      onClick={() => onCustomClick(tag)}
                    >
                      <p className="text-lg mr-1 mb-0.5">+</p>
                      <p>{tag}</p>
                    </div>
                  )
                )}
              </div> */}

              {channelNameError && (
                <div className="my-2 text-errorLight font-light text-sm">
                  {error}
                </div>
              )}
              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-full ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={
                  channel.isEdit ? handleEditChannel : handleCreateChannel
                }
              >
                {Channelstatus === "loading"
                  ? "Please wait..."
                  : channel.isEdit
                  ? "Save Changes"
                  : "Create new channel"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChannelModal;
