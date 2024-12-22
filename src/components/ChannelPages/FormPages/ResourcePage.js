import React, { useState } from "react";
import Close from "../../../assets/icons/Close.svg";
import Search from "../../../assets/icons/search.svg";

const ResourcePage = () => {
  const [selectedTab, setSelectedTab] = useState("Images");
  const [searchQuery, setSearchQuery] = useState("");

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between">
        <div
          className={`rounded-full text-xs border dark:border-chatBackground-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Images"
              ? "dark:bg-secondaryText-dark"
              : "dark:text-chatBackground-dark"
          }`}
          onClick={() => setSelectedTab("Images")}
        >
          Images
        </div>
        <div
          className={`rounded-full text-xs border dark:border-chatBackground-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Documents"
              ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
              : "dark:text-chatBackground-dark"
          }`}
          onClick={() => setSelectedTab("Documents")}
        >
          Documents
        </div>
        <div
          className={`rounded-full text-xs border dark:border-chatBackground-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Links"
              ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
              : "dark:text-chatBackground-dark"
          }`}
          onClick={() => setSelectedTab("Links")}
        >
          Links
        </div>
        <div
          className={`rounded-full text-xs border dark:border-chatBackground-dark px-3.5 py-1.5 cursor-pointer ${
            selectedTab === "Custom"
              ? "dark:bg-secondaryText-dark dark:text-primaryBackground-dark"
              : "dark:text-chatBackground-dark"
          }`}
          onClick={() => setSelectedTab("Custom")}
        >
          Custom Label
        </div>
      </div>
      <div className="mt-3 relative w-full ">
        <img
          src={Search}
          alt="search"
          className="absolute left-3 top-4 text-textFieldColor w-5 h-5"
        />
        {searchQuery && (
          <img
            src={Close}
            alt="Close"
            className="absolute top-4 right-2 cursor-pointer  w-4 h-4"
            onClick={handleClear}
          />
        )}
        <input
          type="text"
          placeholder="Search with file name, sender's name or date"
          className={` pl-9 pr-3 py-3 mb-2 bg-dark dark:bg-tertiaryBackground-dark dark:text-secondaryText-dark 
            placeholder-textFieldColor border-2 dark:border-chatBackground-dark ${"rounded-lg"} text-sm
            placeholder:text-sm placeholder:dark:text-primaryText-dark
            placeholder:text-left focus:outline-none w-full font-inter font-normal flex `}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default ResourcePage;
