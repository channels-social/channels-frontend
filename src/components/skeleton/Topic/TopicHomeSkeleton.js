import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopicHomeSkeleton = () => {
  return (
    <div className="dark:bg-secondaryBackground-dark w-full h-full flex flex-col px-4 py-3 justify-between">
      <SkeletonTheme
        baseColor="#545357"
        highlightColor="#c4c4c4"
        enableAnimation={false}
      >
        <div>
          <Skeleton height={60} borderRadius={8} />
        </div>
        <div>
          <Skeleton height={40} borderRadius={25} />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default TopicHomeSkeleton;
