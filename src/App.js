import "./App.css";
import { React, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import PageHome from "./components/ChannelPages/PageHome";
import ThemeHandler from "./utils/ThemeHandler";
import Onboarding from "./components/Onboarding/Onboarding";
import { Helmet } from "react-helmet";
import Logo from "./assets/icons/channels_logo.svg";
import Footer from "./components/Footer/Footer";
import AuthPage from "./components/auth/AuthPage";
import Landing from "./components/LandingPage/Landing";
import Welcome from "./components/LandingPage/Welcome";
import Profile from "./components/Profile/Profile";
import ChannelPage from "./components/Channel/ChannelPage";
import ChannelModal from "./components/Modals/Channel/ChannelModal";
import ChannelUnsplash from "./components/Modals/Unsplash/ChannelUnsplash";
import TopicModal from "./components/Modals/Topic/TopicModal";
import PrivacyPolicy from "./components/Footer/Modals/PrivacyPolicy";
import TermsofService from "./components/Footer/Modals/TermsofService";
import Home from "./components/Home/Home";
import useInitializeApp from "./services/initializeApp";
import ChipsModal from "./components/Modals/ChipsModal";
import ProfileShareModal from "./components/Modals/share/profileShareModal";
import ChannelShareModal from "./components/Modals/share/channelShareModal";
import CurationModal from "./components/Modals/CurationModal";
import CreateCategoryModal from "./components/Modals/CreateCategoryModal";
import CommentChipModal from "./components/Modals/comments/CommentChipModal";
import CategoryReorderModal from "./components/Modals/category/CategoryReorderModal";
import EditChipModal from "./components/Modals/EditChipModal";
import DeleteChipModal from "./components/Modals/deletions/DeleteChipModal";
import DeleteCurationModal from "./components/Modals/deletions/DeleteCurationModal";
import PushtoCategoryModal from "./components/Modals/PushItems/pushtoCategoryModal";
import PushtoCurationModal from "./components/Modals/PushItems/pushtoCurationModal";
import ChipShareModal from "./components/Modals/share/ChipShareModal";
import ChannelCoverModal from "./components/Modals/Channel/ChannelCoverModal";
import DeleteFaqModal from "./components/Modals/deletions/DeleteFaqModal";

const clientId =
  "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com";

const App = () => {
  const footerRef = useRef(null);
  useInitializeApp();

  const MainLayout = () => {
    const location = useLocation();
    const excludedPaths = [
      "/user/:username",
      "/channel/:channelName/page/:pageName",
    ];

    const isFooterExcluded = excludedPaths.some((path) => {
      const regex = new RegExp(path.replace(/:[^\s/]+/g, "([^/]+)"));
      return regex.test(location.pathname);
    });

    return (
      <div className="flex flex-col min-h-screen bg-primaryBackground w-full">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Channels.Social</title>
          <link rel="icon" href={Logo} />
        </Helmet>
        <div className="flex flex-1 ">
          <div className="flex-1 w-full">
            <Outlet />
          </div>
        </div>
        <div className="w-full">
          {!isFooterExcluded && <Footer ref={footerRef} />}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <GoogleOAuthProvider clientId={clientId}>
        <ThemeHandler />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<PageHome />} />
            <Route path="/get-started" element={<AuthPage />} />
            <Route path="/channels/onboarding" element={<Onboarding />} />
            <Route path="/user/:username" element={<Landing />}>
              <Route path="/user/:username/welcome" element={<Welcome />} />
              <Route path="/user/:username/profile" element={<Profile />} />
              <Route
                path="/user/:username/channel/:channelName/c-id/:channelId/topic/:topicId"
                element={<PageHome />}
              />
              <Route
                path="/user/:username/channel/:channelId"
                element={<ChannelPage />}
              />
            </Route>
          </Route>
          {/* <Route
            path="/channel/:channelName/page/:pageName"
            element={<PageHome />}
          /> */}
        </Routes>
        <ChannelModal />
        <PrivacyPolicy />
        <TermsofService />
        <ChannelUnsplash />
        <TopicModal />
        <ChipsModal />
        <CurationModal />
        <ProfileShareModal />
        <ChannelShareModal />
        <CreateCategoryModal />
        <CommentChipModal />
        <CategoryReorderModal />
        <EditChipModal />
        <DeleteChipModal />
        <DeleteCurationModal />
        <PushtoCategoryModal />
        <PushtoCurationModal />
        <ChipShareModal />
        <ChannelCoverModal />
        <DeleteFaqModal />
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
