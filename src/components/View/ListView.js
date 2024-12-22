// import {React, useState, useEffect} from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import Curation from '../../assets/images/curation_image.png';
// import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
// import {hostUrl} from "../../utils/globals"
// import axios from 'axios';
// import { ShimmerTitle } from "react-shimmer-effects";
// import CircularProgress from '@mui/joy/CircularProgress';
// import Chips from './../chips/Chips';
// import Share from "../../assets/icons/share_icon.svg";



// const ListView = () => {

//     const explore = "Explore ->"
//     const [selectedId, setSelectedId] = useState(null);
//     const [selectedIndex, setSelectedIndex] = useState(0);
//     // const [curations,setCurations] = useState([]);
//     const [newError, setNewError] = useState('');
//     const [loading,setLoading] = useState(false);
//     const [chipLoading,setChipLoading] = useState(false);
//     const [isSorting,setisSorting] = useState(false);
//     const [isFiltering,setisFiltering] = useState(false);
//     // const [chips,setChips]= useState([]);
  
//     // const fetchCurations = async () => {
//     //   try {
//     //     setLoading(true);
//     //     await axios.post(`${hostUrl}/api/fetch/saved/curations`).then((response) => {
//     //       if(response.data.success===true){
//     //         const fetchedCurations = response.data.curations;
//     //       setCurations(fetchedCurations);
//     //       if (fetchedCurations.length > 0) {
//     //         setSelectedId(fetchedCurations[0].id);
//     //         fetchChips(fetchedCurations[0].id);
//     //       }
//     //       }
//     //       else{
//     //         setNewError(response.data.message);
//     //       }
//     //     });
//     //   } catch (error) {
//     //     console.error('Error getting curations', error);
//     //     setNewError("Error getting curations. Please try again.");
//     //   }
//     //   finally{
//     //     setLoading(false);
//     //   }
//     // };
//     // const fetchChips = async (id) => {
//     //   try {
//     //     setChipLoading(true);
//     //     await axios.post(`${hostUrl}/api/fetch/all/chips/of/curation`,id).then((response) => {
//     //       if(response.data.success===true){
//     //         setChips(response.data.chips);
//     //       }
//     //       else{
//     //         setNewError(response.data.message);
//     //       }
//     //     });
//     //   } catch (error) {
//     //     console.error('Error getting chips', error);
//     //     setNewError("Error getting chips. Please try again.");
//     //   }
//     //   finally{
//     //     setChipLoading(false);
//     //   }
//     // };
  
//     // useEffect(() => {
//     //   fetchCurations();
//     // }, []); 
  
