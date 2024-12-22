// import React, { useState } from "react";

// const CustomDropdown = ({ options, selectedValue, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleSelect = (value) => {
//     onChange(value);
//     setIsOpen(false);
//   };

//   return (
//     <div className="relative inline-block text-left w-full">
//       {/* Selected Value */}
//       <div
//         className="px-3 py-2 border rounded-md dark:bg-tertiaryBackground-dark dark:text-secondaryText-dark dark:border-gray-600 hover:border-primary cursor-pointer"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {options.find((opt) => opt.value === selectedValue)?.label || "Select"}
//       </div>

//       {/* Dropdown Options */}
//       {isOpen && (
//         <div className="absolute z-10 mt-2 w-full bg-gray-100 dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg">
//           {options.map((option, index) => (
//             <button
//               key={index}
//               onClick={() => handleSelect(option.value)}
//               className={`block w-full px-3 py-2 text-left text-sm rounded-md ${
//                 selectedValue === option.value
//                   ? "bg-primary text-white"
//                   : "hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-secondaryText-dark"
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomDropdown;
