import React, { useState, useRef } from "react";
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
  clearChannel,
  removeCover,
  saveCover,
} from "../../redux/slices/channelSlice.js";

const ChannelPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();
  const channel = useSelector((state) => state.channel);
  const [file, setFile] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    setIsDropdownOpen(false);
  };

  const handleShareChannel = (name) => {
    handleOpenModal("modalShareChannelOpen", name);
  };
  const handleCreateTopic = () => {
    dispatch(createGeneralTopic());
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
      formDataToSend.append("cover_image", file);
    }
    dispatch(saveCover(formDataToSend));
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
        <div
          className="absolute left-3 top-3 dark:bg-buttonEnable-dark px-3 text-sm font-light py-1.5
         dark:text-secondaryText-dark rounded-lg"
          onClick={handleSaveCover}
        >
          Save
        </div>
      </div>
      <div className="absolute right-3 top-3">
        <img
          src={Settings}
          alt="settings"
          className="w-6 h-6 cursor-pointer"
          onClick={toggleDropdown}
        />
      </div>

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
      <div className="flex flex-row items-start w-full mt-4 px-3">
        <div className="w-16 h-16 rounded-lg mt-3 dark:bg-secondaryText-dark"></div>
        <div className="flex flex-col ml-3 w-full">
          <div className="flex flex-row justify-between items-center">
            <p className="text-xl dark:text-secondaryText-dark font-inter font-semibold">
              Chips.social
            </p>
            <img src={SettingIcon} alt="setting-icon" className=" w-5 h-5" />
          </div>
          <p className="mt-1 text-xs font-nromal dark:text-primaryText-dark">
            Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
            turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
            nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum
            tellus elit sed risus. Maecenas eget condimentum velit, sit amet
            feugiat lectus. Class aptent taciti sociosqu ad litora torquent per
            conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus
            enim egestas, ac scelerisque ante pulvinar.
          </p>
          <div className="flex flex-row space-x-4 mt-3">
            <div
              className="py-2 px-3 cursor-pointer dark:text-secondaryText-dark dark:bg-buttonEnable-dark rounded-lg text-sm font-inter"
              onClick={() => handleShareChannel("channel1")}
            >
              Share join link
            </div>
            <div className="border dark:border-primaryText-dark py-2 px-3 rounded-lg dark:text-secondaryText-dark text-sm font-inter">
              Edit Channel
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mx-3">
        <div className="border-t my-4 dark:border-t-chatDivider-dark "></div>
        <p className="mt-2 text-xl dark:text-white font-inter font-normal">
          Topics
        </p>
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
              className="p-2 rounded border mt-2 w-max dark:border-primaryText-dark dark:text-secondaryText-dark text-xs justify-center items-center "
              onClick={handleCreateTopic}
            >
              Create General
            </div>
          </div>
          <div className="px-4 pt-6 dark:bg-chatDivider-dark rounded-lg flex-col justify-center items-center">
            <img src={AddIcon} alt="add" className="ml-2" />
            <div className="text-center mt-2 text-[#e4e4e4] text-xs font-medium font-inter">
              New Topic
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
