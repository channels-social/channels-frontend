import React, { useState } from "react";
import Menu from "../../assets/icons/menu.svg";
import Close from "../../assets/icons/Close.svg";
import ArrowRight from "../../assets/icons/arrow_right.svg";
import EditIcon from "../../assets/icons/Edit.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateTopicField,
  setCreateTopicItems,
} from "../../redux/slices/createTopicSlice";
import useModal from "./../hooks/ModalHook";

const PageHeader = ({
  channelName,
  topic,
  toggleBottomSheet,
  // toggleSidebar,
  isOpen,
  // isSidebarOpen,
}) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const handleEditModal = () => {
    const transformedData = {
      ...topic,
    };
    dispatch(setCreateTopicItems(transformedData));
    dispatch(setCreateTopicField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalTopicOpen");
    }, 500);
  };
  const myData = useSelector((state) => state.myData);
  const isOwner = topic.user === myData._id;
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row py-3 justify-between items-center px-6 ">
        <div className="flex flex-col">
          <div
            className="flex-row items-center w-max cursor-pointer sm:hidden flex"
            onClick={toggleBottomSheet}
          >
            <p className="dark:text-secondaryText-dark text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>
            <img src={ArrowRight} alt="arrow-right" className="w-3 h-3 pl-2 " />
          </div>
          <p className="sm:flex hidden dark:text-secondaryText-dark text-2xl font-normal font-inter tracking-wide">
            {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
          </p>
          <p className="text-xs dark:text-primaryText-dark font-normal tracking-tight">
            {topic.allowedVisibleUsers.length} members
          </p>
        </div>
        <div className="flex flex-row">
          {isOwner && (
            <img
              src={EditIcon}
              alt="edit-icon"
              onClick={handleEditModal}
              className="w-4 h-4 mr-4 mt-1 cursor-pointer"
            />
          )}
          <img
            src={isOpen ? Close : Menu}
            alt="menu"
            className={`cursor-pointer sm:flex hidden ${
              isOpen ? "w-4 h-4" : "w-7 h-7"
            } `}
            onClick={toggleBottomSheet}
          />
          <img
            src={isOpen ? Close : Menu}
            alt="menu"
            className={`cursor-pointer sm:hidden flex ${
              isOpen ? "w-4 h-4" : "w-7 h-7"
            } `}
            // onClick={toggleSidebar}
          />
        </div>
      </div>
      <div className="border border-[1] dark:border-chatDivider-dark"></div>
    </div>
  );
};

export default PageHeader;
