import React from "react";
import useModal from "./../../hooks/ModalHook";

const EmptyChannelCard = () => {
  const { handleOpenModal } = useModal();

  const handleChannelModal = () => {
    handleOpenModal("modalChannelOpen");
  };
  return (
    <div className="dark:bg-chatDivider-dark rounded-lg p-4  w-full flex flex-col xs:flex-row">
      <img
        src="https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/channelEmptyCard.svg"
        alt="empty-channel"
        className="h-40 w-auto xs:mb-0 mb-3"
      />
      <div className="ml-4 flex flex-col justify-between">
        <p className="dark:text-secondaryText-dark font-light text-xs">
          Hellooo 👋
          <br />
          <br />
          It's time to gather your community and bring everyone together.
          Whether it's a space to connect with your users, a hobby group, a
          course group for collaborative learning, or a place for like-minded
          folks to bond over shared interests, you name it! Your community, your
          rules.
          <br />
          <br />
          We understand that it can be really overwhelming to start, so we have
          simplified it all for you. It’ll just take a couple of minutes for you
          to get started.
        </p>
        <div
          className="border rounded-lg w-max xs:mt-2 mt-3 cursor-pointer p-2 text-xs font-normal dark:border-primaryText-dark dark:text-secondaryText-dark"
          onClick={handleChannelModal}
        >
          Create your first Channel
        </div>
      </div>
    </div>
  );
};

export default EmptyChannelCard;
