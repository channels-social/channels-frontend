import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { hostUrl } from "../../../utils/globals";
import OtpInput from "react-otp-input";
import { setCredentials } from "../../../redux/slices/authSlice";
import googleLogo from "../../../assets/channel_images/google_logo.svg";
import { getCsrfToken } from "../../../services/csrfToken";
import StorageManager from "./../utility/storage_manager";
import { domainUrl } from "./../../../utils/globals";

const EmbedAuthPage = ({ initialEmail = "" }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [otpBackend, setOtpBackend] = useState("");
  const [otp, setOtp] = useState("");
  const [newError, setNewError] = useState("");
  const [showOtp, setShowOtp] = useState("");
  const dispatch = useDispatch();
  const csrfToken = getCsrfToken();
  const currentDomain = window.location.origin;

  const clearData = () => {
    setFullName("");
    setEmail("");
    setOtp("");
    setOtpBackend("");
    setNewError("");
  };

  const handleSendOtp = async () => {
    setNewError("");
    try {
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
      };
      await axios
        .post(`${hostUrl}/api/login/embed`, userData, {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.success) {
            setOtpBackend(response.data.top);
            setShowOtp(true);
          } else {
            setNewError(response.data.message);
          }
        });
    } catch (error) {
      setNewError("Error Registering. Please try again");
    }
  };

  const handleChangeOtp = async (value) => {
    setOtp(value);
    if (value.length === 6 && value === otpBackend) {
      setNewError("");
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        domain: currentDomain,
      };
      try {
        await axios
          .post(`${hostUrl}/api/verify/login/embed`, userData, {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.success) {
              StorageManager.setItem("auth-token", response.data.token);
              StorageManager.setItem("user", response.data.user);
              dispatch(
                setCredentials({
                  user: response.data.user,
                  token: response.data.token,
                })
              );
              clearData();
            } else {
              setNewError(response.data.message);
            }
          });
      } catch (error) {
        setNewError("Error Registering. Please try again");
      }
    } else if (otp.length === 6) {
      setNewError("Enter Correct Otp");
      console.log("some error");
    }
  };

  const handleGoogleAuthPopup = () => {
    setNewError("");
    const authUrl = `http://${domainUrl}/embed/google-auth/login?domain=${window.location.origin}`;
    const popup = window.open(
      authUrl,
      "_blank",
      "width=500,height=600,left=100,top=100"
    );
    const handleMessage = (event) => {
      if (event.origin !== "https://channels.social") return;

      const { success, user, token } = event.data;
      if (success) {
        StorageManager.setItem("auth-token", token);
        StorageManager.setItem("user", user);
        dispatch(
          setCredentials({
            user,
            token,
          })
        );
      }
      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-[450px] w-[90%] xs:w-3/4 sm:w-3/5 md:1/2 lg:w-1/3 xl:w-[30%] flex flex-col items-center dark:bg-primaryBackground-dark">
        <h3 className="text-2xl sm:text-4xl text-center font-medium tracking-wider dark:text-secondaryText-dark font-inter">
          Sign In
        </h3>
        <p className="dark:text-secondaryText-dark text-sm mt-2">"ʕっ•ᴥ•ʔっ"</p>
        <div className="mt-6 space-y-6 w-full px-6">
          <div className="relative">
            <label
              className="absolute left-4 -top-2 text-xs z-20 font-light font-inter dark:bg-primaryBackground-dark 
              dark:text-secondaryText-dark"
            >
              Full Name (optional)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pt-3 pb-4 pl-4 pr-3 rounded-md border text-sm font-light font-inter border-profileBorder dark:bg-transparent 
              dark:text-secondaryText-dark focus:border-primary focus:ring-0 focus:outline-none"
              placeholder=""
            />
          </div>

          <div className="relative">
            <label
              className="absolute left-4 -top-2 text-xs z-20 font-light font-inter dark:bg-primaryBackground-dark 
              dark:text-secondaryText-dark"
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pt-3 pb-4 pl-3 pr-20 rounded-md text-sm border font-light font-inter border-profileBorder dark:bg-transparent 
              dark:text-secondaryText-dark focus:border-primary focus:ring-0 focus:outline-none"
              placeholder=""
            />
            <div
              className="dark:bg-buttonEnable-dark cursor-pointer px-2 py-1.5 dark:text-secondaryText-dark
             absolute text-xs right-2 top-3 rounded-md"
              onClick={handleSendOtp}
            >
              Send Otp
            </div>
          </div>

          {showOtp && (
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={6}
                renderSeparator={<span className="w-2 xs:w-4"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "36px",
                      height: "40px",
                      borderRadius: "6px",
                      border: "1px solid #5a5a5a",
                      backgroundColor: "#2B2930",
                      textAlign: "center",
                      color: "white",
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />
            </div>
          )}
        </div>

        <div className="text-center dark:text-error-dark my-4 font-light text-sm tracking-wide">
          {newError}
        </div>

        <button
          onClick={handleGoogleAuthPopup}
          className="w-max px-6 py-2 mb-4 text-xs font-normal items-center
          text-white dark:bg-tertiaryBackground-dark rounded-xl border border-chatDivider-dark"
        >
          <img
            src={googleLogo}
            alt="Google logo"
            className="inline w-6 h-6 mr-2"
          />
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </button>
      </div>
    </div>
  );
};

export default EmbedAuthPage;
