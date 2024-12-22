import React, { useState, useRef, useEffect } from "react";
import Upvote from "../../assets/icons/upvote.svg";
import Edit from "../../assets/icons/Edit.svg";
import Delete from "../../assets/icons/Delete.svg";
import Send from "../../assets/icons/Send.svg";
import MetaCard from "../chips/widgets/MetaCard";
import Comment from "../../assets/icons/Comment.svg";
import GoogleMapsCard from "../chips/widgets/googleMapsCard";
import DateTimeCard from "../chips/widgets/DateTime";
import Upvoted from "../../assets/icons/upvoted.svg";
import ImageList from "../chips/widgets/ImageList";
import RenderLink from "../chips/widgets/videoPlayer";
import useModal from "./../hooks/ModalHook";
import { setChipIdToDelete } from "../../redux/slices/deleteChipSlice";
import { useDispatch, useSelector } from "react-redux";
import { setEditChipData } from "./../../redux/slices/editChipSlice";
import { upvoteChip } from "./../../redux/slices/profileItemsSlice";
import { domainUrl } from "./../../utils/globals";
import { setChipEngagement } from "./../../redux/slices/chipEngagementSlice";
import DocumentPreview from "./widgets/DocumentPreview";
import Linkify from "react-linkify";
import { setCommentChip } from "./../../redux/slices/commentChipSlice";
import { updateItemField } from "./../../redux/slices/pushItemsSlice";

const ProfileChips = ({ item }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { handleOpenModal } = useModal();
  const myData = useSelector((state) => state.myData);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const openCommentModal = () => {
    if (isLoggedIn) {
      dispatch(setCommentChip(item));
      setTimeout(() => {
        handleOpenModal("modalCommentOpen");
      }, 0);
    } else {
      openLoginModal();
    }
  };

  const openShareModal = () => {
    const linkToShare = `https://${domainUrl}/profile/${item.user?.username}/chip/${item._id}`;
    handleOpenModal("modalShareChipOpen", linkToShare);
    dispatch(setChipEngagement(item._id));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDeleteModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setChipIdToDelete(item._id));
      handleOpenModal("modalChipDeleteOpen");
    } else {
      openLoginModal();
    }
  };

  const handleEditModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setEditChipData(item));
      handleOpenModal("modalChipEditOpen");
    } else {
      openLoginModal();
    }
  };
  const handleUpvote = () => {
    if (isLoggedIn) {
      dispatch(upvoteChip(item._id));
      dispatch(setChipEngagement(item._id));
    } else {
      openLoginModal();
    }
  };

  const handlePushCategoryModal = () => {
    setIsDropdownOpen(false);
    dispatch(updateItemField({ field: "id", value: item._id }));
    dispatch(updateItemField({ field: "type", value: "chip" }));
    dispatch(
      updateItemField({
        field: "exisitingCategoryId",
        value: item.profile_category || "",
      })
    );
    handleOpenModal("modalPushtoCategoryOpen");
  };
  const handlePushCurationModal = () => {
    setIsDropdownOpen(false);
    dispatch(updateItemField({ field: "id", value: item._id }));
    handleOpenModal("modalPushtoCurationOpen");
  };

  const isUpvoted = item?.upvotes?.includes(myData?._id);
  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-metaLink"
    >
      {text}
    </a>
  );

  return (
    <div className="container  pl-4 pb-4 w-full pt-4 rounded-lg space-y-2.5 border border-borderColor dark:border-chatDivider-dark dark:bg-tertiaryBackground-dark">
      <div className="flex items-center justify-end mr-4 relative">
        <div className="flex space-x-1 cursor-pointer" onClick={toggleDropdown}>
          <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
          <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
          <div className="w-1 h-1 dark:bg-primaryText-dark rounded-full"></div>
        </div>
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-4 right-0 w-max rounded-md shadow-lg border dark:border-chatDivider-dark dark:bg-tertiaryBackground-dark  ring-1 ring-black ring-opacity-5 z-50"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div
                className="flex flex-row px-4 items-center"
                onClick={handleEditModal}
              >
                <img src={Edit} alt="edit" className="w-4 h-4" />
                <p
                  className="block ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                  role="menuitem"
                >
                  Edit
                </p>
              </div>
              <div
                className="flex flex-row px-4 items-center"
                onClick={handleDeleteModal}
              >
                <img src={Delete} alt="edit" className="w-4 h-4" />
                <p
                  className="block  ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                  role="menuitem"
                >
                  Delete
                </p>
              </div>
              <div
                className="flex flex-row px-3 items-center"
                onClick={handlePushCurationModal}
              >
                <img src={Send} alt="push-curation" className="w-4 h-4" />
                <p
                  className="block  ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                  role="menuitem"
                >
                  Push to Curation
                </p>
              </div>
              <div
                className="flex flex-row px-3 items-center"
                onClick={handlePushCategoryModal}
              >
                <img src={Send} alt="push-category" className="w-4 h-4" />
                <p
                  className="block  ml-2 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                  role="menuitem"
                >
                  Push to Category
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2.5">
        {
          <Linkify componentDecorator={componentDecorator}>
            <p className="dark:text-secondaryText-dark pr-1 text-sm font-light font-inter whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
              {isExpanded
                ? item.text
                : `${item.text.slice(0, maxLength)}${
                    item.text.length > maxLength ? "..." : ""
                  }`}
              {item.text.length > maxLength && (
                <span
                  onClick={toggleReadMore}
                  className="dark:text-white cursor-pointer ml-1"
                >
                  {isExpanded ? "<- Show Less" : "Read More ->"}
                </span>
              )}
            </p>
          </Linkify>
        }
        {item.date.date && item.date.event && <DateTimeCard item={item.date} />}
        {item.location.text && <GoogleMapsCard item={item.location} />}
        {item.document && item.document.url !== "" && (
          <div className="mr-3">
            <DocumentPreview document={item.document} />
          </div>
        )}
        {item.link && !item.metaLink?.ogTitle && <RenderLink url={item.link} />}
        {item.image_urls.length !== 0 && (
          <ImageList imageCards={item.image_urls} />
        )}
        {item.metaLink && item.metaLink?.ogTitle !== "" && (
          <MetaCard
            title={item.metaLink.ogTitle}
            description={item.metaLink.ogDescription}
            imageUrl={item.metaLink.ogImage}
            link={item.link}
          />
        )}
      </div>
      <div className="ml-1 mt-3 flex flex-row justify-between items-center mr-4">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={handleUpvote}
        >
          <img
            src={isUpvoted ? Upvoted : Upvote}
            alt="Upvote"
            className="mr-0.5 h-5 w-5"
          />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.upvotes.length}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openCommentModal}
        >
          <img src={Comment} alt="Comment-item" className="mr-0.5" />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.comments ? item?.comments : 0}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openShareModal}
        >
          <img src={Send} alt="Send" className="mr-0.5" />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.shared_by}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileChips;
