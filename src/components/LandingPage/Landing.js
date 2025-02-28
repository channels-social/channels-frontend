import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../../assets/icons/menu.svg";
import UserSidebar from "./../Sidebar/UserSidebar";

const Landing = () => {
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
    <div className="flex flex-col w-full">
      <div className="w-full  dark:bg-secondaryBackground-dark sm:hidden flex">
        <img
          src={Menu}
          alt="close"
          className="mt-3  ml-6 h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-row h-screen w-[100%]">
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0  sm:flex ${
            isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
          } lg:w-[250px]  md:w-1/4 sm:w-[30%] w-[250px]  dark:bg-primaryBackground-dark`}
        >
          <UserSidebar closeSidebar={closeSidebar} />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"></div>
        )}

        <div className="lg:w-full-minus-250 md:w-3/4 sm:w-[70%] w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Landing;
