// import {React,useState,useEffect} from 'react';
// import Chips from './../../chips/Chips';
// import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
// import ProfileChips from './ProfileChips';
// import CurationMansonry from './../../curations/CurationMansonry';
// import { useSelector, useDispatch } from 'react-redux';
// import ProfileItemsSkeleton from './../../skeleton/profileItemsSkeleton';
// import { fetchGalleryItems } from './../../../redux/slices/profileItemsSlice';



// const MasonryItem = ({ item, owner }) => {
//     if (item.type === 'curation') {
//       return (
//         <div className="curation-item my-masonry-grid_item">
//           <CurationMansonry curation={item} gallery={owner} />
//         </div>
//       );
//     } else if (item.type === 'chip') {
//       return (
//         <div className="chip-item my-masonry-grid_item">
//          {owner ? <Chips item={item}/> :<ProfileChips item={item} />} 
//         </div>
//       );
//     }
//     return null;
//   };


// const GalleryView = ({owner}) => {
//   const dispatch = useDispatch();

//   const { items, status, error } = useSelector((state) => state.profileItems);
//   const galleryData = useSelector((state) => state.galleryData);

  


//   useEffect(() => {
//     if(galleryData.username){
//         dispatch(fetchGalleryItems(galleryData.username));
//      }
//   }, [dispatch, galleryData.username]);
//     const breakpointColumnsObj = {
//         default: 4,
//         1100: 4,
//         900:3,
//         700: 2,
//         600: 2,
//         450:1,
//       };

//       if (status === 'loading') {
//         return <ProfileItemsSkeleton/>
//       }
    
//       if (status === 'failed') {
//         return <div>Error: {error}</div>;
//       }
    
//   return (
//     <div className="ml-8 w-full">
//         <ResponsiveMasonry
//         columnsCountBreakPoints={breakpointColumnsObj}
//     >
//     <Masonry
//       className="my-masonry-grid"
//       gutter="18px"
//       columnClassName="my-masonry-grid_column"
//     >
//       {items.map(item => (
//         <MasonryItem key={item._id} item={item} gallery={owner} />
//       ))}
//     </Masonry>
//     </ResponsiveMasonry>

      
//     </div>
//   )
// }

// export default GalleryView
