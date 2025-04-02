import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../../../assets/icons/copy_icon.png";

const SettingsTab = () => {
  const [copied, setCopied] = useState(false);
  const apiKey = "sk-test-4A9bYtR3bNm...";
  const domain = "sundaygrids.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  return (
    <div className="flex flex-col pl-10 pt-6">
      <p className="dark:text-secondaryText-dark text-lg md:text-xl lg:text-2xl font-normal ">
        Settings
      </p>
      <div className="border-[1px] dark:border-tertiaryBackground-dark my-4 pl-6"></div>
      <div>
        <p className="text-md dark:text-primaryText-dark font-light mt-6 mb-2">
          API Key
        </p>
        <div className="flex flex-row items-center mt-1">
          <input
            type="password"
            value={apiKey}
            readOnly
            className="w-1/2 dark:bg-tertiaryBackground-dark px-4 py-4 rounded-lg text-sm dark:text-secondaryText-dark "
          />
          <div className="relative">
            <img
              src={CopyIcon}
              alt="Copy"
              className="ml-4 cursor-pointer h-6 w-6"
              onClick={handleCopy}
            />
            {copied && (
              <p className="absolute bottom-6 left-2 text-xs dark:text-emptyEvent-dark mt-1">
                Copied
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-md dark:text-primaryText-dark font-light mt-6 mb-2">
        Domain name
      </p>
      <div className="flex flex-row items-center">
        <input
          type="text"
          value={domain}
          readOnly
          className="w-1/2 dark:bg-tertiaryBackground-dark px-4 py-4 rounded-lg text-sm dark:text-secondaryText-dark "
        />
        <p className="ml-3 text-sm mt-1 dark:text-emptyEvent-dark italic ">
          Read only
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
