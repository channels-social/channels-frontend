import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ResponsiveMasonry } from 'react-responsive-masonry';
import Masonry from 'react-responsive-masonry';

const ProfileItemsSkeleton = () => {

  const items = [120, 320, 120, 350, 350, 120, 380, 130];

  return (
    <SkeletonTheme baseColor="#28262b" highlightColor="#cac4d0" enableAnimation={false}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 400: 2, 800: 3, 1060: 4 }}>
        <Masonry gutter="18px">
          {items.map((item, index) => (
            <Skeleton key={index} height={item} borderRadius={5} />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </SkeletonTheme>
  );
};

export default ProfileItemsSkeleton;
