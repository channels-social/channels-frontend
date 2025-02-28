import React, { useState, useRef, useEffect } from "react";
import ProfileCarousel from "./Widgets/ProfileCarousel";
import UnsplashModal from "./../Modals/UnsplashModal";
import ArrowForward from "../../assets/icons/arrow_forward_dark.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import useModal from "./../hooks/ModalHook";
import { useDispatch, useSelector } from "react-redux";
import ProfileIcon from "../../assets/icons/profile.svg";
import { useLocation } from "react-router-dom";
import { postRequestUnAuthenticated } from "./../../services/rest";
import {
  fetchGallery,
  selectGalleryStatus,
  updateGalleryField,
} from "./../../redux/slices/gallerySlice";
import { setProfileEngagement } from "./../../redux/slices/profileEngagementSlice";
import { fetchUserChannels } from "./../../redux/slices/channelItemsSlice";
import ProfileForm from "./FormProfile/ProfileForm";
import ProfileSkeleton from "./../skeleton/profileSkeleton";
import { domainUrl } from "./../../utils/globals";
import EmptyProfileCard from "./Widgets/EmptyProfileCard";
import { Outlet, useNavigate } from "react-router-dom";
import Others from "../../assets/icons/Subtract.svg";
import Linkify from "react-linkify";
import ChannelsTab from "./profileTabs/ChannelsTab";
import FaqsTab from "./profileTabs/FaqsTab";
import CurationsTab from "./profileTabs/CurationsTab";
import { setIsDomain } from "../../redux/slices/authSlice";

