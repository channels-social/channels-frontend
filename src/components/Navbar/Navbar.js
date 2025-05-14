// import Logo from "../../assets/images/chips_logo.svg";
// import Close from "../../assets/icons/Close.svg";
// import CreateIcon from "../../assets/icons/create_icon.svg";
// import { React, useState, useRef, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   fetchCurationSearch,
//   fetchProfileSearch,
// } from "./../../redux/slices/searchSlice";
// import { domainUrl } from "./../../utils/globals";
// import { setCurationSearched } from "./../../redux/slices/curationEngagementSlice";
// import { setProfileSearched } from "./../../redux/slices/profileEngagementSlice";
// import { setLoginMode } from "./../../redux/slices/modalSlice";
// import { toggleSidebar } from "./../../redux/slices/uiSlice";
// import ChipIcon from "../../assets/icons/chip_icon.svg";
// import CurationIcon from "../../assets/icons/curation_icon.svg";
// import useModal from "./../hooks/ModalHook";

// const NavBar = ({ onLoginClick }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("Curations");
//   const { curations, profiles, status } = useSelector(
//     (state) => state.searchItems
//   );
//   const { handleOpenModal } = useModal();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const isLogin = useSelector((state) => state.auth.isLoggedIn);
//   const myData = useSelector((state) => state.myData);

