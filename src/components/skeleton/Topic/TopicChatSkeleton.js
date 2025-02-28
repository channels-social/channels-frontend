import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopicChatSkeleton = () => {
  return (
    <div className="dark:bg-secondaryBackground-dark w-full h-full flex flex-col justify-start px-2 overflow-y-auto custom-scrollbar">
      <SkeletonTheme
        baseColor="#545357"
        highlightColor="#c4c4c4"
        enableAnimation={false}
      >
        <div className="flex flex-row justify-start w-full">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
        <div className="flex flex-row justify-start w-full mt-5">
          <Skeleton width={50} height={50} borderRadius={50} />
          <div className="flex flex-col ml-2 w-4/5">
            <div className="w-1/5">
              <Skeleton height={10} borderRadius={20} />
            </div>
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
            <Skeleton height={10} borderRadius={20} />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default TopicChatSkeleton;