//     const curations = [
//         {id:"a", name: 'Margot Robbed in he with bangalore', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg',username:"Yashu Agrawal" },
//         {id:"b", name: 'Margot Robbed', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg',username:"Yashu Agrawal"  },
//         {id:"c", name: 'Margot Robbed', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg',username:"Yashu Agrawal"  },
//         {id:"d", name: 'Margot Robbed', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg',username:"Yashu Agrawal"  },
//         {id:"e" ,name: 'Margot Robbed', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg',username:"Yashu Agrawal"  },
//         {id:"f", name: 'Dylan Garden', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg' ,username:"Yashu Agrawal" },
//         {id:"g" ,name: 'Dylan Garden', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg' ,username:"Yashu Agrawal" },
//         {id:"h", name: 'Dylan Garden', image: 'https://t3.ftcdn.net/jpg/06/35/25/68/360_F_635256827_KKLD6dXXWuHyGvRE8uic9QmVqpURX4H2.jpg' ,username:"Yashu Agrawal" },
//       ];
//       const chips =[
//         {
//           "_id": "6650101762ac56e3fb0bb941",
//           "user": {
//               "_id": "664f6bd762ac56e3fb0baf13",
//               "name": "Frodo",
//               "email": "meenakshi@chips.social",
//               "username": "frodo",
//               "logo": "https://chips-social.s3.ap-south-1.amazonaws.com/chips/image_26ddf392-51e6-49fc-8320-5f523cd1eb91_0.jpg"
//           },
//           "curation": "664f793a62ac56e3fb0bb065",
//           "category": "Get started",
//           "text": "With Chips, Create a digital space for your community.\n\nWe integrate the features of a website, providing you with a custom web address, ability to organise information in the form of curations, while also facilitating audience engagement and broadcast of your content with newsletters.\n\nNo more dependency on developers and designers. It's as easy as using socials. Build your space now.\nWe promise, it'll take less than a minute.\n\nClick on the link below for a quick tour of the platform 👇",
//           "is_datetime": false,
//           "date": "",
//           "file":"abcd",
//           "type":"chip",
//           "location_url": "",
//           "location_desc": "",
//           "image_urls": [],
//           "link_url": "https://chips.social/category/Get%20started/curation/Quick%20tour/id/664f77e562ac56e3fb0bb04a",
//           "likes": [
//               "664a31d762ac56e3fb0bada9"
//           ],
//           "saved_by": [],
//           "shared_by": [],
//           "timeAdded": "2024-05-24T03:57:11.970Z",
//           "__v": 1
//       },
//       {
//           "_id": "66500eb662ac56e3fb0bb8ec",
//           "user": {
//               "_id": "664f6bd762ac56e3fb0baf13",
//               "name": "Frodo",
//               "email": "meenakshi@chips.social",
//               "username": "frodo",
//               "logo": "https://chips-social.s3.ap-south-1.amazonaws.com/chips/image_26ddf392-51e6-49fc-8320-5f523cd1eb91_0.jpg"
//           },
//           "curation": "664f77e562ac56e3fb0bb04a",
//           "category": "Get started",
//           "text": "First things first, Setup your Profile.\n\nModifying user name would create your sub domain (web address). It could be your organisation/ community/ personal name. Example:\norgname.chips.social\n\nIt functions as a complete website if you make the most of it. You can add your picture, any link and a description that'll help people understand your webpage and subscribe to it.\n\nAt any point if you need help, feel free to reach out to us on the platform of your choice. Find the link below.",
//           "is_datetime": false,
//           "date": "",
//           "type":"chip",
//           "meta":"yes",
//           "location_url": "",
//           "location_desc": "",
//           "image_urls": [],
//           "link_url": "https://chips.social/category/Get%20started/curation/Contact%20us/id/664f6e4a62ac56e3fb0baf2f",
//           "likes": [
//               "664a31d762ac56e3fb0bada9"
//           ],
//           "saved_by": [],
//           "shared_by": [],
//           "timeAdded": "2024-05-24T03:51:18.889Z",
//           "__v": 1
//       },

  
//     {
//       "_id": "6650101762scscsskb0bb941",
//       "user": {
//           "_id": "664f6bd762ac56e3fb0baf13",
//           "name": "Yashu",
//           "email": "meenakshi@chips.social",
//           "username": "frodo",
//           "logo": "https://chips-social.s3.ap-south-1.amazonaws.com/chips/image_26ddf392-51e6-49fc-8320-5f523cd1eb91_0.jpg"
//       },
//       "curation": "664f793a62ac56e3fb0bb065",
//       "category": "Get started",
//       "text": "With Chips, Crea providing you wimentsocite.\n\nClick form 👇",
//       "is_datetime": false,
//       "date": "",
//       "file":"",
//       "type":"chip",
//       "location_url": "",
//       "location_desc": "",
//       "image_urls": [],
//       "link_url": "https://chips.social/category/Get%20started/curation/Quick%20tour/id/664f77e562ac56e3fb0bb04a",
//       "likes": [
//           "664a31d762ac56e3fb0bada9"
//       ],
//       "saved_by": [],
//       "shared_by": [],
//       "timeAdded": "2024-05-24T03:57:11.970Z",
//       "__v": 1
//     },
//       ]
  
  
//     const handleItemClick = (id,index) => {
//       setSelectedId(id);
//     //   fetchChips(id);
//       setSelectedIndex(index);
//     };
  
//     const toggleSortPanel = () => {
//       setisSorting(!isSorting);
//     };
//     const toggleFilterPanel = () => {
//       setisSorting(!isSorting);
//     };
  
