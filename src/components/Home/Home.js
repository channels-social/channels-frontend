import {
  React,
  useState,
  useEffect, // <-- ADD THIS
  useNavigate,
  useSelector,
  useLocation,
  useModal,
  Logo,
  Footer,
} from "../../globals/imports";
import HomeBackground from "../../assets/images/home_background.svg";
import CommunityPage from "../../assets/channel_images/community_page.png";
import HomeImage from "../../assets/channel_images/home_image.png";
import ThemeToggleButton from "./../../utils/theme";
import Pricing from "./Pricing";
const HomePage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [activeTab2, setActiveTab2] = useState("home");
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myData = useSelector((state) => state.myData);
  const { handleOpenModal } = useModal();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/pricing") {
      setActiveTab("pricing");
    } else {
      setActiveTab("home");
    }
  }, [location.pathname]);

  const handleLogin = () => {
    setLoading(true);
    if (isLoggedIn) {
      setTimeout(() => {
        if (myData.username) {
          setLoading(false);
          navigate(`/user/${myData.username}/profile`);
        }
      }, 500);
    } else {
      setLoading(false);
      navigate("/get-started");
    }
  };

  const handleCreateChannel = () => {
    if (isLoggedIn) {
      if (myData.username) {
        navigate(`/user/${myData.username}/profile`);
      }
      setTimeout(() => {
        handleOpenModal("modalChannelOpen");
      }, 500);
    } else {
      navigate("/get-started");
    }
  };

  return (
    <div className="w-full h-full bg-theme-primaryBackground overflow-y-auto flex flex-col ">
      {activeTab === "home" ? (
        <img
          src={HomeBackground}
          alt="home-background"
          className="fixed object-cover w-full h-full -z-1"
        />
      ) : (
        <div className="bg-[#202020] w-full h-full fixed object-cover -z-1"></div>
      )}
      <div className="flex flex-row justify-between w-full items-center px-6 z-10 mt-2 ">
        <img src={Logo} alt="logo" className="h-8 w-auto" />

        <div className="space-x-8  mt-2 md:flex hidden ">
          <button
            onClick={() => navigate("/")}
            className={`text-sm font-light tracking-wider ${
              activeTab === "home"
                ? "border-b-2 border-white text-white"
                : "text-white"
            } pb-2 px-3 transition-all`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/pricing")}
            className={`text-sm font-light tracking-wider ${
              activeTab === "pricing"
                ? "border-b-2 border-white text-white"
                : "text-white"
            } pb-2 px-3 transition-all`}
          >
            Pricing
          </button>

          {/* <button
            onClick={() => setActiveTab("community")}
            className={`text-sm font-light tracking-wider ${
              activeTab === "community"
                ? "border-b-2 border-white text-white"
                : "text-white"
            } pb-2 px-3 transition-all`}
          >
            Community
          </button> */}
        </div>

        <div
          className="border cursor-pointer border-white rounded-md px-6 py-2 text-white font-normal text-sm"
          onClick={handleLogin}
        >
          {loading ? "Loading.." : isLoggedIn ? "Profile" : "Login"}
        </div>
      </div>
      <div className="space-x-8  md:hidden flex z-10 mx-auto mt-10">
        <button
          onClick={() => setActiveTab("home")}
          className={`text-sm font-light tracking-wider ${
            activeTab === "home"
              ? "border-b-2 border-white text-white"
              : "text-white"
          } pb-2 px-3 transition-all`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`text-sm font-light tracking-wider ${
            activeTab === "pricing"
              ? "border-b-2 border-white text-white"
              : "text-white"
          } pb-2 px-3 transition-all`}
        >
          Pricing
        </button>
        {/* <button
          onClick={() => setActiveTab("community")}
          className={`text-sm font-light tracking-wider ${
            activeTab === "community"
              ? "border-b-2 border-white text-white"
              : "text-white"
          } pb-2 px-3 transition-all`}
        >
          Community
        </button> */}
      </div>
      {activeTab === "home" ? (
        <div className="flex sm:flex-row flex-col items-center justify-start md:justify-between mt-10 lg:ml-20  ml-6 h-full z-10">
          <div className="flex flex-col w-full lg:w-1/3 md:w-[45%] sm:w-2/3 space-y-3 sm:mr-0 mr-6">
            <div className="text-left text-theme-sidebarColor xl:text-lg text-sm font-normal font-inter">
              Your people, Your space
            </div>
            <div className="text-white xl:text-3xl text-2xl font-normal font-inter">
              Why need a ton of apps for a great community, when they already
              love yours
            </div>
            <div className="opacity-80 text-white xl:text-sm text-xs font-light font-inter">
              Simply integrate chats, events, and share content with your
              audience right inside your website or app, giving your community a
              space to thrive.
            </div>
            <div className="flex flex-row justify-start items-center pt-2">
              <div
                className="bg-white cursor-pointer rounded-lg lg:px-5 px-4  sm:px-2 xl:py-3 py-2 text-black text-sm"
                onClick={handleCreateChannel}
              >
                Create your Channel
              </div>
              <a
                href="https://calendly.com/channels_social/talk-to-us"
                target="_blank"
                rel="noopener noreferrer"
                className="border lg:ml-5 sm:ml-3 ml-5 cursor-pointer border-white rounded-md lg:px-4 sm:px-2 
              px-4 xl:py-3 py-2 text-white font-normal text-sm"
              >
                Talk to us
              </a>
            </div>
          </div>
          <div className="sm:ml-8 sm:mt-0 mt-8 relative bg-theme-sidebarColor xs:pt-1 pt-2 lg:w-3/5 md:w-[45%] sm:w-2/3">
            <img
              src={activeTab === "home" ? HomeImage : CommunityPage}
              alt="home-image"
              className="h-auto object-contain ml-auto w-full"
            />
            <div className="absolute lg:top-2  top-0 sm:right-[25%]  xs:right-[65%] right-[55%] text-theme-primaryBackground">
              <div className="flex items-center justify-center w-full h-10 md:h-12 ">
                <div className="flex md:border-2 border border-theme-homeToggle rounded-full ">
                  <button
                    onClick={() => setActiveTab2("home")}
                    className={`${
                      activeTab2 === "home"
                        ? "bg-theme-primaryBackground text-theme-secondaryText"
                        : "text-theme-homeToggle"
                    } md:px-4 px-2 md:py-1.5 xs:py-1 py-0.5 rounded-full transition-colors duration-300 md:text-sm text-xs xs:font-normal font-light`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab2("community")}
                    className={`${
                      activeTab2 === "community"
                        ? "bg-theme-primaryBackground text-theme-secondaryText"
                        : "text-theme-homeToggle"
                    }  md:px-4 px-2 md:py-1.5 xs:py-1 py-0.5 rounded-full transition-colors duration-300 md:text-sm text-xs xs:font-normal font-light`}
                  >
                    Community
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "pricing" ? (
        <Pricing />
      ) : (
        <div></div>
      )}
      <div className="h-28"></div>

      <div className="z-10 sm:mt-16 mt-10 w-full bottom-0 fixed">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
