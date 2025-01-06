import React from "react";
import useModal from "./../../hooks/ModalHook";

import ChipIcon from "../../../assets/icons/chipEmptyIcon.svg";
import CurationIcon from "../../../assets/icons/curationEmptyIcon.svg";
const EmptyItemsCard = () => {
  const { handleOpenModal } = useModal();

  const handleCurationOpenModal = () => {
    handleOpenModal("modalCurationOpen");
  };
  const handleCategoryOpenModal = () => {
    handleOpenModal("modalCategoryReorderOpen");
  };
  const handleChipOpen = () => {
    handleOpenModal("modalChipOpen");
  };

  return (
    <div className="flex md:flex-row flex-col sm:justify-around mt-8 md:space-x-8 md:space-y-0 space-y-6">
      <div className="dark:bg-tertiaryBackground-dark p-4 xs:p-8 w-full md:w-max rounded-lg">
        <div className="flex flex-col space-y-2 items-start">
          <img src={ChipIcon} alt="chip-icon" className="w-10 h-10" />
          <p className="text-white font-normal text-base">
            Convey better with chips
          </p>
          <img
            src="https://chips-social.s3.ap-south-1.amazonaws.com/profileChipCard.png"
            alt="chip-profile"
            className="lg:h-52 md:h-48  h-44 bg-emptyChip rounded-lg w-full object-cover"
          />
          <ul className="list-disc list-inside space-y-1 pt-2 dark:text-secondaryText-dark text-sm font-light font-inter">
            Organise and share links, media, and more within customisable Chips.
            Each Chip serves as a building block for your digital space, making
            it easy to curate and present content in a visually engaging way.
          </ul>
          <div className="pt-2" />
          <button
            className="mt-4 border w-full dark:border-secondaryText-dark py-3 rounded-full dark:text-secondaryText-dark font-normal text-sm font-inter"
            onClick={handleChipOpen}
          >
            Create a Chip
          </button>
        </div>
      </div>
      <div className="dark:bg-tertiaryBackground-dark p-4 xs:p-8 mt-6 sm:mt-0 w-full md:w-max rounded-lg">
        <div className="flex flex-col space-y-2 items-start">
          <img src={CurationIcon} alt="curation-icon" className="w-10 h-10" />
          <p className="text-white font-normal text-base">
            Set context with Curations
          </p>
          <img
            src="https://chips-social.s3.ap-south-1.amazonaws.com/profileCurationCard.png"
            alt="chip-profile"
            className="lg:h-52 md:h-48  h-44 bg-emptyCuration rounded-lg w-full object-cover"
          />
          <ul className="list-disc list-inside space-y-1 pt-2 dark:text-secondaryText-dark text-sm font-light font-inter">
            Curations are collections of Chips that bring together related
            content. Create and organise these collections to showcase your
            interests, projects, or anything that inspires you, all in one
            cohesive place.
          </ul>
          <div className="pt-2" />
          <button
            className="mt-4 border w-full dark:border-secondaryText-dark py-3 rounded-full dark:text-secondaryText-dark font-normal text-sm font-inter"
            onClick={handleCurationOpenModal}
          >
            Build a Curation
          </button>
        </div>
      </div>
      <div className="dark:bg-tertiaryBackground-dark p-4 xs:p-8 mt-6 sm:mt-0 w-full md:w-max rounded-lg">
        <div className="flex flex-col space-y-2 items-start">
          <img src={CurationIcon} alt="curation-icon" className="w-10 h-10" />
          <p className="text-white font-normal text-base">
            Set context with Categories
          </p>
          <img
            src="https://chips-social.s3.ap-south-1.amazonaws.com/profileChannelCard.svg"
            alt="chip-profile"
            className="lg:h-52 md:h-48 h-44 bg-emptyChip rounded-lg w-full object-cover"
          />
          <ul className="list-disc list-inside space-y-1 pt-2 dark:text-secondaryText-dark text-sm font-light font-inter">
            Chips and curations can be organised under different categories.
            This will help your viewers easily navigate through your profile.
            Each category creates an easy to access tab on the top of your page,
            with About being the default.
          </ul>
          <div className="pt-2" />
          <button
            className="mt-4 border w-full dark:border-secondaryText-dark py-3 rounded-full dark:text-secondaryText-dark font-normal text-sm font-inter"
            onClick={handleCategoryOpenModal}
          >
            Start with Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyItemsCard;
