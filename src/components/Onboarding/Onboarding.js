import React, { useState } from "react";
import Onboard from "../../assets/channel_images/Onboard.svg";
import CLogo from "../../assets/icons/logo.svg";
import { closeModal } from "../../redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { domainUrl } from "./../../utils/globals";
import { updateUser } from "../../redux/slices/authSlice";
import { updateMyField } from "../../redux/slices/myDataSlice";
import Tick from "../../assets/icons/tick.svg";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";
import { useNavigate } from "react-router-dom";

import {
  getUserData,
  setAuthCookies,
  getAuthToken,
} from "./../../services/cookies";

const Onboarding = () => {
  const [isUsername, setIsUsername] = useState(null);
  const [domainName, setDomainName] = useState("");
  const [isUsernameLoading, setUsernameLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    dispatch(closeModal("modalOnboardOpen"));
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-z0-9]*$/;
    if (regex.test(value)) {
      setDomainName(value);
    }
  };

  const checkUsername = async () => {
    if (domainName !== "") {
      try {
        setUsernameLoading(true);
        const response = await postRequestUnAuthenticated("/check/username", {
          username: domainName,
        });
        setIsUsername(response.success);
        return response.success;
      } catch (error) {
        console.error("Error checking username", error);
        return false;
      } finally {
        setUsernameLoading(false);
      }
    }
    return false;
  };

  const handleClaimDomain = async (e) => {
    e.preventDefault();
    const isAvailable = await checkUsername();
    if (domainName !== "" && isAvailable) {
      try {
        const response = await postRequestAuthenticated("/claim/username", {
          username: domainName,
        });
        console.log(response);
        if (response.success === true) {
          const currentUser = getUserData();
          if (currentUser) {
            currentUser.username = domainName;
            setAuthCookies(getAuthToken(), currentUser);
          }
          dispatch(updateUser({ username: domainName }));
          dispatch(updateMyField({ name: "username", value: domainName }));
          navigate(`/user/${domainName}/welcome`);
        } else {
          setIsUsername(false);
        }
      } catch (error) {
        console.error("Error claiming domain", error);
      }
    }
  };

  return (
    <div className="flex sm:flex-row flex-col w-full justify-center dark:bg-primaryBackground-dark h-full">
      <div className="dark:bg-primaryBackground-dark  pl-3 pt-4 sm:pb-0 pb-4">
        <img src={CLogo} alt="logo" />
      </div>
      <div className="flex flex-col justify-center sm:items-start items-center w-full sm:w-1/2 h-full lg:pl-[15%] md:pl-[5%]  dark:bg-primaryBackground-dark">
        <p className="dark:text-secondaryText-dark text-3xl font-medium tracking-wide font-inter">
          First things first,
          <br />
          claim your domain
        </p>
        <p className="text-white text-sm font-light  mt-1 font-inter">
          before anyone else takes it. Also it’s free :)
        </p>
        <div className="relative lg:w-88px sm:w-80 xs:w-3/4 w-[90%] flex items-center mt-5 border dark:border-emptyEvent-dark rounded-md p-2 bg-chipBackground">
          <input
            type="text"
            className="flex py-2 lg:w-48 w-44 text-white font-normal font-inter dark:bg-primaryBackground-dark focus:outline-none 
             dark:placeholder:text-primaryText-dark placeholder:text-sm placeholder:font-normal placeholder:font-inter"
            placeholder="Your domain name"
            value={domainName}
            maxLength={40}
            onChange={handleDomainChange}
          />
          <div className="absolute right-2 flex flex-row items-center">
            <span className="border-l dark:border-chatDivider-dark h-6 mr-2"></span>
            <span className="dark:text-emptyEvent-dark text-sm font-normal">
              .{domainUrl}
            </span>
          </div>
        </div>
        {isUsernameLoading ? (
          <div className="dark:text-secondaryText-dark">...</div>
        ) : (
          <div className="flex flex-row items-center mt-1">
            {isUsername && <img src={Tick} alt="Tick" className="w-5 h-5" />}
            <p
              className={`${
                isUsername
                  ? "dark:text-secondaryText-dark"
                  : "dark:text-error-dark"
              } font-light ml-1 font-inter text-xs`}
            >
              {isUsername
                ? "Available"
                : isUsername === false
                ? "Username already exist."
                : ""}
            </p>
          </div>
        )}
        <button
          className={`lg:w-88px md:w-80 w-3/4  py-2.5 mt-6 rounded-xl ${
            domainName !== ""
              ? "dark:text-secondaryText-dark dark:bg-buttonEnable-dark"
              : "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
          }  font-normal`}
          onClick={handleClaimDomain}
        >
          Claim Link
        </button>
      </div>

      <div className="sm:flex  hidden justify-start items-center dark:bg-tertiaryBackground-dark w-full sm:w-1/2 h-full">
        <img
          src={Onboard}
          alt="LinkOnboard"
          className="w-3/4 lg:w-1/2 h-auto"
        />
      </div>
    </div>
  );
};

export default Onboarding;
