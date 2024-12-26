import React, { useState, useEffect } from "react";
import PageSidebar from "./PageSidebar";
import PageHeader from "./PageHeader";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import PageForm from "./PageForm";
import PageChat from "./PageChat";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopic } from "../../redux/slices/topicSlice";

const PageHome = () => {
  const { channelName, channelId, topicId } = useParams();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic);

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };
  const toggleSidebar = () => {
    setIsBottomSheetOpen(false);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeBottomSheet = () => setIsBottomSheetOpen(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    dispatch(fetchTopic(topicId));
  }, []);

  return (
    <div className="w-full h-screen dark:bg-secondaryBackground-dark flex  ">
      <div className="flex flex-col w-full h-full">
        <PageHeader
          channelName={channelName}
          topic={topic}
          // toggleSidebar={toggleSidebar}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen}
          // isSidebarOpen={isSidebarOpen}
        />
        <PageChat topicId={topicId} channelId={channelId} />
      </div>
      <PageForm
        isOpen={isBottomSheetOpen}
        onClose={closeBottomSheet}
        channelName={channelName}
        topic={topic}
      />
    </div>
  );
};

export default PageHome;
