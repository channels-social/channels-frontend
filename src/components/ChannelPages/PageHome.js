import React, { useState } from "react";
import PageSidebar from "./PageSidebar";
import PageHeader from "./PageHeader";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageForm from "./PageForm";
import PageChat from "./PageChat";

const PageHome = () => {
  const { channelName, topicName } = useParams();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };
  const toggleSidebar = () => {
    setIsBottomSheetOpen(false);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeBottomSheet = () => setIsBottomSheetOpen(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="w-full h-screen dark:bg-secondaryBackground-dark flex  ">
      <div className="flex flex-col w-full h-full">
        <PageHeader
          channelName={channelName}
          pageName={topicName}
          // toggleSidebar={toggleSidebar}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen}
          // isSidebarOpen={isSidebarOpen}
        />
        <PageChat />
      </div>
      <PageForm
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        channelName={channelName}
        pageName={topicName}
      />
    </div>
  );
};

export default PageHome;
