import React, { useState, useRef, useEffect } from "react";
import ProfileView from "./Widgets/ProfileView";
import ProfileCarousel from "./Widgets/ProfileCarousel";
import UnsplashModal from "./../Modals/UnsplashModal";
import ArrowForward from "../../assets/icons/arrow_forward_dark.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import AddIcon from "../../assets/icons/add_icon.svg";
import ChipIcon from "../../assets/icons/chip_icon.svg";
import CurationIcon from "../../assets/icons/curation_icon.svg";
import useModal from "./../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import { toggleGallerySubscription } from "../../redux/slices/gallerySlice";
import { setMyData, updateMyField } from "../../redux/slices/myDataSlice";
import ProfileIcon from "../../assets/icons/profile.svg";
import { useLocation } from "react-router-dom";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";
import {
  fetchGallery,
  selectGalleryStatus,
} from "./../../redux/slices/gallerySlice";
import ShareIcon from "../../assets/icons/shareIcon.svg";
import { setActiveTab } from "../../redux/slices/profileSlice";
import { setProfileEngagement } from "./../../redux/slices/profileEngagementSlice";
import { FaPencilAlt } from "react-icons/fa";
import ProfileForm from "./FormProfile/ProfileForm";
import ProfileSkeleton from "./../skeleton/profileSkeleton";
import { domainUrl } from "./../../utils/globals";
import EmptyProfileCard from "./Widgets/EmptyProfileCard";
import { Outlet, useNavigate } from "react-router-dom";
import Others from "../../assets/icons/Subtract.svg";
import Linkify from "react-linkify";
import {
  updateItemsOrderCategory,
  clearReorderItems,
} from "../../redux/slices/pushItemsSlice";

