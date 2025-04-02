import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Menu from "../../assets/icons/menu.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import APITab from "./Tabs/APITab";
import SettingsTab from "./Tabs/SettingsTab";

const AdminHome = () => {
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myData = useSelector((state) => state.auth.myData);

  const { username } = params;
  const [activeTab, setActiveTab] = useState("");

  const tabs = [
    { id: 1, name: "API", href: "" },
    { id: 2, name: "Settings", href: "settings" },
    // { id: 3, name: "Data", href: "data" },
  ];

  // if (!isLoggedIn && myData?.username !== username) {
  //   return;
  // }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-row w-full h-full">
      <div className="h-full w-11 dark:bg-black flex flex-col items-center pl-2">
        <div className="w-10 flex">
          <img
            src={Menu}
            alt="close"
            className="mt-3  h-6 w-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
        <div className="w-10 mt-4 flex">
          <img
            src={ArrowBack}
            alt="close"
            className="mt-3  h-6 w-6 cursor-pointer text-secondaryText-dark"
            onClick={toggleSidebar}
          />
        </div>
      </div>

      <div className="flex flex-row h-screen w-[100%]">
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0  sm:flex ${
            isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
          } lg:w-[250px]  md:w-1/4 sm:w-[30%] w-[250px]  dark:bg-primaryBackground-dark`}
        >
          <AdminSidebar
            closeSidebar={closeSidebar}
            username={username}
            tabs={tabs}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"></div>
        )}

        <div className="lg:w-full-minus-250 md:w-3/4 sm:w-[70%] w-full h-full">
          {activeTab === "" ? (
            <APITab />
          ) : activeTab === "settings" ? (
            <SettingsTab />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
