import React, { useState, useEffect, useRef } from "react";
import DetailsForm from "./DetailsForm";
import LinkForm from "./LinkForm";
import DisplayCards from "./DisplayCards";
import { useDispatch, useSelector } from "react-redux";
import { setMyData } from "../../../redux/slices/myDataSlice";
import {
  addImageCard,
  setImageCards,
  removeImageCard,
} from "../../../redux/slices/imageCardsSlice";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../../services/rest";
import { v4 as uuidv4 } from "uuid";
import {
  fetchProfile,
  setActiveTab,
  updateProfileField,
  setProfileData,
} from "../../../redux/slices/profileSlice";
import { updateProfile } from "./../../../redux/slices/myDataSlice";
import { useNavigate } from "react-router-dom";
import { updateAuthUsername } from "../../../services/cookies";
import { domainUrl } from "./../../../utils/globals";

const ProfileForm = ({ isOpen, onClose, onUnsplashClick, gallery = false }) => {
  const modalRef = useRef(null);
  const myData = useSelector((state) => state.myData);
  const Updatestatus = useSelector((state) => state.myData.updatestatus);
  const profileData = useSelector((state) => state.profileData);
  // const usernameError = useSelector((state) => state.profileData.usernameError);
  const imageCards = useSelector((state) => state.imageCards);
  const [localFormData, setLocalFormData] = useState(myData);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileObjects, setFileObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalFormData(myData);
    dispatch(setImageCards(myData.imageCards || []));
  }, [myData, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const unsplashModal = document.getElementById("unsplash-modal");

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!unsplashModal || !unsplashModal.contains(event.target))
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleReorderImageCards = (newOrder) => {
    dispatch(setImageCards(newOrder));
  };

  const checkUsername = async (username, formDataToSend) => {
    setLoading(true);
    dispatch(updateProfileField({ name: "usernameError", value: false }));
    if (username !== "") {
      try {
        const response = await postRequestAuthenticated(
          "/check/username/profile",
          {
            username,
          }
        );
        if (response.success) {
          dispatch(updateProfile(formDataToSend))
            .unwrap()
            .then((user) => {
              dispatch(
                updateProfileField({ name: "usernameError", value: false })
              );
              dispatch(setProfileData(user));
              setLoading(false);
              dispatch(setImageCards(myData.imageCards || []));
              dispatch(setMyData(user));
              dispatch(setActiveTab("profileDetails"));
              setFile(null);
              setFileObjects([]);
              onClose();
              if (myData.username !== user.username) {
                setMyData(user);
                updateAuthUsername(user.username);
                if (gallery) {
                  const newUrl = `https://${user.username}.${domainUrl}`;
                  window.location.href = newUrl;
                } else {
                  navigate(`/user/${user.username}/profile`, { replace: true });
                }
              }
            })
            .catch((error) => {
              setLoading(false);
              console.error("Error updating profile:", error);
              alert(
                "There was an error updating the profile. Please try again."
              );
            });
        } else {
          dispatch(updateProfileField({ name: "usernameError", value: true }));
        }
      } catch (error) {
        console.error("Error checking username:", error);
        return false;
      }
    } else {
      dispatch(updateProfileField({ name: "usernameError", value: true }));
    }
  };

  const handleFieldChange = (name, value) => {
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleUploadImageCards = (event) => {
    const files = Array.from(event.target.files);
    if (imageCards.length <= 5) {
      const newFiles = [];
      files.forEach((file) => {
        const newImage = {
          id: uuidv4(),
          url: URL.createObjectURL(file),
          source: "upload",
        };
        dispatch(addImageCard(newImage));
        newFiles.push(file);
      });
      setFileObjects([...fileObjects, ...newFiles]);
    } else {
      alert("You can upload up to 5 images only.");
    }
  };

  const handleRemoveImageCard = (id) => {
    const imageIndex = imageCards.findIndex((image) => image.id === id);

    if (imageIndex === -1) {
      console.error("Image not found");
      return;
    }
    const isUploaded = imageCards[imageIndex].source === "upload";
    if (isUploaded) {
      setFileObjects((prevFiles) => {
        const fileIndex = imageIndex - (imageCards.length - prevFiles.length);
        if (fileIndex >= 0 && fileIndex < prevFiles.length) {
          return prevFiles.filter((_, i) => i !== fileIndex);
        }
        return prevFiles;
      });
    }

    dispatch(removeImageCard(id));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(file);
        handleFieldChange("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    const formDataToSend = new FormData();
    for (const key in localFormData) {
      if (key === "links") {
        formDataToSend.append(key, JSON.stringify(localFormData[key]));
      } else if (key === "imageCards") {
        formDataToSend.append(key, JSON.stringify(imageCards));
      } else {
        formDataToSend.append(key, localFormData[key]);
      }
    }
    if (file !== null) {
      formDataToSend.append("image", file);
    }
    fileObjects.forEach((file, index) => {
      formDataToSend.append("files", file);
    });
    await checkUsername(localFormData["username"], formDataToSend);
  };

  const handleClose = () => {
    dispatch(updateProfileField({ name: "usernameError", value: false }));
    setLocalFormData(myData);
    dispatch(setImageCards(myData.imageCards || []));
    dispatch(setActiveTab("profileDetails"));
    setFile(null);
    setFileObjects([]);
    onClose();
  };

  if (!isOpen) return null;
  const renderTabContent = () => {
    switch (profileData.activeTab) {
      case "profileDetails":
        return (
          <DetailsForm
            formData={localFormData}
            onFieldChange={handleFieldChange}
            handleImageUpload={handleImageUpload}
          />
        );
      case "links":
        return (
          <LinkForm
            formLinks={localFormData.links}
            otherLink={localFormData.otherLink}
            onFieldChange={handleFieldChange}
          />
        );
      case "displayCards":
        return (
          <DisplayCards
            handleImagesUpload={handleUploadImageCards}
            onUnsplashClick={onUnsplashClick}
            onReorderImageCards={handleReorderImageCards}
            handleRemoveImageCard={handleRemoveImageCard}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
      className={`fixed inset-0 z-40 flex bg-black bg-opacity-70 items-end justify-end ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="absolute inset-0 "></div>
      <div
        ref={modalRef}
        className="dark:bg-tertiaryBackground-dark rounded-t-lg w-full md:w-1/2 sm:w-[55%] lg:w-[35%] xl:w-[30%] sm:h-[85%] h-3/4 pt-2 relative z-30"
      >
        <div className="flex justify-between mb-4 pr-1">
          <button
            className={`dark:text-primaryText-dark font-normal font-inter text-sm py-2 px-5 ${
              profileData.activeTab === "profileDetails"
                ? "border-b-2 dark:border-secondaryText-dark dark:text-white"
                : ""
            } transition-colors duration-200`}
            onClick={() => dispatch(setActiveTab("profileDetails"))}
          >
            Profile details
          </button>
          <button
            className={`dark:text-primaryText-dark font-inter text-sm py-2 px-5 ${
              profileData.activeTab === "links"
                ? "border-b-2 dark:border-secondaryText-dark dark:text-white"
                : ""
            }`}
            onClick={() => dispatch(setActiveTab("links"))}
          >
            Links
          </button>
          <button
            className={`dark:text-primaryText-dark font-inter text-sm py-2 px-5 ${
              profileData.activeTab === "displayCards"
                ? "border-b-2 dark:border-secondaryText-dark dark:text-white"
                : ""
            }`}
            onClick={() => dispatch(setActiveTab("displayCards"))}
          >
            Display cards
          </button>
        </div>
        <div
          className="overflow-y-auto px-8 custom-scrollbar flex-grow flex flex-col"
          style={{ maxHeight: "calc(100% - 120px)" }}
        >
          {renderTabContent()}
        </div>
        <div className="flex justify-start space-x-4 px-8 mt-4 mb-4 absolute bottom-0 left-0 right-0">
          <button
            type="button"
            className="px-12 py-2.5 text-sm font-inter font-normal dark:bg-buttonEnable-dark dark:text-white rounded-3xl "
            onClick={handleSaveProfile}
          >
            {loading ? "Loading.." : "Save"}
          </button>
          <button
            type="button"
            className="px-7 py-2.5 text-xs border font-inter dark:border-secondaryText-dark dark:text-secondaryText-dark rounded-3xl"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