const Gallery = () => {
  const tabs = [
    { id: 1, name: "Channels", href: "" },
    { id: 2, name: "Curations", href: "#curations" },
    { id: 3, name: "FAQs", href: "#faqs" },
  ];

  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.galleryData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
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
  const maxLength = 350;
  const hasImages = galleryData.imageCards.length !== 0;
  const isOwner = galleryData?.username === myData?.username;
  const [scrollPosition, setScrollPosition] = useState(0);

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    } else {
      setActiveTab("");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [activeTab]);

  const handleTabClick = (event, href) => {
    setScrollPosition(window.scrollY);
    setActiveTab(href);
    window.history.pushState(null, "", `#${href}`);
  };
  const getSubdomain = () => {
    const host = window.location.hostname;
    const domain = domainUrl;
    if (host.endsWith(domain)) {
      const subdomain = host.replace(`.${domain}`, "");
      return subdomain === host ? null : subdomain;
    }
    return null;
  };

  useEffect(() => {
    if (galleryData.username === "") {
      const subdomain = getSubdomain();
      if (subdomain) {
        dispatch(setIsDomain(true));
        dispatch(updateGalleryField({ name: "username", value: subdomain }));
      }
    }
  }, [galleryData.username, dispatch]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const checkSubdomainExists = async () => {
      try {
        const response = await postRequestUnAuthenticated(`/username/exist`, {
          username: galleryData.username,
        });
        if (response.success) {
          dispatch(fetchGallery(galleryData.username));
          dispatch(fetchUserChannels(galleryData.username));
          setIsLoading(false);
        } else {
          setIsDomainExist(false);
          setIsLoading(false);
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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      setIsDropdownOpen2(false);
    }
  };

  const openUnsplashModal = () => setIsUnsplashModalOpen(true);
  const closeUnsplashModal = () => setIsUnsplashModalOpen(false);

  // const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  const { items } = useSelector((state) => state.profileItems);

  // const handleSubscribe = async () => {
  //   if (isLoggedIn) {
  //     dispatch(toggleGallerySubscription(galleryData));
  //   } else {
  //     openLoginModal();
  //   }
  // };

  // const handleCurationOpenModal = () => {
  //   if (isLoggedIn) {
  //     setIsDropdownOpen(false);
  //     handleOpenModal("modalCurationOpen");
  //   } else {
  //     openLoginModal();
  //   }
  // };

  // const toggleDropdown2 = () => {
  //   setIsDropdownOpen2(!isDropdownOpen2);
  // };

  // const handleChipOpen = () => {
  //   if (isLoggedIn) {
  //     setIsDropdownOpen(false);
  //     handleOpenModal("modalChipOpen");
  //   } else {
  //     openLoginModal();
  //   }
  // };

  const handleEditCards = () => {
    dispatch(updateGalleryField({ name: "activeTab", value: "displayCards" }));
    setIsBottomSheetOpen(true);
  };

  const openShareModal = (link) => {
    handleOpenModal("modalShareProfileOpen", link);
    dispatch(setProfileEngagement(galleryData._id));
  };

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

  // const handleCategoryOpenModal = () => {
  //   setIsDropdownOpen(false);
  //   handleOpenModal("modalCreateCategoryOpen");
  // };

  // const handleCategoryReorderModal = () => {
  //   setIsDropdownOpen2(false);
  //   handleOpenModal("modalCategoryReorderOpen");
  // };

  // const handleSubscribersModal = () => {
  //   handleOpenModal("modalMySubscribersOpen", galleryData._id);
  // };

  // const handleReorderItems = () => {
  //   setIsDropdownOpen2(false);
  //   setReorderItems(true);
  // };

  // const handleSaveChanges = () => {
  //   const items = pushItems.reorderItems;
  //   dispatch(updateItemsOrderCategory(items))
  //     .unwrap()
  //     .then(() => {
  //       setReorderItems(false);
  //       dispatch(clearReorderItems());
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // };
  // const handleResetChanges = () => {
  //   setReorderItems(false);
  // };

  // const handleNewsletterPage = () => {
  //   navigate(`/${myData?.username}/newsletter`);
  // };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isDomainExist) {
    navigate(`/404`);
    return;
  }

  return (
    <div
      className={`w-full pt-4 px-4 h-screen dark:bg-secondaryBackground-dark overflow-y-auto custom-scrollbar`}
      onClick={handleClickOutside}
    >
      {galleryStatus === "loading" ? (
        <ProfileSkeleton />
      ) : (
        <>
          {/* <div className="flex flex-row xs:ml-12 justify-center items-center mb-4"> */}
          {/* <div className="mx-auto -mt-1 ">
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
            </div> */}
          {/* {isOwner && (
              <p
                className="hidden xs:flex px-2 xs:px-4 w-[85px] xs:w-32 text-center   xs:mb-1 py-1 xs:py-3 rounded-lg text-xs  bg-primary text-buttonText cursor-pointer"
                onClick={handleNewsletterPage}
              >
                Send newsletter
              </p>
            )} */}
          {/* </div> */}
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
          <div className="">
            <div
              className={`${
                isOwner || hasImages ? "md:dark:bg-tertiaryBackground-dark" : ""
              }  rounded-lg md:px-6 px-0 py-4 sm:py-6 w-full`}
            >
              <div
                className={`flex flex-col rounded-md md:flex-row ${
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
                      className="rounded-full w-24 h-24 border border-white object-cover"
                      style={{ borderWidth: "3px" }}
                    />
                  ) : (
                    <img
                      src={ProfileIcon}
                      alt="Profile"
                      className="rounded-full w-24 h-24 dark:bg-chatDivider-dark border dark:border-secondaryText-dark p-6 object-cover"
                      style={{ borderWidth: "2px" }}
                    />
                  )}
                  <div
                    className={`mt-1   ${
                      isOwner || hasImages ? "profile-text" : "text-center"
                    }`}
                  >
                    <p
                      className={`sm:text-2xl text-xl  dark:text-secondaryText-dark font-normal font-inter`}
                    >
                      {galleryData.name}
                    </p>
                    <p className="mt-1 text-xs  font-light dark:text-profileColor-dark font-inter">
                      {galleryData.username}.{domainUrl}
                    </p>
                    {/* <p
                      className="mt-1 text-xs  font-normal text-viewAll font-inter cursor-pointer"
                      onClick={handleSubscribersModal}
                    >
                      {galleryData.subscribers.length} Subscribers
                    </p> */}
                    {
                      <Linkify componentDecorator={componentDecorator}>
                        <p
                          className="mt-2 text-sm font-light dark:text-description-dark whitespace-pre-wrap 
                        overflow-hidden overflow-wrap break-word"
                        >
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
                              className="dark:text-secondaryText-dark cursor-pointer ml-1"
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
                      <p className="mt-2 font-light text-xs dark:text-profileColor-dark">
                        {galleryData.location}
                        {galleryData.contact && galleryData.location
                          ? " | "
                          : ""}
                        {galleryData.contact}
                      </p>
                    )}
                    <div
                      className={`flex flex-row space-x-4  ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
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
                          className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-secondaryText-dark
                           dark:text-primaryBackground-dark text-xs rounded-lg"
                        >
                          Share profile
                        </p>
                      )}
                      {galleryData.customText && galleryData.customUrl && (
                        <a
                          className={`px-4 mt-4 py-2.5 ${
                            isOwner
                              ? "border dark:border-secondaryText-dark dark:text-secondaryText-dark"
                              : "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                          } 
                           font-normal text-xs rounded-lg`}
                          href={galleryData.customUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {galleryData.customText}
                        </a>
                      )}

                      {!isOwner && (
                        <div
                          onClick={() =>
                            openShareModal(
                              `https://` +
                                galleryData.username +
                                `.${domainUrl}`
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer px-3 mt-4 font-normal py-2.5 border dark:border-secondaryText-dark
                           dark:text-secondaryText-dark text-xs rounded-lg"
                        >
                          Share profile
                        </div>
                      )}
                      {isOwner && (
                        <a
                          className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
                            dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
                          href={galleryData.customUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {galleryData.logo && galleryData.description !== ""
                            ? "Edit Profile"
                            : "Complete Profile"}
                        </a>
                      )}
                    </div>
                    <div
                      className={`flex ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      {galleryData.links.length >= 1 && (
                        <div
                          className="w-64 my-3  border dark:border-chatDivider-dark "
                          style={{ height: "0.1px" }}
                        ></div>
                      )}
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
                    className={`flex lg:ml-5 md:ml-2 md:mt-0 mt-4 md:mb-0 justify-center ${
                      !galleryData.description ||
                      galleryData.description.length <= 40
                        ? "xl:w-1/2"
                        : " xl:w-3/5"
                    }  h-full w-full md:justify-end mb-2 lg:w-3/5 md:w-1/2`}
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
            <div className="items-center text-center mt-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={(event) => handleTabClick(event, tab.href)}
                  className={`mx-2 xs:px-8 px-4 py-3 text-sm transition-colors duration-300 ${
                    activeTab === tab.href
                      ? "border-b-2 dark:text-secondaryText-dark dark:border-secondaryText-dark"
                      : "dark:text-primaryText-dark "
                  }`}
                  style={{ marginBottom: "-1px" }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div
              className="w-88px mx-auto border dark:border-chatDivider-dark "
              style={{ height: "0.1px" }}
            ></div>
            <div className="mt-6 mb-8">
              {activeTab === "" ? (
                <ChannelsTab gallery={true} />
              ) : activeTab === "#curations" ? (
                <CurationsTab isOwner={isOwner} items={items} gallery={true} />
              ) : (
                <FaqsTab username={galleryData.username} />
              )}
            </div>
            <div
              className={`flex justify-between items-center ${
                hasImages ? "mt-2 xs:mt-4" : "mt-1"
              } -ml-2`}
            ></div>
          </div>
          <ProfileForm
            isOpen={isBottomSheetOpen}
            onClose={closeBottomSheet}
            onUnsplashClick={openUnsplashModal}
            gallery={true}
          />
          <UnsplashModal
            isOpen={isUnsplashModalOpen}
            onClose={closeUnsplashModal}
          />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Gallery;