//     return (
//       loading?<CircularProgress
//       color="neutral"
//       determinate={false}
//       size="lg"
//       variant="solid"
//     />:
//       curations.length>0 ? (
//         <div className="flex flex-row w-full h-full rounded-lg -ml-5 ">
//         <div className="flex flex-col w-76 lg:w-72 md:w-60 rounded-lg">
//           <div className="flex flex-row items-center pl-3 pr-3 pt-2">
//             <div className="relative flex-1">
//               <FontAwesomeIcon icon={faSearch} className="absolute top-1/2 mb-2 pl-1 transform -translate-y-1/2 text-textFieldColor w-3 h-3" />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-5 pr-3 py-3 rounded-lg text-white bg-primaryBackground focus:outline-none w-full font-inter font-normal text-sm flex items-center placeholder:text-textFieldColor placeholder:text-xs"
//                 />
//             </div>
//             <button className=" px-4 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Sort</button>
//             <button className="ml-1 px-3 py-2 rounded-lg  text-lightText text-xs" onClick={toggleFilterPanel}>Filter</button>
//           </div>
//        { isSorting?<div></div>: <div className="overflow-y-auto max-h-[calc(100vh-162px)] custom-scrollbar ">
//           {loading?<ShimmerTitle line={2} gap={10} variant="primary" />:curations.map((item,index) => (
//                 <div
//                   key={item.id}
//                   className={`flex flex-col justify-start rounded-lg ml-1 pl-2.5 pr-2 cursor-pointer ${selectedId === item.id ?' bg-chipBackground border border-borderColor':' bg-primaryBackground'}`}
//                   onClick={() => handleItemClick(item.id,index)}>
//                     <div className="flex items-start rounded-lg pt-2.5 pb-2.5">
//                       <img src={Curation} alt="Curation" className="w-18 md:w-14 md:h-11 h-14 rounded-lg mr-1.5" />
//                       <div className="flex flex-col">
//                         <span className=" w-48 text-textColor font-normal text-sm md:text-xs truncate">{item.name}</span>
//                         <span className="mt-2 text-lightText text-xs">{item.username}</span>
//                       </div>
//                     </div>
//                   <div className={`w-64  ${selectedId === item.id || selectedIndex-1===index ?' ':' border border-borderColor'} `} style={{height:'0.1px'}}></div>
//                 </div>
//               ))}
//           </div>}
//         </div>
//         <div className="border ml-3  mr-4 border-borderColor" style={{ width: "0.1px" }} ></div>
//           <div className="flex-1  pt-4  mr-5">
//             <div className="flex flex-col mb-1">
//               <div className="flex flex-row items-center">
//                 <p className="text-lg text-white font-normal  font-inter">{"Setup your podcast"}</p>
//                 <img src={Share} alt="share" className="w-7 h-7 text-primary ml-3" />
//               </div>
//               <p className="text-textColor text-xs mt-2 mb-1 font-normal font-inter">We are a non-profit organisation committed to rescuing animals in
//                 need and advocating for their rights. Through rescue operations, education, and community outreach, we strive to give a voice
//                 to those who cannot speak for themselves.</p>
//               <div className="flex flex-row justify-between items-center">
//                 <p className="text-center text-primary text-xs font-normal font-inter underline custom-underline-offset">{"Yashu Agrawal"}</p>
//                 <div>
//                   <button className=" px-4 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Sort</button>
//                   <button className="ml-2 mr-2 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Filter</button>
//                 </div>
//               </div>
//             </div>
//           <ResponsiveMasonry columnsCountBreakPoints={{ 400: 1, 800: 2, 1060: 3 }}>
//               <Masonry gutter="20px">
//                 {chipLoading?<CircularProgress
//                   color="neutral"
//                   determinate={false}
//                   size="lg"
//                   variant="solid"
//                 />:chips.map((item, index) => (
//                   <Chips item={item}/>
//                 ))
//                 }
//               </Masonry>
//             </ResponsiveMasonry>
//         </div>
//       </div>
//       ):(
//         <div className="flex items-center h-full ">
//         <div className="container rounded-md bg-dark pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36" style={{ marginRight: 'auto'}}>
//           <h3 className=" text-textColor text-sm">❤ Sorry no content available!</h3>
//           <div className="mt-2 rounded-md bg-chipBackground pl-6 pt-4 pb-4">
//             <h3 className=" text-textColor">{explore}</h3>
//           </div>
  
//         </div>
//       </div>
//       )
      
//     )
//   }

// export default ListView
