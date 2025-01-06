import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import {
  FaFacebookF,
  FaTwitter,
  FaTelegramPlane,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import LinkIcon from "../../../assets/icons/link.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { setChannelField } from "../../../redux/slices/channelSlice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { domainUrl } from "./../../../utils/globals";

const ChannelShareModal = () => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const code = useSelector((state) => state.channel.code);
  const handleClose = () => {
    dispatch(closeModal("modalShareChannelOpen"));
    setChannelField({ field: "code", value: "" });
  };
  const isOpen = useSelector((state) => state.modals.modalShareChannelOpen);
  const channelId = useSelector((state) => state.modals.channelId);
  const username = useSelector((state) => state.myData.username);
  let shareUrl;
  if (code) {
    shareUrl = `https://${domainUrl}/user/${username}/channel/${channelId}?code=${code}`;
  } else {
    shareUrl = `https://${domainUrl}/user/${username}/channel/${channelId}`;
  }

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSharing = () => {
    // dispatch(shareChips(chipId));
  };

  const socialMediaLinks = [
    {
      icon: <FaFacebookF className="text-primary w-6 h-6" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      icon: <FaTwitter className="text-primary w-6 h-6" />,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}`,
    },
    {
      icon: <FaTelegramPlane className="text-primary w-6 h-6" />,
      url: `https://t.me/share/url?url=${shareUrl}`,
    },
    {
      icon: <FaLinkedin className="text-primary w-6 h-6" />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`,
    },
    {
      icon: <FaWhatsapp className="text-primary w-6 h-6" />,
      url: `https://api.whatsapp.com/send?text=${shareUrl}`,
    },
  ];

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Dialog.Content
            className="dark:bg-tertiaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all w-[90%] lg:w-1/3 sm:w-1/2 pt-5 pl-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />

            <div className="flex justify-between items-center mb-4 pr-3">
              <h2 className="dark:text-secondaryText-dark text-lg font-normal font-inter">
                Spread the Magic
              </h2>
              <img
                src={Close}
                alt="Close"
                className="w-4 h-4 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <p className="dark:text-secondaryText-dark text-md mt-2 font-light font-inter">
              Share this profile via
            </p>
            <div className="flex justify-start items-center  mt-4 flex-wrap">
              {socialMediaLinks.map((social, index) => (
                <a
                  key={index}
                  onClick={handleSharing}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dark:bg-primaryBackground-dark mx-4 mb-4 p-2 xs:p-5 rounded-full dark:text-secondaryText-dark"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="dark:text-primaryText-dark text-sm mt-2 text-center font-light font-inter">
              Or
            </p>
            <div className="flex relative items-center mt-2 bg-darkBackground rounded-md pr-4 pb-3 w-full">
              <textarea
                readOnly
                value={shareUrl}
                rows="2"
                style={{ outline: "none", outlineOffset: "0" }}
                className="dark:bg-transparent pl-10 xs:pl-12 pr-14 xs:pr-20  border rounded-lg font-light dark:border-chatDivider-dark
                 dark:text-secondaryText-dark flex-grow text-xs xs:text-sm py-4 overflow-hidden resize-none"
              />
              <img
                src={LinkIcon}
                alt="link"
                className="absolute left-2 xs:left-4 "
              />
              <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
                <button className="absolute right-6 dark:text-white font-normal px-2 text-xs xs:text-sm py-1 dark:bg-buttonEnable-dark rounded-md">
                  {copied ? "Copied" : "Copy"}
                </button>
              </CopyToClipboard>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChannelShareModal;
