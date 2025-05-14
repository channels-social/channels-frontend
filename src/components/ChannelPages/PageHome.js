import PageForm from "./PageForm";
import PageChat from "./PageChat";
import {
  fetchTopic,
  setTopicField,
  fetchTopicSubscription,
} from "../../redux/slices/topicSlice";
import { fetchChannel } from "../../redux/slices/channelSlice";
import TopicHomeSkeleton from "./../skeleton/Topic/TopicHomeSkeleton";
import InviteTopicPage from "./../Channel/InviteTopicPage";
import { connectSocketWithUser } from "../../utils/socket";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";

import {
  React,
  useState,
  useEffect,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useLocation,
  useSearchParams,
} from "../../globals/imports";

const PageHome = () => {
  const { channelId, topicId } = useParams();

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
  const navigate = useNavigate();

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };
  const closeBottomSheet = () => setIsBottomSheetOpen(false);
  useEffect(() => {
    dispatch(fetchTopic(topicId));
    dispatch(fetchChannel(channelId));
    dispatch(fetchTopicSubscription(topicId));
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [topicId, channelId, dispatch]);

  useEffect(() => {
    if (myData?._id) {
      connectSocketWithUser(myData._id);
    }
  }, [myData]);

  const isLoading =
    topicStatus === "loading" || channel.loading === true || loading;

  const isChannelMember = channel?.members?.includes(myData?._id);
  const isTopicOwner = topic.user === myData._id;
  const isInvitedToTopic = topic?.channel?.members?.includes(myData?._id);
  const isGuest = !isLoggedIn;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        navigate(
          `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/user/${username}/channel/${channelId}/c-id/topic/${topicId}`
        );
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  const isUnauthorized =
    (!isChannelMember && !isTopicOwner) ||
    (topic.channel.visibility === "me" && !isTopicOwner) ||
    (topic.channel.visibility === "invite" &&
      !isInvitedToTopic &&
      !isTopicOwner);

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

  if (isLoading) {
    return <TopicHomeSkeleton />;
  }

  if (isLoggedIn && isUnauthorized && myData._id) {
    return (
      <div className="w-full h-screen bg-theme-secondaryBackground text-center flex flex-col justify-center font-bold text-lg text-theme-secondaryText">
        <p>You don't have authorization to this topic</p>
        <div
          className="cursor-pointer text-sm font-normal text-center mt-4 rounded-lg mx-auto
         bg-theme-secondaryText py-2 px-3 text-theme-primaryBackground w-max"
          onClick={() =>
            navigate(`${getAppPrefix()}/user/${username}/channel/${channelId}`)
          }
        >
          Return to Channel Page
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-theme-secondaryBackground flex flex-row ">
      <div className="flex-1 overflow-hidden">
        {/* <PageHeader
          channelName={channelName}
          topic={topic}
          // toggleSidebar={toggleSidebar}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen} 
          username={username}
          channelId={channelId}
          // isSidebarOpen={isSidebarOpen}
        /> */}
        <PageChat
          topicId={topicId}
          topic={topic}
          channelId={channelId}
          isLoggedIn={isLoggedIn}
          myData={myData}
          channelName={channel.name}
          toggleBottomSheet={toggleBottomSheet}
          isOpen={isBottomSheetOpen}
          username={username}
        />
      </div>

      <div className="">
        <PageForm
          isOpen={isBottomSheetOpen}
          onClose={closeBottomSheet}
          topic={topic}
        />
      </div>
    </div>
  );
};

export default PageHome;
