import React, { useState, useEffect } from "react";
import {
  useLocation,
  Link,
  Outlet,
  useParams,
  useNavigate,
} from "react-router-dom";

import PoweredBy from "../../assets/icons/poweredby.svg";
import Menu from "../../assets/icons/menu.svg";

import UserSidebar from "./../Sidebar/UserSidebar";

const Landing = () => {
  const location = useLocation();
  const { username } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  // useEffect(() => {
  //   const decodedPageName = decodeURIComponent(pageName || "");
  //   const channelIndex = channels.findIndex(
  //     (channel) => channel.name === channelName
  //   );
  //   const pageIndex =
  //     channelIndex !== -1
  //       ? channels[channelIndex].pages.findIndex(
  //           (page) => page === decodedPageName
  //         )
  //       : -1;
  //   setExpandedChannels((prev) =>
  //     prev.map((_, i) => (i === channelIndex ? true : prev[i]))
  //   );
  //   setSelectedPages({ [channelIndex]: pageIndex });
  // }, [channelName, pageName]);

  return (
    <div className="flex flex-col">
      <div className="w-full  dark:bg-secondaryBackground-dark sm:hidden flex">
        <img
          src={Menu}
          alt="close"
          className="mt-3  ml-6 h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-row h-screen w-full">
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0  sm:flex ${
            isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
          } lg:w-1/6 md:w-1/4 sm:w-[30%] w-3/5  dark:bg-primaryBackground-dark`}
        >
          <UserSidebar username={username} closeSidebar={closeSidebar} />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"></div>
        )}

        <div className="lg:w-5/6 md:w-3/4 sm:w-[70%] w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Landing;
