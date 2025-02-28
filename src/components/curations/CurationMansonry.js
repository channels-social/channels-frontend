import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setCurationEngagement } from "./../../redux/slices/curationEngagementSlice";
import { useDispatch } from "react-redux";

const CurationMansonry = ({ curation, owner, gallery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleChipsPage = () => {
    console.log(gallery);
    dispatch(setCurationEngagement(curation._id));
    if (gallery) {
      navigate(`/curation/${curation._id}`, { state: { owner } });
    } else {
      const username = location.pathname.split("/")[2];
      navigate(`/user/${username}/curation/${curation._id}`, {
        state: { owner },
      });
    }
  };

  return (
    <div className="flex flex-col items-start flex-shrink-0  cursor-pointer max-h-56 overflow-hidden rounded-lg w-full">
      <div className="relative w-full h-44" onClick={handleChipsPage}>
        <img
          className="rounded-xl object-cover w-full h-full"
          src={curation.image}
          alt={curation.name}
        />
        <div
          className="absolute top-1 right-1 rounded-full px-2 py-0.5 items-center text-xs text-white dark:bg-tertiaryBackground-dark bg-opacity-70  border-viewAll border"
          style={{ borderWidth: "0.5px" }}
        >
          {curation.chips_count} chips
        </div>
      </div>
      <p
        className="text-white text-sm sm:text-base mt-0.5 w-full font-inter font-normal text-left overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: "1.4rem",
        }}
      >
        {curation.name}
      </p>
    </div>
  );
};

export default CurationMansonry;
