import React, { useState, useRef, useEffect } from "react";
import ArrowForward from "../../assets/icons/arrow_forward_dark.svg";
import { useLocation } from "react-router-dom";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import ProfileForm from "./FormProfile/ProfileForm";
import ProfileCarousel from "./Widgets/ProfileCarousel";
import UnsplashModal from "./../Modals/UnsplashModal";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../hooks/ModalHook";
import { useParams, useNavigate } from "react-router-dom";
import { hostUrl } from "../../utils/globals";

import {
  fetchProfile,
  selectProfileStatus,
} from "./../../redux/slices/profileSlice";
import ProfileSkeleton from "./../skeleton/profileSkeleton";
import { updateProfileField } from "../../redux/slices/profileSlice";
import { fetchUserChannels } from "../../redux/slices/channelItemsSlice";
import { Outlet } from "react-router-dom";
import EmptyProfileCard from "./Widgets/EmptyProfileCard";
import { domainUrl } from "./../../utils/globals";
import { setProfileEngagement } from "./../../redux/slices/profileEngagementSlice";
import Others from "../../assets/icons/Subtract.svg";
import { postRequestUnAuthenticated } from "./../../services/rest";
import Linkify from "react-linkify";
import ChannelsTab from "./profileTabs/ChannelsTab";
import CurationsTab from "./profileTabs/CurationsTab";
import FaqsTab from "./profileTabs/FaqsTab";

const Profile = () => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isUnsplashModalOpen, setIsUnsplashModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDomainExist, setIsDomainExist] = useState(true);
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const { username } = useParams();
  const profileStatus = useSelector(selectProfileStatus);
  const profileData = useSelector((state) => state.profileData);
  const isOwner = myData?.username === username;
  const { items } = useSelector((state) => state.profileItems);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const maxLength = 350;
  const searchParams = new URLSearchParams(location.search);
  const accept = searchParams.get("accept");
  const channelId = searchParams.get("channelId");
  const userId = searchParams.get("userId");
  const [inviteModal, setInviteModal] = useState(true);
  const channelName = searchParams.get("channelName");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: 1, name: "Channels", href: "" },
    { id: 2, name: "Curations", href: "#curations" },
    { id: 3, name: "FAQs", href: "#faqs" },
  ];

  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, [activeTab]);

  const handleTabClick = (event, href) => {
    setScrollPosition(window.scrollY);
    setActiveTab(href);
    window.history.pushState(null, "", `#${href}`);
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    } else {
      setActiveTab("");
    }
  }, []); //

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
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

  useEffect(() => {
    const checkSubdomainExists = async (subdomain) => {
      try {
        const response = await postRequestUnAuthenticated(`/username/exist`, {
          username: subdomain,
        });
        console.log(response);
        if (response.success) {
          dispatch(fetchProfile(username));
          dispatch(fetchUserChannels(username));
        } else {
          setIsDomainExist(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking subdomain:", error);
        setIsLoading(false);
        setIsDomainExist(false);
      }
    };
    checkSubdomainExists(username);
  }, [username, dispatch]);

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

  const openBottomSheet = () => setIsBottomSheetOpen(true);
  const closeBottomSheet = () => setIsBottomSheetOpen(false);

  // const handleCurationOpenModal = () => {
  //   setIsDropdownOpen(false);
  //   handleOpenModal("modalCurationOpen");
  // };
  // const handleChipOpen = () => {
  //   setIsDropdownOpen(false);
  //   handleOpenModal("modalChipOpen");
  // };

  const openShareModal = (link) => {
    handleOpenModal("modalShareProfileOpen", link);
    dispatch(setProfileEngagement(profileData._id));
  };

  // const handleSubscription = () => {
  //   if (isLoggedIn) {
  //     dispatch(toggleSubscription(profileData));
  //   } else {
  //     handleOpenModal("modalLoginOpen");
  //   }
  // };
  // const handleSubscribersModal = () => {
  //   handleOpenModal("modalMySubscribersOpen", profileData._id);
  // };

  const handleEditCards = () => {
    dispatch(updateProfileField({ name: "activeTab", value: "displayCards" }));
    setIsBottomSheetOpen(true);
  };
  const handleInviteAccept = () => {
    setLoading(true);
    fetch(
      `${hostUrl}/api/accept/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);

        setInviteModal(false);
        if (data.success) {
          setMessage("You have successfully accepted the channel invite!");
        } else {
          setMessage(data.message || "Failed to accept the invite.");
        }
      })
      .catch((error) => {
        setMessage("An error occurred while processing your request.");
        setInviteModal(false);
      });
  };
  const handleDeclineAccept = () => {
    setLoading(true);
    fetch(
      `${hostUrl}/api/decline/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setInviteModal(false);
        if (data.success) {
          setMessage("You have successfully declined the channel invite!");
        } else {
          setMessage(data.message || "Failed to decline the invite.");
        }
      })
      .catch((error) => {
        setMessage("An error occurred while processing your request.");
        setInviteModal(false);
      });
  };

  // const handleNewsletterPage = () => {
  //   navigate(`/${myData?.username}/newsletter`);
  // };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!isDomainExist) {
    navigate(`/user/${username}/profile/404`);
    return;
  }
  const isInvite =
    inviteModal &&
    accept === "invitechannel" &&
    channelName !== "" &&
    channelId !== "" &&
    userId !== "";

  const hasImages = profileData.imageCards.length !== 0;
  // const isSubscribed = profileData.subscribers?.includes(myData?._id);

  return (
    <div
      className={`w-full pt-4 px-4 h-screen dark:bg-secondaryBackground-dark overflow-y-auto custom-scrollbar relative`}
      onClick={handleClickOutside}
    >
      {isInvite && (
        <div
          className="absolute z-60 top-0 -left-1 w-full flex flex-col dark:bg-primaryBackground-dark  px-4 pt-2 pb-3 border-b
         dark:border-b-chatDivider-dark"
        >
          <p className="dark:text-secondaryText-dark font-normal text-sm">
            {loading
              ? "Processing... Please wait."
              : `This user requests to join the ${channelName} channel. Your decision?`}
          </p>
          <div className="flex flex-row mt-2">
            <button
              className="cursor-pointer rounded-md py-1 px-2 dark:bg-buttonEnable-dark dark:text-secondaryText-dark font-light text-sm"
              onClick={handleInviteAccept}
            >
              Accept Invite
            </button>
            <button
              className="cursor-pointer ml-3 border rounded-md px-2 py-1 dark:border-secondaryText-dark 
              dark:text-secondaryText-dark font-light text-sm"
              onClick={handleDeclineAccept}
            >
              Decline
            </button>
          </div>
        </div>
      )}
      {profileStatus === "loading" ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="">
            <div
              className={`${
                isOwner || hasImages ? "md:dark:bg-tertiaryBackground-dark" : ""
              }  rounded-lg lg:px-6 md:px-4 px-0 py-4 sm:py-6 w-full`}
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
                  {profileData.logo ? (
                    <img
                      src={profileData.logo}
                      alt="Profile"
                      className="rounded-full w-24 h-24 border dark:border-white object-cover"
                      style={{ borderWidth: "2px" }}
                    />
                  ) : (
                    <img
                      src={ProfileIcon}
                      alt="Profile"
                      className="rounded-full w-24 h-24 dark:bg-chatDivider-dark border dark:border-secondaryText-dark p-6 object-cover"
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
                      {profileData.name}
                    </p>
                    <p className="mt-1 text-xs font-light dark:text-profileColor-dark font-inter">
                      {profileData.username}.{domainUrl}
                    </p>
                    {/* <p
                      className="mt-1 text-xs  font-normal text-viewAll font-inter cursor-pointer"
                      onClick={handleSubscribersModal}
                    >
                      {profileData.subscribers.length} Subscribers
                    </p> */}
                    {
                      <Linkify componentDecorator={componentDecorator}>
                        <p
                          className="mt-2 text-sm font-light dark:text-description-dark whitespace-pre-wrap 
                        overflow-hidden overflow-wrap break-word"
                        >
                          {isExpanded
                            ? profileData.description
                            : `${profileData.description.slice(0, maxLength)}${
                                profileData.description.length > maxLength
                                  ? "..."
                                  : ""
                              }`}
                          {profileData.description.length > maxLength && (
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
                    {/* <p className="mt-2 text-sm font-light text-textColor whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
                 {profileData.description}
                </p> */}
                    {(profileData.location || profileData.contact) && (
                      <p className="mt-2 font-light text-xs dark:text-profileColor-dark">
                        {profileData.location}
                        {profileData.contact && profileData.location
                          ? " | "
                          : ""}
                        {profileData.contact}
                      </p>
                    )}
                    <div
                      className={`flex flex-row space-x-3  ${
                        isOwner || hasImages
                          ? "md:justify-start justify-center"
                          : "justify-center"
                      }`}
                    >
                      {isOwner && (
                        <div
                          onClick={() =>
                            openShareModal(
                              `https://` +
                                profileData.username +
                                `.${domainUrl}`
                            )
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-secondaryText-dark
                           dark:text-primaryBackground-dark text-xs rounded-lg"
                        >
                          Share profile
                        </div>
                      )}

                      {profileData.customText && profileData.customUrl && (
                        <a
                          className={`px-4 mt-4 py-2.5 ${
                            isOwner
                              ? "border dark:border-secondaryText-dark dark:text-secondaryText-dark"
                              : "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
                          } 
                           font-normal text-xs rounded-lg`}
                          href={profileData.customUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {profileData.customText}
                        </a>
                      )}
                      {!isOwner && (
                        <div
                          onClick={() =>
                            openShareModal(
                              `https://` +
                                profileData.username +
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
                        <button
                          className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
                            dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
                          onClick={openBottomSheet}
                        >
                          {profileData.logo && profileData.description !== ""
                            ? "Edit Profile"
                            : "Complete Profile"}
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
                      {profileData.links.length >= 1 && (
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
                      {profileData.links.map(
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
                      {profileData.otherLink && (
                        <a
                          href={profileData.otherLink}
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
                      !profileData.description ||
                      profileData.description.length <= 40
                        ? "xl:w-1/2"
                        : " xl:w-3/5"
                    } h-full w-full md:justify-end mb-2 lg:w-3/5 md:w-1/2`}
                  >
                    <ProfileCarousel images={profileData.imageCards} />
                  </div>
                ) : isOwner ? (
                  <div
                    className={`flex md:ml-4 md:mt-0 mt-4 md:mb-0 justify-center ${
                      !profileData.description ||
                      profileData.description.length <= 40
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
                <ChannelsTab gallery={false} />
              ) : activeTab === "#curations" ? (
                <CurationsTab isOwner={isOwner} items={items} gallery={false} />
              ) : (
                <FaqsTab username={username} />
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

export default Profile;