const Gallery = ({ onUnsplashClick }) => {
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.galleryData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [reorderItems, setReorderItems] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const navigate = useNavigate();
  const myData = useSelector((state) => state.myData);
  const galleryStatus = useSelector(selectGalleryStatus);
  const [isLoading, setIsLoading] = useState(true);
  const [isDomainExist, setIsDomainExist] = useState(true);
  const { handleOpenModal } = useModal();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const pushItems = useSelector((state) => state.pushItems);
  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const tabs = [
    { id: 1, name: "About", href: "" },
    // { id: 2, name: "Product", href: "#product" },
    // {
    //   id: 3,
    //   name: "Services",
    //   href: "#services",
    // },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].href);

  const handleTabClick = (href) => {
    // Navigate to the appropriate tab content
    window.location.hash = href;
  };

  useEffect(() => {
    if (location.hash) {
      setActiveTab(location.hash);
    } else {
      setActiveTab("");
    }
  }, [location]);

  useEffect(() => {
    const checkSubdomainExists = async (subdomain) => {
      try {
        const response = await postRequestUnAuthenticated(`/username/exist`, {
          username: subdomain,
        });
        setIsLoading(false);
        if (response.success) {
          dispatch(fetchGallery(galleryData.username));
        } else {
          setIsDomainExist(false);
        }
      } catch (error) {
        console.error("Error checking subdomain:", error);
        setIsLoading(false);
        setIsDomainExist(false);
      }
    };
    if (galleryData.username) {
      checkSubdomainExists(galleryData.username);
    }
  }, [galleryData.username, dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      setIsDropdownOpen2(false);
    }
  };

  const { items } = useSelector((state) => state.profileItems);

  const openUnsplashModal = () => setIsUnsplashModalOpen(true);
  const closeUnsplashModal = () => setIsUnsplashModalOpen(false);

  const handleSubscribe = async () => {
    if (isLoggedIn) {
      dispatch(toggleGallerySubscription(galleryData));
    } else {
      openLoginModal();
    }
  };

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const handleCurationOpenModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      handleOpenModal("modalCurationOpen");
    } else {
      openLoginModal();
    }
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const handleChipOpen = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      handleOpenModal("modalChipOpen");
    } else {
      openLoginModal();
    }
  };

  const handleEditCards = () => {
    if (isLoggedIn) {
      dispatch(setActiveTab("displayCards"));
      setIsBottomSheetOpen(true);
    } else {
      openLoginModal();
    }
  };

  const openShareModal = (link) => {
    handleOpenModal("modalShareProfileOpen", link);
    dispatch(setProfileEngagement(galleryData._id));
  };

  const hasImages = galleryData.imageCards.length !== 0;
  const isOwner = galleryData?.username === myData?.username;
  const isSubscribed = galleryData.subscribers?.includes(myData._id);

  const maxLength = 350;
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
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryOpenModal = () => {
    setIsDropdownOpen(false);
    handleOpenModal("modalCreateCategoryOpen");
  };

  const handleCategoryReorderModal = () => {
    setIsDropdownOpen2(false);
    handleOpenModal("modalCategoryReorderOpen");
  };

  const handleSubscribersModal = () => {
    handleOpenModal("modalMySubscribersOpen", galleryData._id);
  };

  const handleReorderItems = () => {
    setIsDropdownOpen2(false);
    setReorderItems(true);
  };

  const handleSaveChanges = () => {
    const items = pushItems.reorderItems;
    dispatch(updateItemsOrderCategory(items))
      .unwrap()
      .then(() => {
        setReorderItems(false);
        dispatch(clearReorderItems());
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleResetChanges = () => {
    setReorderItems(false);
  };

  const handleNewsletterPage = () => {
    navigate(`/${myData?.username}/newsletter`);
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isDomainExist) {
    navigate(`/404`);
    return;
  }

  return (
    <div
      className="w-full  pr-4 xs:pr-5 xl:pr-8   h-full"
      onClick={handleClickOutside}
    >
      {galleryStatus === "loading" ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="flex flex-row xs:ml-12 justify-center items-center mb-4">
            <div className="mx-auto -mt-1 ">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.href)}
                  className={`mx-1  px-28 py-2 text-sm transition-colors duration-300 ${
                    activeTab === tab.href
                      ? "border-b-2 border-primary text-profileText"
                      : "text-textFieldColor hover:text-gray-700"
                  }`}
                  style={{ marginBottom: "-1px" }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            {isOwner && (
              <p
                className="hidden xs:flex px-2 xs:px-4 w-[85px] xs:w-32 text-center   xs:mb-1 py-1 xs:py-3 rounded-lg text-xs  bg-primary text-buttonText cursor-pointer"
                onClick={handleNewsletterPage}
              >
                Send newsletter
              </p>
            )}
          </div>
          {/* {isOwner && (
            <button
              className={`xs:bg-dark p-2 flex flex-row absolute right-0 xs:right-16 ${
                isOwner && !hasImages
                  ? "xl:right-[14%] xxl:right-[13%]"
                  : "xl:right-[10%] xxl:right-[9%]"
              } items-center -mt-8 rounded-full`}
              onClick={openBottomSheet}
            >
              <FaPencilAlt className="w-3 h-3 text-textFieldColor mb-0.5" />
              <p className="text-textFieldColor ml-2 text-xs font-normal font-inter">
                Edit Profile
              </p>
            </button>
          )} */}
          <div
            className={`py-1 ${
              isOwner && !hasImages
                ? "xl:w-4/5 xl:mx-auto"
                : "xl:w-[94%] xl:mx-auto"
            }`}
          >
            <div
              className={`${
                isOwner || hasImages ? "md:bg-profileBackground" : ""
              } bg-primaryBackground rounded-lg md:px-7 px-0  py-4 sm:py-8 w-full`}
            >
              <div
                className={`flex flex-col md:flex-row ${
                  isOwner || hasImages
                    ? "items-center md:justify-between justify-center"
                    : "items-center justify-center"
                } `}
              >
                <div
                  className={`md:w-2/5 w-full flex flex-col ${
                    isOwner || hasImages
                      ? "md:justify-start md:items-start justify-center items-center"
                      : "justify-center items-center"
                  }  mb-4`}
                >
                  {galleryData.logo ? (
                    <img
                      src={galleryData.logo}
                      alt="Profile"
                      className="rounded-full w-28 h-28 border border-white object-cover"
                      style={{ borderWidth: "3px" }}
                    />
                  ) : (
                    <img
                      src={ProfileIcon}
                      alt="Profile"
                      className="rounded-full w-28 h-28 border bg-buttonBackground border-white object-cover"
                      style={{ borderWidth: "2px" }}
                    />
                  )}
                  <div
                    className={`mt-1 md:ml-1  ${
                      isOwner || hasImages ? "profile-text" : "text-center"
                    }`}
                  >
                    <h1 className="sm:text-2xl text-xl text-white font-normal font-familjen-grotesk">
                      {galleryData.name}
                    </h1>
                    <p className="mt-1 text-xs  font-normal text-viewAll font-inter">
                      {galleryData.username}.chips.social
                    </p>
                    <p
                      className="mt-1 text-xs  font-normal text-viewAll font-inter cursor-pointer"
                      onClick={handleSubscribersModal}
                    >
                      {galleryData.subscribers.length} Subscribers
                    </p>
                    {
                      <Linkify componentDecorator={componentDecorator}>
                        <p className="mt-2 text-sm font-light text-textColor whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
                          {isExpanded
                            ? galleryData.description
                            : `${galleryData.description.slice(0, maxLength)}${
                                galleryData.description.length > maxLength
                                  ? "..."
                                  : ""
                              }`}
                          {galleryData.description.length > maxLength && (
                            <span
                              onClick={toggleReadMore}
                              className="text-primary cursor-pointer ml-1"
                            >
                              {isExpanded ? (
                                <>
                                  <img
                                    src={ArrowBack}
                                    alt="Show Less"
                                    className="inline-block w-4 h-4"
                                  />
                                  <span className="ml-1">Show Less</span>
                                </>
                              ) : (
                                <>
                                  <span className="mr-1">Read More</span>
                                  <img
                                    src={ArrowForward}
                                    alt="Read More"
                                    className="inline-block w-4 h-4"
                                  />
                                </>
                              )}
                            </span>
                          )}
                        </p>
                      </Linkify>
                    }
                    {(galleryData.location || galleryData.contact) && (
                      <p className="mt-2 text-xs text-viewAll">
                        {galleryData.location}
                        {galleryData.contact && galleryData.location
                          ? " | "
                          : ""}
                        {galleryData.contact}
                      </p>
                    )}
                    <div
                      className={`flex space-x-4 ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      {galleryData.customText &&
                        galleryData.customUrl &&
                        !isOwner && (
                          <a
                            href={galleryData.customUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 mt-4  py-2 bg-primary text-buttonText text-sm rounded-lg"
                          >
                            {galleryData.customText}
                          </a>
                        )}
                      {isOwner && (
                        <p
                          target="_blank"
                          onClick={() =>
                            openShareModal(
                              `https://` +
                                galleryData.username +
                                `.${domainUrl}`
                            )
                          }
                          rel="noopener noreferrer"
                          className="cursor-pointer px-3 mt-4  py-2.5 bg-primary text-buttonText text-xs rounded-lg"
                        >
                          Share profile
                        </p>
                      )}

                      {!isOwner && (
                        <button
                          className={`px-4 mt-4  py-2 ${
                            isSubscribed ? "bg-dark" : "bg-buttonBackground"
                          } text-primary text-sm rounded-lg`}
                          onClick={handleSubscribe}
                        >
                          {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                      )}
                      {isOwner && (
                        <button
                          className={`px-4 mt-4  py-2.5 ${"bg-buttonBackground"} text-primary text-xs rounded-lg`}
                          onClick={openBottomSheet}
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                    <div
                      className={`flex ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      <div
                        className="w-64 my-3  border border-borderColor "
                        style={{ height: "0.1px" }}
                      ></div>
                    </div>
                    <div
                      className={`flex space-x-4 ${
                        isOwner || hasImages
                          ? "justify-center md:justify-start"
                          : "justify-center"
                      }`}
                    >
                      {/* <div
                        className="bg-primary rounded-full cursor-pointer "
                        onClick={() =>
                          openShareModal(
                            `https://` + galleryData.username + `.${domainUrl}`
                          )
                        }
                      >
                        <img src={ShareIcon} alt="save" />
                      </div> */}
                      {galleryData.links.map(
                        (link, index) =>
                          link.value && (
                            <a
                              href={link.url + link.value}
                              className="text-white cursor-pointer"
                              key={index}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={link.image}
                                alt={link.value}
                                className="w-8 h-8"
                              />
                            </a>
                          )
                      )}
                      {galleryData.otherLink && (
                        <a
                          href={galleryData.otherLink}
                          className="text-white cursor-pointer"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={Others}
                            alt="other-link"
                            className="w-8 h-8"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {hasImages ? (
                  <div
                    className={`flex md:ml-4 md:mt-0 mt-4 md:mb-0 justify-center ${
                      !galleryData.description ||
                      galleryData.description.length <= 40
                        ? "md:w-3/5 xl:w-1/2"
                        : "md:w-3/5 xl:w-3/5"
                    } h-full w-full md:justify-end mb-2`}
                  >
                    <ProfileCarousel images={galleryData.imageCards} />
                  </div>
                ) : isOwner ? (
                  <div
                    className={`flex md:ml-4 md:mt-0 mt-4 md:mb-0 justify-center ${
                      !galleryData.description ||
                      galleryData.description.length <= 40
                        ? "md:w-3/5 xl:w-3/5"
                        : "md:w-3/5 lg:w-1/2"
                    } h-full w-full md:justify-end mb-2`}
                  >
                    <EmptyProfileCard handleClick={handleEditCards} />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="w-full sm:mt-12 mt-8 p-4 bg-profileBackground rounded-lg border border-categoryBorder flex sm:flex-row flex-col items-center justify-between">
              <div className="lg:w-1/2 md:w-3/5 sm:3/4  w-full text-textColor text-sm font-light font-inter">
                Categorising your content will help your audience understand it
                better. Example: Products, Events, Resources, Hiring,
                Testimonials, FAQ etc
              </div>
              <div
                className="bg-primary sm:mt-0 mt-3 rounded-md text-buttonText text-sm font-normal font-inter px-3 py-2 cursor-pointer"
                onClick={handleCategoryOpenModal}
              >
                + new category
              </div>
            </div>
            <div
              className={`flex justify-between items-center ${
                hasImages ? "mt-2 xs:mt-4" : "mt-1"
              } -ml-2`}
            >
              {isOwner && items.length > 0 && reorderItems === false && (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <div className="rounded-md flex justify-center items-center">
                    <img src={AddIcon} alt="Add" className="w-13 h-12 mt-3" />
                  </div>
                  <p className="text-primary font-normal text-xs -ml-1">
                    Create new
                  </p>
                </div>
              )}
              {reorderItems === true && (
                <div className="flex flex-row justify-between items-center w-full">
                  <div
                    className="text-buttonText bg-primary cursor-pointer rounded-full px-3 py-1.5 text-sm font-normal ml-2"
                    onClick={handleSaveChanges}
                  >
                    Save Reordering
                  </div>
                  <div
                    className="text-primary underline  cursor-pointer rounded-full px-3 py-1.5 text-sm font-normal ml-2"
                    onClick={handleResetChanges}
                  >
                    Cancel
                  </div>
                </div>
              )}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute mt-28 ml-3 w-28 rounded-md shadow-lg border border-dividerLine bg-chipBackground ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div
                      className="flex flex-row px-3 items-center"
                      onClick={handleChipOpen}
                    >
                      <img src={ChipIcon} alt="edit" className="w-4 h-4" />
                      <p
                        className="block px-2 py-2 text-sm text-textFieldColor cursor-pointer"
                        role="menuitem"
                      >
                        Chip
                      </p>
                    </div>
                    <div
                      className="flex flex-row px-3 items-center"
                      onClick={handleCurationOpenModal}
                    >
                      <img src={CurationIcon} alt="edit" className="w-4 h-4" />
                      <p
                        className="block px-2 py-2 text-sm  text-textFieldColor cursor-pointer"
                        role="menuitem"
                      >
                        Curation
                      </p>
                    </div>
                    {/* <div
                      className="flex flex-row px-3 items-center"
                    >
                      <img src={Category} alt="edit" className="w-4 h-4" />
                      <p
                        className="block px-2 py-2 text-sm  text-textFieldColor cursor-pointer"
                        role="menuitem"
                      >
                        Category
                      </p>
                    </div> */}
                  </div>
                </div>
              )}
              <div className="relative flex pr-2">
                {isOwner && reorderItems === false && items.length > 1 && (
                  <div
                    className="flex flex-col space-y-1 cursor-pointer"
                    onClick={toggleDropdown2}
                  >
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                  </div>
                )}
                {isDropdownOpen2 && (
                  <div
                    ref={dropdownRef2}
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
                        onClick={handleCategoryReorderModal}
                      >
                        <img src={ShareIcon} alt="edit" className="w-4 h-4" />
                        <p
                          className="block ml-1 py-2 text-sm text-textFieldColor cursor-pointer"
                          role="menuitem"
                        >
                          Reorder Category
                        </p>
                      </div>
                      <div
                        className="flex flex-row px-4 items-center"
                        onClick={handleReorderItems}
                      >
                        <img src={ShareIcon} alt="edit" className="w-4 h-4" />
                        <p
                          className="block  ml-1 py-2 text-sm text-deleteIcon cursor-pointer"
                          role="menuitem"
                        >
                          Reorder Items
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ProfileView
              gallery={false}
              owner={isOwner}
              enableReorder={reorderItems}
            />
          </div>
          <ProfileForm
            isOpen={isBottomSheetOpen}
            onClose={closeBottomSheet}
            onUnsplashClick={openUnsplashModal}
            gallery={true}
          />
          <UnsplashModal
            open={isUnsplashModalOpen}
            onClose={closeUnsplashModal}
          />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Gallery;
