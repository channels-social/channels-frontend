import React, { useState, useRef, useEffect } from "react";
import SummaryPage from "./FormPages/SummaryPage";
import ResourcePage from "./FormPages/ResourcePage";
import EventsPage from "./FormPages/EventsPage";

const PageForm = ({ isOpen, onClose, channelName, topic }) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState("resources");
  const [forceOpen, setForceOpen] = useState(window.innerWidth >= 1170);

  useEffect(() => {
    const handleResize = () => {
      setForceOpen(window.innerWidth >= 1170);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      // case "summary":
      //   return <SummaryPage />;
      case "resources":
        return <ResourcePage />;
      case "events":
        return <EventsPage topicId={topic._id} />;
      default:
        return null;
    }
  };

  const shouldShowModal = !forceOpen && isOpen;
  const shouldShowSidebar = forceOpen;

  if (!shouldShowModal && !shouldShowSidebar) return null;

  return (
    <div
      className={`${
        shouldShowSidebar
          ? "xl:flex hidden w-max h-full"
          : "fixed inset-0 z-50 flex items-end justify-end"
      }`}
    >
      {/* Dark background for modal mode */}
      {shouldShowModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={onClose} // Close when clicking outside modal
        ></div>
      )}
      <div
        ref={modalRef}
        className={`dark:bg-tertiaryBackground-dark xl:dark:bg-primaryBackground-dark 
          border dark:border-modalBorder-dark rounded-t-lg 
          w-full  xl:w-[380px] xs:w-[375px] xl:h-full h-[88%] pt-1 pointer-events-auto z-50`}
      >
        {/* <div className="dark:text-white text-center mb-3">
          {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
        </div> */}
        <div className="flex justify-center mb-3 pr-1 border-b  dark:border-chatDivider-dark">
          {/* <button
            className={` font-normal font-inter text-sm pt-2 pb-3 px-5 ${
              activeTab === "summary"
                ? "border-b-2 dark:border-primaryText-dark dark:text-primaryText-dark"
                : "dark:text-secondaryText-dark"
            } transition-colors duration-200`}
            onClick={() => setActiveTab("summary")}
          >
            Chat Summary
          </button> */}
          <button
            className={`  font-inter text-sm py-3 px-5 w-1/2 ${
              activeTab === "resources"
                ? "border-b-2 dark:border-primaryText-dark dark:text-primaryText-dark"
                : "dark:text-secondaryText-dark"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`  font-inter text-sm py-3 px-5 w-1/2 ${
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
          className="overflow-y-auto px-4  flex-grow flex flex-col h-full"
          style={{ maxHeight: "calc(100% - 64px)" }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PageForm;
