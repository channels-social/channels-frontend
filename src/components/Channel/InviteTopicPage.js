import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { joinTopicInvite } from "../../redux/slices/topicSlice.js";

const InviteTopicPage = ({ code, topicId, username, channelId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [error, setError] = useState("Redirecting to the topic page...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      if (isLoggedIn) {
        const formDataToSend = new FormData();
        formDataToSend.append("topicId", topicId);
        formDataToSend.append("code", code);
        dispatch(joinTopicInvite(formDataToSend))
          .unwrap()
          .then(() => {
            setLoading(false);
            navigate(
              `/user/${username}/channel/${channelId}/c-id/topic/${topicId}`,
              { replace: true }
            );
          })
          .catch((error) => {
            setLoading(false);
            setError("Invalid Code or Topic. Redirecting back to channel....");
            setTimeout(() => {
              navigate(`/user/${username}/channel/${channelId}`);
            }, 1000);
          });
      } else {
        navigate(
          `/get-started?redirect=//user/${username}channel/${channelId}/c-id/topic/${topicId}?code=${code}`
        );
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, isLoggedIn, channelId, code, navigate, username, topicId]);

  return (
    <div
      className="dark:bg-secondaryBackground-dark 
    w-full h-full flex flex-col justify-center items-center"
    >
      <div className="border dark:border-chatDivider-dark dark:bg-tertiaryBackground-dark rounded-md px-8 py-8 flex flex-col">
        <p className="dark:text-secondaryText-dark font-normal text-md ">
          {error}
        </p>

        <div className="mt-10">
          <div className="flex justify-center">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 dark:border-primaryText-dark"></div>
            )}
          </div>
        </div>
        <p className="dark:text-secondaryText-dark font-normal text-sm mt-4 text-center">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default InviteTopicPage;