//   const location = useLocation();

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//     if (activeTab === "Curations") {
//       dispatch(fetchCurationSearch(searchQuery));
//     } else {
//       dispatch(fetchProfileSearch(searchQuery));
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleCurationOpenModal = () => {
//     setIsDropdownOpen(false);
//     handleOpenModal("modalCurationOpen");
//   };
//   const handleLoginOpenModal = () => {
//     dispatch(setLoginMode(true));
//     handleOpenModal("modalLoginOpen");
//   };

//   const handleChipOpen = () => {
//     setIsDropdownOpen(false);
//     handleOpenModal("modalChipOpen");
//   };

//   const handleFocus = () => {
//     if (!searchQuery) {
//       setIsFocused(false);
//     }
//   };
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (searchQuery) {
//       if (tab === "Curations") {
//         dispatch(fetchCurationSearch(searchQuery));
//       } else if (tab === "People") {
//         dispatch(fetchProfileSearch(searchQuery));
//       }
//     }
//   };

//   const handleClear = () => {
//     setSearchQuery("");
//   };

//   const handleCurationClick = (id) => {
//     navigate(`/curation/${id}`);
//     handleClear();
//     dispatch(setCurationSearched(id));
//   };
//   const handleProfileClick = (username, id) => {
//     // navigate(`${username}.${domainUrl}`)
//     const newUrl = `https://${username}.${domainUrl}`;
//     window.open(newUrl, "_blank");
//     handleClear();
//     dispatch(setProfileSearched(id));
//   };

//   const handleMenuClick = () => {
//     dispatch(toggleSidebar());
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleNavigateHome = () => {
//     const hostnameParts = window.location.hostname.split(".");
//     const isSubdomain = hostnameParts.length > 2 && hostnameParts[0] !== "www";
//     if (isSubdomain) {
//       window.open(`https://${domainUrl}`, "_blank");
//     } else {
//       navigate("/");
//     }
//   };
//   const handleNewsletterPage = () => {
//     navigate(`/${myData?.username}/newsletter`);
//   };

//   return (
//     <nav className="bg-primaryBackground text-white   flex sticky top-0 left-0 items-center z-50 justify-between w-full">
//       <>
//         <p
//           onClick={handleMenuClick}
//           className="xs:hidden  flex items-center cursor-pointer pt-4 pb-2"
//         >
//           <FontAwesomeIcon icon={faBars} className="h-7 pl-3 text-white" />
//         </p>
//       </>
//       {/* <div className="flex-1 flex justify-center items-center"> */}
//       {/* <div className="relative w-5/6 md:w-4/6 lg:w-2/5 sm:w-4/6">
//           <FontAwesomeIcon
//             icon={faSearch}
//             className="absolute top-1/2 transform -translate-y-1/2 text-textFieldColor w-4 h-4"
//             style={{ left: isFocused ? "0.75rem" : "calc(50% - 2rem)" }}
//           />
//           {searchQuery && (
//             <img
//               src={Close}
//               alt="Close"
//               className="absolute top-1/2 right-2 cursor-pointer transform -translate-y-1/2 w-5 h-5"
//               onClick={handleClear}
//             />
//           )}

//           <input
//             type="text"
//             placeholder={isFocused ? "" : "Search"}
//             className={`pl-10 pr-3 py-3  bg text-white placeholder-textFieldColor ${
//               searchQuery ? "rounded-t-lg" : "rounded-lg"
//             }
//                         placeholder:text-center focus:outline-none w-full font-inter font-normal flex items-center`}
//             style={{ fontSize: "15px" }}
//             onFocus={() => setIsFocused(true)}
//             onBlur={handleFocus}
//             value={searchQuery}
//             onChange={handleInputChange}
//           />
//           {searchQuery && (
//             <div
//               className={`absolute w-full bg rounded-b-lg shadow-md shadow-black z-10 -mt-[1px]`}
//             >
//               <div className="flex flex-col items-start">
//                 <div className="flex w-full pt-1.5 border-b border-borderColor ">
//                   <button
//                     className={`relative pb-2 flex-grow text-center sm:text-sm text-xs ${
//                       activeTab === "Curations"
//                         ? "text-profileText"
//                         : "text-textFieldColor"
//                     }`}
//                     onClick={() => handleTabChange("Curations")}
//                   >
//                     Curations
//                     {activeTab === "Curations" && (
//                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 sm:w-1/2 h-0.5 bg-primary"></div>
//                     )}
//                   </button>
//                   <button
//                     className={`relative pb-2 flex-grow text-center sm:text-sm text-xs ${
//                       activeTab === "People"
//                         ? "text-profileText"
//                         : "text-textFieldColor"
//                     }`}
//                     onClick={() => handleTabChange("People")}
//                   >
//                     People
//                     {activeTab === "People" && (
//                       <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 sm:w-1/2 h-0.5 bg-primary"></div>
//                     )}
//                   </button>
//                 </div>
//               </div>
//               <div className="h-64 flex flex-col overflow-y-auto custom-scrollbar">
//                 {status === "loading" ? (
//                   <div className="my-auto mx-auto">
//                     <h1 className="">Loading...</h1>
//                   </div>
//                 ) : activeTab === "Curations" ? (
//                   curations.length === 0 ? (
//                     <div className="my-auto mx-auto">
//                       {" "}
//                       <h1>No Curations found.</h1>
//                     </div>
//                   ) : (
//                     curations.map((item, index) => (
//                       <div
//                         key={item._id}
//                         className={`flex flex-col justify-start rounded-lg ml-1 pl-2.5 pr-2 cursor-pointer `}
//                         onClick={() => handleCurationClick(item._id)}
//                       >
//                         <div className="flex items-center rounded-lg pt-2.5 pb-2.5 w-full">
//                           <img
//                             src={item.image}
//                             alt="Curation"
//                             className="xs:w-12 w-[40px] h-10 object-cover rounded-lg mr-1.5 flex-shrink-0"
//                           />
//                           <div className="flex flex-col w-3/4 ml-2">
//                             <span className=" w-full text-white font-normal text-xs sm:text-sm truncate">
//                               {item.name}
//                             </span>
//                             <div className="flex flex-row mt-2">
//                               <span className=" text-lightText text-[10px] xs:text-xs">
//                                 {item.user?.name}
//                               </span>
//                               <span className="ml-4 text-lightText text-[10px] xs:text-xs">
//                                 {item.chips_count} Chips
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div
//                           className={`w-full  border border-borderColor`}
//                           style={{ height: "1px" }}
//                         ></div>
//                       </div>
//                     ))
//                   )
//                 ) : profiles.length === 0 ? (
//                   <div className="my-auto mx-auto">
//                     {" "}
//                     <h1>No Profiles found.</h1>
//                   </div>
//                 ) : (
//                   profiles.map((item, index) => (
//                     <div
//                       key={item._id}
//                       className={`flex flex-col justify-start rounded-lg ml-1 pl-2.5 pr-2 cursor-pointer `}
//                       onClick={() =>
//                         handleProfileClick(item.username, item._id)
//                       }
//                     >
//                       <div className="flex items-center rounded-lg pt-2.5 pb-2.5 w-full">
//                         {item.logo ? (
//                           <img
//                             src={item.logo}
//                             alt="Curation"
//                             className="xs:w-12 xs:h-12 w-[40px] h-10 object-cover rounded-lg mr-1.5 flex-shrink-0"
//                           />
//                         ) : (
//                           <div className="w-12 h-12 bg-yellow-200 rounded-lg mr-1.5 flex-shrink-0" />
//                         )}
//                         <div className="flex flex-col w-3/4 ml-2">
//                           <span className=" w-full text-white font-normal text-xs sm:text-sm  truncate">
//                             {item.name}
//                           </span>
//                           <span className="mt-2 text-lightText text-[10px] xs:text-xs">
//                             {item.username}
//                           </span>
//                         </div>
//                       </div>
//                       <div
//                         className={`w-full  border border-borderColor`}
//                         style={{ height: "1px" }}
//                       ></div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div> */}
//       {/* <a className="mr-4" href="https://www.producthunt.com/posts/chips-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chips&#0045;2" target="_blank" rel="noreferrer">
//           <img className="sm:flex hidden h-11" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=488203&theme=light" alt="Chips - Curate&#0032;what&#0032;matters | Product Hunt"  />
//         </a> */}
//       {/* {!isLogin && (
//         <p
//           className="flex px-2 xs:px-4  mr-1 xs:mr-4 mb-1 py-2 xs:py-2 rounded-lg text-xs md:text-sm bg-primary text-buttonText cursor-pointer"
//           onClick={handleLoginOpenModal}
//         >
//           Login
//         </p>
//       )} */}
//       {isLogin && location.pathname === `/profile/${myData?.username}` && (
//         <p
//           className="xs:hidden flex px-2 mt-2 py-2.5 w-max text-center mr-3 rounded-lg text-xs  bg-primary text-buttonText cursor-pointer"
//           onClick={handleNewsletterPage}
//         >
//           Send newsletter
//         </p>
//       )}
//       {/* {isLogin && location.pathname !== `/profile/${myData?.username}` && (
//         <img
//           src={CreateIcon}
//           alt="create"
//           className="mr-1 flex w-14 h-14 rounded-md cursor-pointer"
//           onClick={toggleDropdown}
//         />
//       )} */}
//       {/* {isDropdownOpen && (
//         <div
//           ref={dropdownRef}
//           className="absolute right-0 mt-32 mr-3 w-28 rounded-md shadow-lg border border-dividerLine bg-chipBackground ring-1 ring-black ring-opacity-5 z-50"
//         >
//           <div
//             className="py-1"
//             role="menu"
//             aria-orientation="vertical"
//             aria-labelledby="options-menu"
//           >
//             <div
//               className="flex flex-row px-3 items-center"
//               onClick={handleChipOpen}
//             >
//               <img src={ChipIcon} alt="edit" className="w-4 h-4" />
//               <p
//                 className="block px-2 py-2 text-sm text-textFieldColor cursor-pointer"
//                 role="menuitem"
//               >
//                 Chip
//               </p>
//             </div>
//             <div
//               className="flex flex-row px-3 items-center"
//               onClick={handleCurationOpenModal}
//             >
//               <img src={CurationIcon} alt="edit" className="w-4 h-4" />
//               <p
//                 className="block px-2 py-2 text-sm  text-textFieldColor cursor-pointer"
//                 role="menuitem"
//               >
//                 Curation
//               </p>
//             </div>
//           </div>
//         </div>
//       )} */}
//     </nav>
//   );
// };
// export default NavBar;
