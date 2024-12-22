import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomeCurationSkeleton = () => {

  const items = ["", "", "", "", "", "", "","","",""];

  return (
    <div className="flex flex-row mt-8 overflow-x-auto no-scrollbar rounded-lg p-3  bg-profileBackground">
    <SkeletonTheme baseColor="#545357" highlightColor="#cac4d0" enableAnimation={false}>
          {items.map((item, index) => (
            <div key={index} className="flex flex-row items-start mr-6 ">
                <Skeleton height={90} width={130}  borderRadius={5}/>
            </div>
            
          ))}
    </SkeletonTheme>
    </div>
  );
};

export default HomeCurationSkeleton;
