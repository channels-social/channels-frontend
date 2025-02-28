import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileSkeleton = () => {
  return (
    <div className="w-[97%]  p-5 bg-profileBackground mt-5 rounded roundex-lg">
      <div className=" p-6 rounded-lg">
        <SkeletonTheme
          baseColor="#545357"
          highlightColor="#c4c4c4"
          enableAnimation={false}
        >
          <div className="flex flex-row justify-between items-center w-full  text-skeletonColor">
            <div className="flex flex-col w-[30%] space-y-0.5">
              <Skeleton circle={true} height={100} width={100} />
              <div className="h-0.5"></div>
              <Skeleton height={20} borderRadius={25} />
              <div className="h-0.5"></div>
              <div className="w-[60%]">
                <Skeleton height={12} borderRadius={25} />
                <Skeleton height={12} borderRadius={25} />
              </div>
              <Skeleton height={12} borderRadius={25} />
              <Skeleton height={12} borderRadius={25} />
              <Skeleton height={12} borderRadius={25} />
              <Skeleton height={12} borderRadius={25} />
              <div className="w-[60%]">
                <Skeleton height={12} borderRadius={25} />
              </div>
              <div className="flex space-x-5">
                <Skeleton circle={true} height={30} width={30} />
                <Skeleton circle={true} height={30} width={30} />
                <Skeleton circle={true} height={30} width={30} />
                <Skeleton circle={true} height={30} width={30} />
                <Skeleton circle={true} height={30} width={30} />
              </div>
            </div>
            <div className="w-1/2 items-end rounded-lg">
              <Skeleton height={360} borderRadius={10} />
            </div>
          </div>
        </SkeletonTheme>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
