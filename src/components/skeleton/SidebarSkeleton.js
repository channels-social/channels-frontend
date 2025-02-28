import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SidebarSkeleton = () => {
  return (
    <div className="flex flex-col justify-between h-screen w-full py-3 px-4">
      <SkeletonTheme
        baseColor="#545357"
        highlightColor="#c4c4c4"
        enableAnimation={false}
      >
        <div className="flex flex-col justify-start space-y-3">
          <Skeleton width={50} height={50} borderRadius={5} />
          <Skeleton height={18} borderRadius={20} />
          <Skeleton height={20} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
        </div>

        <div className="flex flex-col justify-start space-y-3">
          <Skeleton height={12} borderRadius={20} />
          <Skeleton height={12} borderRadius={20} />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default SidebarSkeleton;
