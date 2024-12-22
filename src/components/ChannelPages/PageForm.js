import React, { useState, useEffect, useRef } from "react";
import SummaryPage from "./FormPages/SummaryPage";
import ResourcePage from "./FormPages/ResourcePage";
import EventsPage from "./FormPages/EventsPage";

const PageForm = ({ isOpen, onClose, channelName, pageName }) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState("summary");

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (modalRef.current && !modalRef.current.contains(event.target)) {
  //         onClose();
  //       }
  //     };
  //     if (isOpen) {
  //       document.addEventListener("mousedown", handleClickOutside);
  //     } else {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     }
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [isOpen, onClose]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryPage />;
      case "resources":
        return <ResourcePage />;
      case "events":
        return <EventsPage />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex  items-end justify-end ${
        isOpen ? "" : "hidden"
      } pointer-events-none`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40"></div>
      <div
        ref={modalRef}
        className="dark:bg-tertiaryBackground-dark border dark:border-modalBorder-dark rounded-t-lg w-full md:w-1/2 sm:w-[55%] 
        lg:w-[35%] xl:w-[30%] sm:h-[93%] h-5/6 pt-2 pointer-events-auto  z-50"
      >
        <div className="dark:text-white text-center mb-3">
          {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
        </div>
        <div className="flex justify-between mb-3 pr-1 border-b  dark:border-chatDivider-dark">
          <button
            className={` font-normal font-inter text-sm pt-2 pb-3 px-5 ${
              activeTab === "summary"
                ? "border-b-2 dark:border-primaryText-dark dark:text-primaryText-dark"
                : "dark:text-secondaryText-dark"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("summary")}
          >
            Chat Summary
          </button>
          <button
            className={`  font-inter text-sm pt-2 pb-3 px-5 ${
              activeTab === "resources"
                ? "border-b-2 dark:border-primaryText-dark dark:text-primaryText-dark"
                : "dark:text-secondaryText-dark"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`  font-inter text-sm pt-2 pb-3 px-5 ${
              activeTab === "events"
                ? "border-b-2 dark:border-primaryText-dark dark:text-primaryText-dark"
                : "dark:text-secondaryText-dark"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
        </div>
        <div
          className="overflow-y-auto px-4 custom-scrollbar flex-grow flex flex-col h-full"
          style={{ maxHeight: "calc(100% - 120px)" }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PageForm;
