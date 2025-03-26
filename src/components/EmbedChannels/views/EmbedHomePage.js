import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import EmbedSidebar from "./EmbedSidebar";
import Menu from "../../../assets/icons/menu.svg";
import StorageManager from "../utility/storage_manager";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import {
  initializeEmbedAuth,
  checkAutoLogin,
} from "../embedSlices/embedAuthSlice";
import { Provider } from "react-redux";
import embedStore from "../../../redux/store/embedStore";
import { fetchMyData } from "./../../../redux/slices/myDataSlice";
import SidebarSkeleton from "./../../skeleton/SidebarSkeleton";

const EmbedHomePage = () => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(false);
  const [domain, setDomain] = useState(false);
  const [apiKey, setAPiKey] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeEmbedAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!auth.isLoggedIn) {
      const storedEmbedData = StorageManager.getItem("embedData");
      if (!storedEmbedData) return;

      const { email, domain, apiKey } = JSON.parse(storedEmbedData);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("domain", domain);
      formData.append("apiKey", apiKey);

      dispatch(checkAutoLogin(formData));
    } else {
      dispatch(fetchMyData());
    }
  }, [auth.isLoggedIn, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const storedFetchedData = StorageManager.getItem("embedFetchedData");

      if (storedFetchedData) {
        const parsedData = JSON.parse(storedFetchedData);
        navigateToChannel(parsedData);
        setLoading(false);
        return;
      }

      try {
        const storedEmbedData = StorageManager.getItem("embedData");
        if (!storedEmbedData) return;

        const { apiKey, selectedChannel, selectedTopic, domain } =
          JSON.parse(storedEmbedData);
        const formData = new FormData();
        formData.append("apiKey", apiKey);
        formData.append("selectedChannel", selectedChannel || "");
        formData.append("selectedTopic", selectedTopic || "");
        formData.append("domain", domain || "");
        const response = await postRequestUnAuthenticated(
          "/generate/embed-data",
          formData
        );

        if (response?.success) {
          StorageManager.setItem("embedFetchedData", JSON.stringify(response));
          navigateToChannel(response);
        } else {
          setLoading(false);
          console.warn("⚠️ Failed to fetch embed data:", response);
        }
      } catch (error) {
        setLoading(false);
        console.error("❌ Error fetching embed data:", error);
      }
    };

    fetchData();
  }, []);

  const navigateToChannel = (data) => {
    if (data.selectedChannel && data.selectedTopic) {
      navigate(
        `/channel/${data.selectedChannel}/c-id/topic/${data.selectedTopic}`
      );
    } else if (data.selectedChannel) {
      navigate(`/channel/${data.selectedChannel}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Provider store={embedStore}>
      <div className="flex flex-col w-full">
        <div className="w-full dark:bg-secondaryBackground-dark sm:hidden flex">
          <img
            src={Menu}
            alt="menu"
            className="mt-2 ml-6 h-6 w-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        <div className="flex flex-row h-screen w-full">
          <div
            className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0 sm:flex ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:w-[250px] md:w-1/4 sm:w-[30%] w-[250px] dark:bg-primaryBackground-dark`}
          >
            {loading ? (
              <SidebarSkeleton />
            ) : (
              <EmbedSidebar
                closeSidebar={closeSidebar}
                channels={channels}
                selectedChannel={selectedChannel}
                selectedTopic={selectedTopic}
                loading={loading}
              />
            )}
          </div>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
              onClick={closeSidebar}
            ></div>
          )}

          <div className="lg:w-full-minus-250 md:w-3/4 sm:w-[70%] w-full h-full">
            {loading ? (
              <div className="text-center mx-auto items-center dark:text-secondaryText-dark text-2xl mt-20 font-normal">
                Loading Page...
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center mx-auto items-center dark:text-secondaryText-dark text-md mt-20 font-normal">
                No Channels found.
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default EmbedHomePage;
