import React, { forwardRef } from "react";
import Logo from "../../assets/icons/channels_logo.svg";
import useModal from "./../hooks/ModalHook";
import { useNavigate } from "react-router-dom";
import { domainUrl } from "./../../utils/globals";

const Footer = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const { handleOpenModal } = useModal();

  const handleTermsOpen = () => {
    handleOpenModal("modalTermsOpen");
  };
  const handlePrivacyOpen = () => {
    handleOpenModal("modalPrivacyOpen");
  };

  const handleNavigateHome = () => {
    const hostnameParts = window.location.hostname.split(".");
    const isSubdomain = hostnameParts.length > 2 && hostnameParts[0] !== "www";
    if (isSubdomain) {
      window.open(`https://${domainUrl}`, "_blank");
    } else {
      navigate("/");
    }
  };
  return (
    <footer
      ref={ref}
      className="dark:bg-footerBackground-dark w-full text-white h-40 text-center flex"
    >
      <div className="flex flex-col px-2 xs:px-4 sm:px-6 lg:px-12 md:px-12  w-full justify-center">
        <div className="flex flex-row justify-between items-start">
          <img
            src={Logo}
            alt="Logo"
            className="w-auto xs:h-[27px] h-[22px]"
            onClick={handleNavigateHome}
          ></img>
          <div className="flex flex-col items-end">
            <p className="font-inter ml-2 font-light text-xs dark:text-primaryText-dark">
              Follow us @chips.social
            </p>
            <div className="flex flex-row space-x-5 mt-3">
              <a
                href="https://www.instagram.com/chips.social/"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-primaryText-dark text-xs font-normal font-inter leading-tight"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com/chips.social/"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-primaryText-dark text-xs font-normal font-inter leading-tight"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/chips2connect/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-primaryText-dark text-xs font-normal font-inter leading-tight"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between mt-8 items-center">
          <div className="flex flex-row">
            <p
              className="dark:text-primaryText-dark  text-[10px]  md:text-xs font-normal font-inter leading-tight cursor-pointer"
              onClick={handleTermsOpen}
            >
              Terms of Service
            </p>
            <p
              className="dark:text-primaryText-dark text-[10px]  md:text-xs font-normal ml-4 font-inter leading-tight cursor-pointer"
              onClick={handlePrivacyOpen}
            >
              Privacy Policy
            </p>
          </div>
          <p className="dark:text-primaryText-dark text-[10px]  md:text-xs font-normal font-inter leading-tight">
            &copy; 2023 Chips2Connect Private Limited. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
