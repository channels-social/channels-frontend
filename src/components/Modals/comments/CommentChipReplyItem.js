import React from "react";
import Upvote from "../../../assets/icons/upvote.svg";
import Upvoted from "../../../assets/icons/upvoted.svg";
import { formatDistanceToNowStrict } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCommentReplyUpvote,
  setScroll,
} from "./../../../redux/slices/commentChipSlice";
import { setChipEngagement } from "./../../../redux/slices/chipEngagementSlice";
import { useNavigate } from "react-router-dom";

const CommentChipReplyItem = ({ item, handleChange, chipId, comment }) => {
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const navigate = useNavigate();

  const toggleUpvoteCommentReply = (commentId, replyId) => {
    const data = {
      commentId: commentId,
      replyId: replyId,
    };
    dispatch(setScroll(false));
    dispatch(toggleCommentReplyUpvote(data));
    dispatch(setChipEngagement(chipId));
  };

  if (!item) {
    return <p>Loading..</p>;
  }
  let timeAgo = "";
  if (item.createdAt) {
    try {
      timeAgo = formatDistanceToNowStrict(new Date(item.createdAt), {
        addSuffix: true,
      });
    } catch (error) {
      console.error("Invalid date:", item.createdAt);
      timeAgo = "Unknown time";
    }
  }

  const upvoted = item?.upvotes?.includes(myData._id);

  return (
    <div className="flex flex-row items-start space-x-2 w-full mt-2">
      <img
        src={item.user?.logo}
        alt="Curation"
        className=" w-8 h-8 rounded-lg object-cover"
      />
      <div className="flex flex-col  ">
        <div className="flex flex-row items-end">
          <p className="dark:text-secondaryText-dark font-normal text-[11px] font-inter">
            {item.user?.name}
          </p>
          <p className="dark:text-primaryText-dark font-light pl-2 text-[10px] font-inter">
            {timeAgo}
          </p>
        </div>
        <p className="dark:text-secondaryText-dark font-light text-xs mt-0.5">
          <span
            className="dark:text-buttonEnable-dark mr-1 text-xs font-light cursor-pointer"
            onClick={() =>
              window.open(`/profile/${item.repliedToUserId.username}`, "_blank")
            }
          >
            @{item.repliedToUserId.username}
          </span>
          {item.comment}
        </p>
        <div className="flex flex-row items-center pt-2 pb-1">
          <div className="flex flex-row items-center cursor-pointer">
            <img
              src={upvoted ? Upvoted : Upvote}
              alt="Upvote"
              className="mr-1 h-4 w-4"
              onClick={() =>
                toggleUpvoteCommentReply(item.parentCommentId, item._id)
              }
            />
            <p className="text-lightText text-xs font-light">
              {item.upvotes?.length ?? 0}
            </p>
          </div>
          <p
            className="dark:text-primaryText-dark ml-4 text-xs font-normal font-inter cursor-pointer"
            onClick={() => handleChange(comment)}
          >
            Reply
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentChipReplyItem;
