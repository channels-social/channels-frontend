// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faTrendingUp, faClock, faFire, faStar } from '@fortawesome/free-solid-svg-icons';
// import trending from '../../../assets/icons/hand_heart.svg';
// import recent from '../../../assets/icons/sort_by_time.svg';
// import popular from '../../../assets/icons/list_heart_minimalistic.svg';
// import hot from '../../../assets/icons/list_up_minimalistic.svg';
// import tick from '../../../assets/icons/tick.svg';

// const SortPanel = ({ isOpen, onClose }) => {
//   const [selectedSort, setSelectedSort] = useState('');

//   const sortOptions = [
//     { name: 'Trending Today', icon: trending },
//     { name: 'Recent', icon:recent },
//     { name: 'Popular', icon: popular },
//     { name: 'Hot', icon: hot },
//   ];

//   const handleSortChange = (sortOption) => {
//     setSelectedSort(sortOption.name);
//   };

//   return (
//     <div className={`fixed inset-y-0 left-0 bg-gray-800 text-white w-64 p-4 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//       <h2 className="text-lg font-bold mb-4">Sort By</h2>
//       <ul>
//         {sortOptions.map((option) => (
//           <li
//             key={option.name}
//             className={`mb-2 cursor-pointer flex items-center justify-between p-2 rounded ${selectedSort === option.name ? 'bg-gray-700' : ''}`}
//             onClick={() => handleSortChange(option)}
//           >
//             <div className="flex items-center">
//               <img src={option.icon} className="mr-2" />
//               {option.name}
//             </div>
//             {selectedSort === option.name && <img src={tick} />}
//           </li>
//         ))}
//       </ul>
//       <button className="mt-4 bg-red-600 px-4 py-2 rounded" onClick={onClose}>Close</button>
//     </div>
//   );
// };

// export default SortPanel;
