import React, { useState, useEffect } from "react";
import PageHeader from "./PageHeader";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import PageForm from "./PageForm";
import PageChat from "./PageChat";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopic, setTopicField } from "../../redux/slices/topicSlice";
import { fetchChannel } from "../../redux/slices/channelSlice";
import EmptyTopicPage from "./widgets/EmptyTopicPage";
import TopicHomeSkeleton from "./../skeleton/Topic/TopicHomeSkeleton";
import InviteTopicPage from "./../Channel/InviteTopicPage";

const PageHome = () => {
  const { channelName, channelId, topicId } = useParams();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const dispatch = useDispatch();
  const topic = useSelector((state) => state.topic);
  const topicStatus = useSelector((state) => state.topic.topicstatus);
  const channel = useSelector((state) => state.channel);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [loading, setLoading] = useState(true);
  const galleryUsername = useSelector((state) => state.galleryData.username);
  const location = useLocation();
  const fromGallery = location.state?.fromGallery;
  const params = useParams();
  const username = fromGallery ? galleryUsername : params.username;
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };
  const closeBottomSheet = () => setIsBottomSheetOpen(false);
  useEffect(() => {
    dispatch(fetchTopic(topicId));
    dispatch(fetchChannel(channelId));
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [topicId, channelId, dispatch]);

  const isLoading =
    topicStatus === "loading" || channel.loading === true || loading;

  const isChannelMember = channel.members.includes(myData._id);
  const isTopicOwner = topic.user === myData._id;
  const isInvitedToTopic = topic.allowedVisibleUsers.includes(myData._id);
  const isGuest = !isLoggedIn;

  if (isLoading) {
    return <TopicHomeSkeleton />;
  }

  if (inviteCode) {
    dispatch(setTopicField({ field: "loadingStatus", value: "idle" }));
    return (
      <InviteTopicPage
        code={inviteCode}
        topicId={topicId}
        username={username}
        channelId={channelId}
      />
    );
  }

  const isUnauthorized =
    isGuest ||
    (!isChannelMember && !isTopicOwner) ||
    (topic.visibility === "me" && !isTopicOwner) ||
    (topic.visibility === "invite" && !isInvitedToTopic && !isTopicOwner);

  if (isUnauthorized) {
    return <EmptyTopicPage />;
  }

  return (
    <div className="w-full h-screen dark:bg-secondaryBackground-dark flex flex-row ">
      <div className="flex flex-col w-full h-full">
        <PageHeader
          channelName={channelName}
          topic={topic}
          // toggleSidebar={toggleSidebar}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen}
          username={username}
          channelId={channelId}
          // isSidebarOpen={isSidebarOpen}
        />
        <PageChat
          topicId={topicId}
          topic={topic}
          channelId={channelId}
          isLoggedIn={isLoggedIn}
          myData={myData}
        />
      </div>
      {/* <div className="hidden lg:flex w-max h-full">
        <PageForm channelName={channelName} topic={topic} />
      </div> */}
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
