import React from "react";
import useModal from "./../../hooks/ModalHook";

const ChannelsTab = () => {
  const { handleOpenModal } = useModal();

  const channels = [
    { id: 1, name: "Channel1" },
    { id: 2, name: "Channel2" },
  ];

  const handleShareChannel = (name) => {
    handleOpenModal("modalShareChannelOpen", name);
  };
  return channels.map((channel) => (
    <div className="p-3 rounded-lg mt-4 border dark:border-chatDivider-dark justify-start flex flex-row items-start">
      <div className="w-16 h-16 rounded-lg  dark:bg-secondaryText-dark mt-2 flex-shrink-0"></div>
      <div className="flex flex-col ml-3">
        <div className="dark:text-secondaryText-dark text-lg font-medium font-inter ">
          {channel.name}
        </div>
        <p className="dark:text-primaryText-dark text-xs font-normal ">
          Qorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accu risus sem sollicitudin lacus, ut interdum tellus elit
          sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac
          scelerisque ante pulvinar.
        </p>
        <div className="flex flex-row space-x-4">
          <button
            onClick={() => handleShareChannel(channel.name)}
            className="cursor-pointer px-3 mt-4 font-normal  py-2.5 dark:bg-buttonEnable-dark
                         dark:text-secondaryText-dark text-xs rounded-lg"
          >
            Share join link
          </button>
          <button
            className={`px-4 mt-4  py-2.5 border dark:border-secondaryText-dark 
           dark:text-secondaryText-dark font-normal text-xs rounded-lg`}
          >
            Edit Channel
          </button>
        </div>
      </div>
    </div>
  ));
};

export default ChannelsTab;
