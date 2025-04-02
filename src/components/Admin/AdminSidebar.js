import React, { useState } from "react";
import Close from "../../assets/icons/Close.svg";
import { useLocation } from "react-router-dom";

const AdminSidebar = ({
  closeSidebar,
  username,
  tabs,
  setActiveTab,
  activeTab,
}) => {
  const handleTabClick = (event, href) => {
    setActiveTab(href);
    window.history.pushState(null, "", `#${href}`);
  };
  const location = useLocation();
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto custom-side-scrollbar pt-4 dark:bg-secondaryBackground-dark">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>
        <p className="dark:text-secondaryText-dark text-lg md:text-xl lg:text-2xl font-normal mb-6 text-center">
          Admin Panel
        </p>
        {tabs.map((tab) => (
          <div key={tab.id} className="flex flex-col w-full">
            <button
              onClick={(event) => handleTabClick(event, tab.href)}
              className={` pl-6 mb-1 text-start cursor-pointer ${
                activeTab === tab.href
                  ? "dark:text-secondaryText-dark dark:bg-tertiaryBackground-dark rounded-lg py-2 mx-3"
                  : "dark:text-primaryText-dark"
              }`}
              style={{ marginBottom: "-1px" }}
            >
              {tab.name}
            </button>
            <div className="border-[1px] dark:border-tertiaryBackground-dark my-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
