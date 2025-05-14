import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EmbedSidebar from "./EmbedSidebar";
import Menu from "../../../assets/icons/menu.svg";
import Profile from "../../../assets/icons/profile.svg";
import StorageManager from "../utility/storage_manager";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import { fetchMyData, clearMyData } from "../../../redux/slices/myDataSlice";
import { setTheme } from "../../../redux/slices/themeSlice";
import {
  initializeEmbedAuth,
  checkAutoLogin,
} from "../embedSlices/embedAuthSlice";
import { setEmbedItem, clearEmbedItem } from "../embedSlices/embedHomeSlice";
import embedStore from "../../../redux/store/embedStore";
import SidebarSkeleton from "./../../skeleton/SidebarSkeleton";
import Modals from "./../../../utils/modals";
import { Page } from "react-pdf";
import { getAppPrefix } from "./../utility/embedHelper";
import { isEmbeddedOrExternal } from "./../../../services/rest";
import EmbedHeaderPage from "./EmbedHeaderPage";

const EmbedHomePage = () => {
  const [loading, setLoading] = useState(false);
  const [embedDataReceived, setEmbedDataReceived] = useState(false);
  const [embedLoadTimeout, setEmbedLoadTimeout] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const myData = useSelector((state) => state.myData);
  const embedHome = useSelector((state) => state.embedHome);
  const dispatch = useDispatch();
  const embedDataReceivedRef = useRef(false);

  const fetchData = () => {
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      try {
        const storedEmbedData = StorageManager.getItem("embedData");
        if (!storedEmbedData) return resolve();

        const { apiKey, selectedChannel, selectedTopic, domain, channels } =
          JSON.parse(storedEmbedData);

        const formData = new FormData();
        formData.append("apiKey", apiKey);
        formData.append("selectedChannel", selectedChannel || "");
        formData.append("selectedTopic", selectedTopic || "");
        formData.append("domain", domain || "");
        formData.append("echannels", JSON.stringify(channels));

        const response = await postRequestUnAuthenticated(
          "/generate/embed-data",
          formData
        );

        setLoading(false);
        if (response.success) {
          StorageManager.setItem("embedFetchedData", JSON.stringify(response));
          dispatch(
            setEmbedItem({ field: "channels", value: response.channels })
          );
          dispatch(
            setEmbedItem({
              field: "selectedChannel",
              value: response.selectedChannel,
            })
          );
          dispatch(
            setEmbedItem({
              field: "selectedTopic",
              value: response.selectedTopic,
            })
          );
          dispatch(
            setEmbedItem({ field: "username", value: response.username })
          );
          navigateToChannel(response);
          resolve();
        } else {
          console.warn("⚠️ Failed to fetch embed data:", response);
          resolve(); // resolve even on failure to avoid hanging
        }
      } catch (error) {
        setLoading(false);
        console.error("❌ Error fetching embed data:", error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      const message = event.data;

      if (
        typeof message === "object" &&
        message.type === "embedData" &&
        message.source === "channels-widget"
      ) {
        try {
          const embedData = message.payload;
          StorageManager.setItem("embedData", JSON.stringify(embedData));
          document.documentElement.classList.toggle(
            "dark",
            embedData.theme === "dark"
          );
          localStorage.setItem("theme", embedData.theme);
          dispatch(setTheme(embedData.theme));

          const formData = new FormData();
          formData.append("email", embedData.email);
          formData.append("domain", embedData.domain);
          formData.append("apiKey", embedData.apiKey);
          formData.append("channelName", embedData.selectedChannel);

          await fetchData();

          setEmbedDataReceived(true);
          embedDataReceivedRef.current = true;
          localStorage.removeItem("embedReloadAttempts");

          dispatch(checkAutoLogin(formData))
            .unwrap()
            .then((data) => {
              if (data) {
                const user = data.user;
                const partialUser = {
                  _id: user._id,
                  username: user.username,
                  name: user.name,
                  email: user.email,
                  contact: user.contact,
                  whatsapp_number: user.whatsapp_number,
                };
                StorageManager.setItem("user", JSON.stringify(partialUser));
                StorageManager.setItem("auth-token", data.token);
              }
            })
            .catch(() => {
              console.log("Auto login not set");
            });
        } catch (err) {
          console.error("❌ Error handling embedData postMessage:", err);
        }
      } else {
        console.warn("⚠️ Ignored message:", message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!embedDataReceivedRef.current) {
        console.warn("⏰ embedData not received in time");
        setEmbedLoadTimeout(true);
      }
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (embedLoadTimeout) {
      const reloadAttempts = parseInt(
        localStorage.getItem("embedReloadAttempts") || "0"
      );
      if (reloadAttempts < 3) {
        localStorage.setItem("embedReloadAttempts", reloadAttempts + 1);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.warn("🛑 Max reload attempts reached");
      }
    }
  }, [embedLoadTimeout]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(initializeEmbedAuth());
        if (auth.isLoggedIn) {
          await dispatch(fetchMyData());
        } else {
          dispatch(clearMyData());
        }
      } catch (error) {
        console.error("Error during app initialization:", error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const storedFetchedData = StorageManager.getItem("embedFetchedData");
    if (storedFetchedData) {
      const parsedData = JSON.parse(storedFetchedData);
      dispatch(setEmbedItem({ field: "channels", value: parsedData.channels }));
      dispatch(
        setEmbedItem({
          field: "selectedChannel",
          value: parsedData.selectedChannel,
        })
      );
      dispatch(
        setEmbedItem({
          field: "selectedTopic",
          value: parsedData.selectedTopic,
        })
      );
      dispatch(setEmbedItem({ field: "username", value: parsedData.username }));
    }
  }, []);

  useEffect(() => {
    if (auth.isLoggedIn) {
      dispatch(fetchMyData());
    }
  }, [auth.isLoggedIn, dispatch]);

  const navigateToChannel = (data) => {
    if (data.selectedChannel && data.selectedTopic) {
      navigate(
        `/embed/channels/user/${data.username}/channel/${data.selectedChannel}/c-id/topic/${data.selectedTopic}`
      );
    } else if (data.selectedChannel) {
      navigate(
        `/embed/channels/user/${data.username}/channel/${data.selectedChannel}`
      );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* <div
        className="w-full bg-themeprimaryBackground sm:hidden px-6 h-10 
      shadow-md flex flex-row justify-between items-center"
      >
        <img
          src={Menu}
          alt="menu"
          className="h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div> */}
      {!embedLoadTimeout && (
        <div className="flex w-full">
          <EmbedHeaderPage />
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {/* <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0 sm:flex ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:w-[250px] md:w-1/4 sm:w-[30%] w-[250px] bg-themeprimaryBackground`}
        >
          {loading ? (
            <SidebarSkeleton />
          ) : embedHome.channels.length > 0 ? (
            <EmbedSidebar closeSidebar={closeSidebar} loading={loading} />
          ) : (
            <div className="text-center p-4 text-sm">No Channels found</div>
          )}
        </div> */}

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="w-full h-full-height-56">
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin border-theme-secondaryText"></div>
              <p className="mt-4 text-2xl font-normal text-theme-secondaryText">
                Loading...
              </p>
            </div>
          ) : embedLoadTimeout ? (
            <div className="text-center mt-10">
              <p className="text-theme-secondaryText mb-2">
                Failed to load embed data. Try refreshing.
              </p>
              <button
                className="px-4 py-2 bg-blue-500 text-theme-secondaryText rounded"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          ) : (
            <Outlet />
          )}
          <Modals />
        </div>
      </div>
    </div>
  );
};

export default EmbedHomePage;
