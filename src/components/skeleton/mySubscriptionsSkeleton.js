import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MySubscriptionsSkeleton = () => {
  const items = ["", "", "", "", "", "", "", "", "", "", ",", "", ",", ""];

  return (
    <div className="flex flex-row rounded-lg p-3 overflow-x-auto no-scrollbar  bg-profileBackground">
      <SkeletonTheme
        baseColor="#545357"
        highlightColor="#c4c4c4"
        enableAnimation={false}
      >
        {items.map((item, index) => (
          <div key={index} className="flex flex-row items-start mr-6 ">
            <Skeleton circle={true} height={80} width={80} />
          </div>
        ))}
      </SkeletonTheme>
    </div>
  );
};

export default MySubscriptionsSkeleton;
