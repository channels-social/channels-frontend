import { React, useState, useEffect, useRef } from "react";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import SaveIcon from "../../assets/icons/save_icon.svg";
import SavedIcon from "../../assets/icons/favorite.svg";
import AddIcon from "../../assets/icons/addIcon.svg";
import ShareIcon from "../../assets/icons/share_icon.svg";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../hooks/ModalHook";
import Edit from "../../assets/icons/Edit.svg";
import Delete from "../../assets/icons/Delete.svg";
import { setCurationField } from "../../redux/slices/curationSlice";
import { setChipField } from "../../redux/slices/chipSlice";
import { setCurationIdToDelete } from "../../redux/slices/deleteCurationSlice";
import { updateItemField } from "./../../redux/slices/pushItemsSlice";
import Send from "../../assets/icons/Send.svg";
import {
  fetchCuration,
  saveCuration,
  fetchChips,
  SelectfetchChipsStatus,
} from "./../../redux/slices/curationPageSlice";
import CurationChips from "./../chips/CurationChips";
import ProfileItemsSkeleton from "./../skeleton/profileItemsSkeleton";
import { domainUrl } from "./../../utils/globals";
import { setCurationEngagement } from "./../../redux/slices/curationEngagementSlice";

const ProfileChipsView = () => {
  const navigate = useNavigate();
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const { username, curId } = useParams();
  const location = useLocation();
  const owner = location.state?.owner ?? false;
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const curation = useSelector((state) => state.curationPage.curation);
  const chips = useSelector((state) => state.curationPage.chips);
  const ChipsStatus = useSelector(SelectfetchChipsStatus);

  const { handleOpenModal } = useModal();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const handleShareOpen = () => {
    handleOpenModal("modalShareOpen");
    dispatch(setCurationEngagement(curation._id));
  };
  const handleChipOpen = () => {
    if (isLoggedIn) {
      dispatch(setChipField({ field: "curation", value: curId }));
      handleOpenModal("modalChipOpen");
    } else {
      openLoginModal();
    }
  };

  // const toggleSortPanel = () => {
  //     setisSorting(!isSorting);
  //   };
  // const toggleFilterPanel = () => {
  //     setisSorting(!isSorting);
  //   };
  const handleNavigateHome = (value) => {
    navigate(`/profile/${username}`);
  };

  useEffect(() => {
    if (curId) {
      dispatch(fetchCuration(curId));
      dispatch(fetchChips(curId));
    }
  }, [curId, dispatch]);

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

  const isSaved = curation.saved_by?.includes(myData?._id);

  const handleSaved = () => {
    if (isLoggedIn) {
      //   const updatedSavedBy = isSaved
      //   ? curation.saved_by.filter(id => id !== myData._id)
      //   : [...curation.saved_by, myData._id];
      // dispatch(setCurationField({ field: 'saved_by', value: updatedSavedBy }));

      dispatch(saveCuration(curId));
      // .unwrap()
      // .catch((err) => {
      //   dispatch(setCurationField({ field: 'saved_by', value: curation.saved_by }));
      //   console.error('Error saving curation:', err);
      // });
      setSavedMessageVisible(true);
      if (isSaved) {
        setSavedMessage("Unsaved!");
      } else {
        setSavedMessage("Saved!");
      }
      setTimeout(() => {
        setSavedMessageVisible(false);
      }, 1000);
      dispatch(setCurationEngagement(curation._id));
    } else {
      openLoginModal();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDeleteModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setCurationIdToDelete(curId));
      handleOpenModal("modalCurationDeleteOpen");
    } else {
      openLoginModal();
    }
  };

  const handleEditModal = () => {
    if (isLoggedIn) {
      dispatch(setCurationField({ field: "type", value: "edit" }));
      dispatch(setCurationField({ field: "name", value: curation.name }));
      dispatch(
        setCurationField({ field: "visibility", value: curation.visibility })
      );
      dispatch(setCurationField({ field: "image", value: curation.image }));
      dispatch(
        setCurationField({ field: "description", value: curation.description })
      );
      dispatch(
        setCurationField({ field: "category", value: curation.category })
      );
      dispatch(setCurationField({ field: "_id", value: curation._id }));
      setIsDropdownOpen(false);
      handleOpenModal("modalCurationOpen");
    } else {
      openLoginModal();
    }
  };

  const handleNavigationHome = () => {
    navigate("/");
  };

  const handleEmptyCuration = () => {
    if (myData._id === curation.user._id) {
      dispatch(setChipField({ field: "curation", value: curation._id }));
      handleOpenModal("modalChipOpen");
    } else {
      handleNavigationHome();
    }
  };

  const handlePushCategoryModal = () => {
    setIsDropdownOpen(false);
    dispatch(updateItemField({ field: "id", value: curation._id }));
    dispatch(updateItemField({ field: "type", value: "chipcuration" }));
    dispatch(
      updateItemField({
        field: "exisitingCategoryId",
        value: curation.profile_category || "",
      })
    );
    handleOpenModal("modalPushtoCategoryOpen");
  };

  const isOwner = myData?._id === curation?.user?._id;

  const isEditable = curation?.visibility === "anyone" || isOwner;

  return (
    <div className="flex flex-col mr-4 xs:mr-8 -ml-1">
      {/* <div className="flex flex-row items-center cursor-pointer -ml-2"onClick={handleNavigateHome}>
              <img src={ArrowBack} alt="arrow-back" className="text-primary font-normal text-lg font-inter"/>
              <p className="ml-2 text-lightText text-xs font-light font-inter">Profile</p>
            </div> */}
      {/* <div className="flex flex-row justify-between items-center mt-3 relative"> */}
      <div className="flex flex-row items-center space-x-3 w-full mt-2">
        <p className="sm:text-3xl text-xl text-white font-normal font-familjen-grotesk">
          {curation.name}
        </p>
        {!owner && (
          <div className="relative">
            {" "}
            {/* New relative container for positioning */}
            {isSavedMessageVisible && (
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-dark text-white text-xs rounded-lg px-2 py-1">
                {savedMessage}
              </div>
            )}
            <div
              className={`${
                isSaved ? "bg-iconColor" : "bg-primary"
              } px-2 py-0.5 rounded-xl ml-2 cursor-pointer`}
              onClick={handleSaved}
            >
              <img
                src={isSaved ? SavedIcon : SaveIcon}
                alt="save"
                className="h-5 w-5"
              />
            </div>
          </div>
        )}
        {isEditable && (
          <img
            src={AddIcon}
            alt="add-icon"
            className="cursor-pointer"
            onClick={handleChipOpen}
          />
        )}
        <img
          src={ShareIcon}
          alt="save"
          className="cursor-pointer "
          onClick={handleShareOpen}
        />
        <div className="relative flex pl-2">
          {isOwner && (
            <div
              className="flex flex-col space-y-1 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </div>
          )}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-max rounded-md shadow-lg border border-dividerLine bg-chipBackground ring-1 ring-black ring-opacity-5 z-50"
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
                    className="block ml-1 py-2 text-sm text-textFieldColor cursor-pointer"
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
                    className="block  ml-1 py-2 text-sm text-deleteIcon cursor-pointer"
                    role="menuitem"
                  >
                    Delete
                  </p>
                </div>
                <div
                  className="flex flex-row px-3 items-center"
                  onClick={handlePushCategoryModal}
                >
                  <img src={Send} alt="push-category" className="w-4 h-4" />
                  <p
                    className="block  ml-1 py-2 text-sm text-textFieldColor cursor-pointer"
                    role="menuitem"
                  >
                    Push to Category
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}

        {/* {!owner && <div>
                  <button className=" px-4 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Sort</button>
                  <button className="ml-2 mr-2 py-2 rounded-lg text-lightText text-xs" onClick={toggleFilterPanel}>Filter</button>
                </div>} */}
      </div>
      {curation.description && (
        <p className="text-textColor text-xs mt-2 mb-1 w-full lg:w-1/2 font-normal font-inter">
          {curation.description}
        </p>
      )}
      {curation?.user?.username && (
        <a
          href={`https://${domainUrl}/profile/${curation.user.username}`}
          className="text-primary font-normal text-xs mt-2 underline mb-8 w-max"
          style={{ textUnderlineOffset: "2px" }}
        >
          {curation.user.name}
        </a>
      )}
      {ChipsStatus === "loading" ? (
        <ProfileItemsSkeleton />
      ) : chips.length > 0 ? (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 300: 1, 500: 2, 800: 3, 1060: 4 }}
        >
          <Masonry gutter="18px">
            {chips.map((item, index) => (
              <CurationChips key={item._id} item={item} owner={isOwner} />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <div className="flex items-center justify-center mt-20">
          <div
            className="container rounded-md bg-dark pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36"
            style={{ marginRight: "auto" }}
          >
            <h3 className=" text-textColor text-sm">
              (. ❛ ᴗ ❛.) Seems like this curation is empty
            </h3>
            <div className="mt-2 rounded-md bg-chipBackground pl-5 pt-4 pb-4 cursor-pointer">
              <p
                className=" text-textColor text-xs font-light"
                onClick={handleEmptyCuration}
              >
                {myData?._id === curation.user?._id ||
                curation.visibility === "anyone"
                  ? "Add a Chip ->"
                  : `Explore more ->`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileChipsView;