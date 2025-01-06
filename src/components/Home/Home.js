import React, { useState } from "react";
import HomeBackground from "../../assets/images/home_background.svg";
import Logo from "../../assets/icons/channels_logo.svg";
import HomeImage from "../../assets/images/home_image.svg";
import CommunityImage from "../../assets/images/community_image.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useModal from "./../hooks/ModalHook";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myData = useSelector((state) => state.myData);
  const { handleOpenModal } = useModal();

  const handleLogin = () => {
    if (isLoggedIn) {
      navigate(`/user/${myData.username}/profile`);
    } else {
      navigate("/get-started");
    }
  };

  const handleCreateChannel = () => {
    if (isLoggedIn) {
      navigate(`/user/${myData.username}/profile`);
      setTimeout(() => {
        handleOpenModal("modalChannelOpen");
      }, 500);
    } else {
      navigate("/get-started");
    }
  };

  return (
    <div className="w-full h-screen dark:bg-primaryBackground-dark">
      <img
        src={HomeBackground}
        alt="home-background"
        className="w-full h-screen relative"
      />
      <div className="absolute top-4 left-0 flex flex-col w-full">
        <div className="flex flex-row justify-between w-full items-center px-6 ">
          <img src={Logo} alt="logo" className="h-8 w-auto" />
          <div
            className="border cursor-pointer dark:border-white rounded-md px-6 py-2 dark:text-white font-normal text-sm"
            onClick={handleLogin}
          >
            {isLoggedIn ? "Profile" : "Login"}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-16 ml-20">
          <div className="flex flex-col w-1/3 space-y-3">
            <div className="text-left dark:text-sidebarColor-dark text-sm font-normal font-inter">
              Your people, Your space
            </div>
            <div className=" text-white text-2xl font-normal font-inter">
              Why need a ton of apps for a great community, when they already
              love yours
            </div>
            <div className="opacity-80 text-white text-xs font-light font-inter">
              Simply integrate chats, events, and share content with your
              audience right inside your website or app, giving your community a
              space to thrive.
            </div>
            <div className="flex flex-row justify-start items-center pt-2">
              <div
                className="dark:bg-white cursor-pointer rounded-lg px-3 py-2 dark:text-tertiaryBackground-dark text-sm"
                onClick={handleCreateChannel}
              >
                Create your Channel
              </div>
              <div className="border ml-5 cursor-pointer dark:border-white rounded-md px-6 py-2 dark:text-white font-normal text-sm">
                Talk to us
              </div>
            </div>
          </div>
          <div className="ml-8 relative h-[20%]">
            <img
              src={activeTab === "home" ? HomeImage : CommunityImage}
              alt="home-image"
              className=" "
            />
            <div className="absolute top-2 left-[40%] dark:text-black">
              <div className="flex items-center justify-center w-full h-12 ">
                <div className="flex border-2 dark:border-homeToggle-dark rounded-full ">
                  <button
                    onClick={() => setActiveTab("home")}
                    className={`${
                      activeTab === "home"
                        ? "dark:bg-black text-white"
                        : "dark:text-homeToggle-dark"
                    } px-4 py-1.5 rounded-full transition-colors duration-300`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab("community")}
                    className={`${
                      activeTab === "community"
                        ? "dark:bg-black text-white"
                        : "dark:text-homeToggle-dark"
                    } px-4 py-1.5 rounded-full transition-colors duration-300`}
                  >
                    Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </div>
  );
};

export default HomePage;
