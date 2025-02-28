import React, { useState, useRef, useEffect } from "react";
import Menu from "../../assets/icons/menu.svg";
import Close from "../../assets/icons/Close.svg";
import DropDown from "../../assets/icons/arrow_drop_down.svg";
import EditIcon from "../../assets/icons/Edit.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setCreateTopicField,
  setCreateTopicItems,
} from "../../redux/slices/createTopicSlice";
import {
  createTopicInvite,
  setTopicField,
} from "../../redux/slices/topicSlice";
import { setModalModal } from "../../redux/slices/modalSlice";
import Send from "../../assets/icons/Send.svg";

import useModal from "./../hooks/ModalHook";
import { useParams, useLocation } from "react-router-dom";

const PageHeader = ({
  channelName,
  topic,
  toggleBottomSheet,
  // toggleSidebar,
  isOpen,
  // isSidebarOpen,
  username,
  channelId,
}) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOwnerShareTopic = (id) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    dispatch(setModalModal({ field: "channelId", value: channelId }));
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", id);
    formDataToSend.append("channelId", channelId);
    dispatch(createTopicInvite(formDataToSend))
      .unwrap()
      .then((invite) => {
        console.log(invite.code);
        dispatch(setTopicField({ field: "code", value: invite.code }));
        setTimeout(() => {
          handleOpenModal("modalShareTopicOpen", id);
        }, 500);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const myData = useSelector((state) => state.myData);
  const isOwner = topic.user === myData._id;

  return (
    <div className="flex flex-col w-full h-16">
      <div className="flex flex-row py-3 justify-between items-center px-6 ">
        <div className="flex flex-col">
          {/* <div
            className="flex-row items-center w-max cursor-pointer sm:hidden flex"
            // onClick={toggleBottomSheet}
          >
            <p className="dark:text-secondaryText-dark text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>
          </div> */}
          <div className="flex-row items-center flex">
            <p className=" dark:text-secondaryText-dark text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>
            <div className="relative">
              {isOwner && (
                <img
                  src={DropDown}
                  alt="arrow-right"
                  className="w-6 h-6 ml-1 cursor-pointer "
                  onClick={toggleDropdown}
                />
              )}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-5 left-2 w-max rounded-md shadow-lg border items-start
                 dark:border-chatDivider-dark dark:bg-tertiaryBackground-dark  ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      className="flex flex-row px-3 items-center"
                      onClick={handleEditModal}
                    >
                      <img
                        src={EditIcon}
                        alt="edit-icon"
                        className="w-3.5 h-3.5 ml-1 cursor-pointer"
                      />
                      <p
                        className="block ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                        role="menuitem"
                      >
                        Edit
                      </p>
                    </div>
                    <div
                      className="flex flex-row px-3 items-center"
                      onClick={() => handleOwnerShareTopic(topic._id)}
                    >
                      <img src={Send} alt="edit" className="w-5 h-5" />
                      <p
                        className="block  ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                        role="menuitem"
                      >
                        Share
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <p className="text-xs dark:text-primaryText-dark font-normal tracking-tight">
            {topic.allowedVisibleUsers.length} members
          </p> */}
        </div>
        <div className="flex flex-row">
          {/* {isOwner && (
            <img
              src={EditIcon}
              alt="edit-icon"
              onClick={handleEditModal}
              className="w-4 h-4 mr-4 mt-1 cursor-pointer"
            />
          )} */}
          <img
            src={isOpen ? Close : Menu}
            alt="menu"
            className={`cursor-pointer xl:hidden sm:flex hidden ${
              isOpen ? "w-4 h-4" : "w-7 h-7"
            } `}
            onClick={toggleBottomSheet}
          />
          {isOpen ? (
            <img
              src={Close}
              alt="menu"
              className={`cursor-pointer flex sm:hidden ${
                isOpen ? "w-4 h-4" : "w-7 h-7"
              } `}
              onClick={toggleBottomSheet}
            />
          ) : (
            <div
              className="sm:hidden flex space-x-1 cursor-pointer"
              onClick={toggleBottomSheet}
            >
              <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
              <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
              <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
            </div>
          )}
          {/* <img
            src={isOpen ? Close : Menu}
            alt="menu"
            className={`cursor-pointer sm:hidden flex ${
              isOpen ? "w-4 h-4" : "w-7 h-7"
            } `}
            // onClick={toggleSidebar}
          /> */}
        </div>
      </div>
      <div className="xl:hidden block border border-[1] dark:border-chatDivider-dark mt-1"></div>
    </div>
  );
};

export default PageHeader;
