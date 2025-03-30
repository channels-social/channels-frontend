import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EmbedSidebar from "./EmbedSidebar";
import Menu from "../../../assets/icons/menu.svg";
import StorageManager from "../utility/storage_manager";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import { fetchMyData, clearMyData } from "../../../redux/slices/myDataSlice";
import {
  initializeEmbedAuth,
  checkAutoLogin,
} from "../embedSlices/embedAuthSlice";
import { setEmbedItem, clearEmbedItem } from "../embedSlices/embedHomeSlice";
import embedStore from "../../../redux/store/embedStore";
import SidebarSkeleton from "./../../skeleton/SidebarSkeleton";
import Modals from "./../../../utils/modals";
import { Page } from "react-pdf";

const EmbedHomePage = () => {
  const [channels, setChannels] = useState([]);
  // const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [email, setEmail] = useState(false);
  // const [domain, setDomain] = useState(false);
  // const [apiKey, setAPiKey] = useState(false);
  // const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const embedHome = useSelector((state) => state.embedHome);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    const storedFetchedData = StorageManager.getItem("embedFetchedData");
    // console.log(storedFetchedData);
    if (storedFetchedData) {
      const parsedData = JSON.parse(storedFetchedData);
      navigateToChannel(parsedData);
      setLoading(false);
      return;
    }
    try {
      const storedEmbedData = StorageManager.getItem("embedData");
      if (!storedEmbedData) return;
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

        dispatch(setEmbedItem({ field: "channels", value: response.channels }));
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
        dispatch(setEmbedItem({ field: "username", value: response.username }));

        navigateToChannel(response);
      } else {
        console.warn("⚠️ Failed to fetch embed data:", response);
      }
    } catch (error) {
      console.error("❌ Error fetching embed data:", error);
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      if (
        typeof message === "object" &&
        message.type === "embedData" &&
        message.source === "channels-widget"
      ) {
        const embedData = message.payload;

        StorageManager.setItem("embedData", JSON.stringify(embedData));

        const formData = new FormData();
        formData.append("email", embedData.email);
        formData.append("domain", embedData.domain);
        formData.append("apiKey", embedData.apiKey);

        fetchData();
        dispatch(checkAutoLogin(formData))
          .unwrap()
          .then((data) => {
            if (data) {
              const user = data.user;
              const partialUser = {
                name: user.name,
                email: user.email,
                contact: user.contact,
                whatsapp_number: user.whatsapp_number,
              };
              StorageManager.setItem("user", JSON.stringify(partialUser));
              StorageManager.setItem("auth-token", data.token);
            }
          })
          .catch((error) => {
            console.log("Auto lohgin not set:");
          });
      } else {
        console.warn("⚠️ Ignored message structure:", message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [dispatch]);

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
        `/embed/channels/user${data.username}/channel/${data.selectedChannel}/c-id/topic/${data.selectedTopic}`
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
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="w-full dark:bg-secondaryBackground-dark sm:hidden flex items-center px-6 h-10">
        <img
          src={Menu}
          alt="menu"
          className="h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0 sm:flex ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:w-[250px] md:w-1/4 sm:w-[30%] w-[250px] dark:bg-primaryBackground-dark`}
        >
          {loading ? (
            <SidebarSkeleton />
          ) : embedHome.channels.length > 0 ? (
            <EmbedSidebar closeSidebar={closeSidebar} loading={loading} />
          ) : (
            <div className="text-center p-4 text-sm">No Channels found</div>
          )}
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="w-full h-full-height-40">
          {loading ? (
            <div className="text-center mx-auto items-center dark:text-secondaryText-dark text-2xl mt-20 font-normal">
              Loading Page2...
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
