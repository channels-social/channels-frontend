import { React, useState } from "react";
import SaveIcon from "../../assets/icons/save_icon.svg";
import SavedIcon from "../../assets/icons/favorite.svg";
import Upvote from "../../assets/icons/upvote.svg";
import Upvoted from "../../assets/icons/upvoted.svg";
import Send from "../../assets/icons/Send.svg";
import MetaCard from "./widgets/MetaCard";
import Comment from "../../assets/icons/Comment.svg";
import GoogleMapsCard from "./widgets/googleMapsCard";
import DateTimeCard from "./widgets/DateTime";
import ImageList from "./widgets/ImageList";
import RenderLink from "./widgets/videoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { upvoteChip, saveChip } from "./../../redux/slices/profileItemsSlice";
import useModal from "./../hooks/ModalHook";
import { domainUrl } from "./../../utils/globals";
import Initicon from "./../../widgets/InitIcon";
import { setChipEngagement } from "./../../redux/slices/chipEngagementSlice";
import DocumentPreview from "./widgets/DocumentPreview";
import Linkify from "react-linkify";
import { setCommentChip } from "./../../redux/slices/commentChipSlice";
import { useNavigate } from "react-router-dom";

const Chips = ({ item }) => {
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { handleOpenModal } = useModal();
  const [isExpanded, setIsExpanded] = useState(false);

  const maxLength = 250;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const openShareModal = () => {
    const linkToShare = `https://${domainUrl}/profile/${item.user?.username}/chip/${item._id}`;
    handleOpenModal("modalShareChipOpen", linkToShare);
    dispatch(setChipEngagement(item._id));
  };
  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };
  const openCommentModal = () => {
    if (isLoggedIn) {
      dispatch(setCommentChip(item));
      setTimeout(() => {
        handleOpenModal("modalCommentOpen");
      }, 0);
    } else {
      openLoginModal();
    }
  };

  const handleUpvote = () => {
    if (isLoggedIn) {
      dispatch(upvoteChip(item._id));
      dispatch(setChipEngagement(item._id));
    } else {
      openLoginModal();
    }
  };
  const handleSaved = () => {
    if (isLoggedIn) {
      const chipId = item._id;
      const curationId = null;
      const originId = item.curation;
      dispatch(saveChip({ chipId, curationId, originId }));
      dispatch(setChipEngagement(chipId));
      setSavedMessageVisible(true);
      if (isSaved) {
        setSavedMessage("Unsaved!");
      } else {
        setSavedMessage("Saved!");
      }
      setTimeout(() => {
        setSavedMessageVisible(false);
      }, 1000);
    } else {
      openLoginModal();
    }
  };

  const isUpvoted = item.upvotes?.includes(myData?._id);
  const isSaved = item.saved_by?.includes(myData?._id);

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link dark:text-buttonEnable-dark"
    >
      {text}
    </a>
  );
  return (
    <div className="container pl-4 pb-4 w-full pt-4 space-y-2.5 rounded-lg border dark:border-chatDivider-dark dark:bg-tertiaryBackground-dark">
      <div
        className="cursor-pointer w-max"
        onClick={() => navigate(`/profile/${item.user.username}`)}
      >
        {item.user?.logo ? (
          <img
            src={item.user.logo}
            alt="Curation"
            className=" w-11 h-11 rounded-xl mr-1.5 object-cover"
          />
        ) : (
          <Initicon text={item.user.name} size={42} />
        )}
      </div>
      <p className="dark:text-secondaryText-dark text-sm mt-1 font-normal pr-4">
        {item.user?.name}
      </p>
      <div className="flex flex-col space-y-2.5">
        {
          <Linkify componentDecorator={componentDecorator}>
            <p className="dark:text-secondaryText-dark pr-1 text-sm font-light font-inter whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
              {isExpanded
                ? item.text
                : `${item.text.slice(0, maxLength)}${
                    item.text.length > maxLength ? "..." : ""
                  }`}
              {item.text.length > maxLength && (
                <span
                  onClick={toggleReadMore}
                  className="text-primary cursor-pointer ml-1"
                >
                  {isExpanded ? "<- Show Less" : "Read More ->"}
                </span>
              )}
            </p>
          </Linkify>
        }
        {item.date.date && item.date.event && <DateTimeCard item={item.date} />}
        {item.location.text && <GoogleMapsCard item={item.location} />}
        <div className="mr-3">
          {item.document && item.document.url && (
            <DocumentPreview document={item.document} />
          )}
        </div>
        {item.link && !item.metaLink?.ogTitle && <RenderLink url={item.link} />}
        {item.image_urls.length !== 0 && (
          <ImageList imageCards={item.image_urls} />
        )}
        {item.metaLink && item.metaLink.ogTitle !== "" && (
          <MetaCard
            title={item.metaLink.ogTitle}
            description={item.metaLink.ogDescription}
            imageUrl={item.metaLink.ogImage}
            link={item.link}
          />
        )}
      </div>
      <div className="ml-1 mt-3 flex flex-row justify-between items-center mr-4">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={handleUpvote}
        >
          <img
            src={isUpvoted ? Upvoted : Upvote}
            alt="Upvote"
            className="mr-0.5 h-5 w-5"
          />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.upvotes.length}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openCommentModal}
        >
          <img src={Comment} alt="Comment" className="mr-0.5" />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.comments ? item?.comments : 0}
          </p>
        </div>
        <div
          className="flex flex-row items-center mt-0.5 cursor-pointer"
          onClick={openShareModal}
        >
          <img src={Send} alt="Send" className="mr-0.5 h-7 w-7" />
          <p className="dark:text-secondaryText-dark text-sm font-normal">
            {item.shared_by}
          </p>
        </div>
        <div className="relative">
          {isSavedMessageVisible && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-dark text-white text-xs rounded-lg px-2 py-1">
              {savedMessage}
            </div>
          )}
          <div
            className={`${
              isSaved ? "" : "dark:bg-chatDivider-dark"
            } px-2 py-0.5 rounded-xl cursor-pointer`}
            onClick={handleSaved}
          >
            <img
              src={isSaved ? SavedIcon : SaveIcon}
              alt="save"
              className="h-5 w-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chips;
