import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useModal from "./../hooks/ModalHook";
import {
  fetchCurationsfromCategory,
  fetchChips,
  setSelectedCuration,
  clearCurationChips,
} from "./../../redux/slices/categoryCurations";
import { setCurationEngagement } from "./../../redux/slices/curationEngagementSlice";
import { saveCuration } from "./../../redux/slices/curationPageSlice";
import SavedSkeleton from "./../skeleton/savedSkeleton";
import List from "../../assets/icons/List.svg";
import Category from "../../assets/icons/category.svg";
import ListSelected from "../../assets/icons/List_s.svg";
import CategoryUnselected from "../../assets/icons/category_s.svg";
import CurationItemsSkeleton from "./../skeleton/curationItemsSkeleton";
import Share from "../../assets/icons/share_icon.svg";
import ShareLight from "../../assets/lightIcons/share_icon_light.svg";
import ProfileItemsSkeleton from "./../skeleton/profileItemsSkeleton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import SaveIcon from "../../assets/icons/save_icon.svg";
import SavedIcon from "../../assets/icons/favorite.svg";
import Chips from "./../chips/Chips";
import ProfileChips from "./../chips/ProfileChips";
import AddIcon from "../../assets/icons/addIcon.svg";
import AddIconLight from "../../assets/lightIcons/add_light.svg";
import { setChipField } from "../../redux/slices/chipSlice";
import { domainUrl } from "./../../utils/globals";

const CurationsCategory = () => {
  const explore = "Explore ->";
  const dispatch = useDispatch();
  const { category } = useParams();
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const decodedCategory = decodeURIComponent(category);
  const navigate = useNavigate();
  const { handleOpenModal } = useModal();
  const isLogin = useSelector((state) => state.auth.isLoggedIn);

  const handleShareOpen = () => {
    handleOpenModal("modalShareOpen");
  };
  const myData = useSelector((state) => state.myData);

  const { curations, chips, selectedCuration, loading, chipLoading } =
    useSelector((state) => state.categoryCurations);

  const [isList, setIsList] = useState(true);

  const ToggleList = (value) => {
    setIsList(value);
  };

  const handleChipsPage = (id) => {
    navigate(`curation/${id}`, { state: { owner: isOwner } });
    dispatch(setCurationEngagement(id));
  };

  const handleItemClick = (item, index) => {
    dispatch(clearCurationChips());
    dispatch(setSelectedCuration(item));
    setTimeout(() => {
      dispatch(fetchChips(item._id));
    }, 0);
    dispatch(setCurationEngagement(item._id));
  };
  // console.log(selectedCuration);

  const handleChipOpen = (curId) => {
    if (isLogin) {
      dispatch(setChipField({ field: "curation", value: curId }));
      handleOpenModal("modalChipOpen");
      dispatch(fetchChips(curId));
    } else {
      handleOpenModal("modalLoginOpen");
    }
  };

  useEffect(() => {
    if (decodedCategory) {
      dispatch(fetchCurationsfromCategory(decodedCategory)).then((result) => {
        if (result.payload.length > 0) {
          const firstCuration = result.payload[0];
          dispatch(setSelectedCuration(firstCuration));
          dispatch(clearCurationChips());
          dispatch(fetchChips(firstCuration._id));
        }
      });
    }
  }, [dispatch, decodedCategory]);

  const handleSaved = (curId) => {
    dispatch(saveCuration(curId));
    setSavedMessageVisible(true);
    if (isSaved) {
      setSavedMessage("Unsaved!");
    } else {
      setSavedMessage("Saved!");
    }
    setTimeout(() => {
      setSavedMessageVisible(false);
    }, 1000);
  };

  const handleNavigationHome = () => {
    navigate("/");
  };

  const handleEmptyCuration = () => {
    if (myData._id === selectedCuration.user._id) {
      dispatch(
        setChipField({ field: "curation", value: selectedCuration._id })
      );
      handleOpenModal("modalChipOpen");
    } else {
      handleNavigationHome();
    }
  };

  if (loading) {
    return <SavedSkeleton />;
  }

  const isOwner = selectedCuration?.user._id === myData?._id;
  const isSaved = selectedCuration?.saved_by?.includes(myData?._id);
  const isEditable = selectedCuration?.visibility === "anyone" || isOwner;

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center mb-3">
        <p className="text-theme-secondaryText text-xl sm:text-2xl font-familjen-grotesk font-normal tracking-wide sm:pl-3">
          {decodedCategory}
        </p>
        <div className="flex items-center justify-end mr-4 sm:mr-12">
          <img
            className="cursor-pointer"
            src={isList === true ? ListSelected : List}
            alt="List"
            onClick={() => ToggleList(true)}
          />
          <img
            src={isList === true ? CategoryUnselected : Category}
            alt="Category"
            className="cursor-pointer ml-5"
            onClick={() => ToggleList(false)}
          />
        </div>
      </div>

      {isList && curations.length > 0 ? (
        <>
          <div className="sm:hidden flex-col w-full ">
            <div className="overflow-x-auto flex w-full mt-5 flex-row custom-scrollbar">
              {loading ? (
                <CurationItemsSkeleton />
              ) : (
                curations.map((item, index) => (
                  <div
                    key={item._id}
                    className={`flex flex-col w-36 justify-start rounded-lg mr-1.5 mb-2 px-2 py-2 cursor-pointer ${
                      selectedCuration?._id === item._id
                        ? " bg-chipBackground border border-borderColor"
                        : " bg-primaryBackground"
                    }`}
                    onClick={() => handleItemClick(item, index)}
                    style={{ minWidth: "9rem" }}
                  >
                    <img
                      src={item.image}
                      alt="Curation"
                      className=" w-full h-20 object-cover rounded-lg"
                    />
                    <span className=" w-full text-textColor font-normal text-sm md:text-xs truncate">
                      {item.name}
                    </span>
                    <span className="w-full mt-1 text-lightText text-xs truncate">
                      {item.user?.name}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div
              className={`w-[100%]  border border-borderColor`}
              style={{ height: "1px" }}
            ></div>
            <div className="flex flex-col w-[95%] mt-2 ">
              <p className="text-lg text-theme-secondaryText font-normal  font-inter">
                {selectedCuration?.name}
              </p>
              <div className="flex flex-row items-center justify-between mt-1">
                <a
                  href={`https://${domainUrl}/profile/${selectedCuration.user.username}`}
                  className="text-center text-primary text-xs font-normal font-inter underline custom-underline-offset w-max cursor-pointer"
                  style={{ textUnderlineOffset: "2px" }}
                >
                  {selectedCuration?.user?.name}
                </a>
                <div className="flex flex-row">
                  {!isOwner && (
                    <div className="relative">
                      {isSavedMessageVisible && (
                        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg text-theme-secondaryText text-xs rounded-lg px-2 py-1">
                          {savedMessage}
                        </div>
                      )}
                      <div
                        className={`${
                          isSaved ? "bg-iconColor" : "bg-primary"
                        } px-2 py-0.5 rounded-xl ml-2 cursor-pointer`}
                        onClick={() => handleSaved(selectedCuration?._id)}
                      >
                        <img
                          src={isSaved ? SavedIcon : SaveIcon}
                          alt="save"
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                  )}
                  {isEditable && (
                    <img
                      src={AddIcon}
                      alt="add-icon"
                      className="dark:block hidden cursor-pointer ml-3"
                      onClick={() => handleChipOpen(selectedCuration?._id)}
                    />
                  )}
                  {isEditable && (
                    <img
                      src={AddIconLight}
                      alt="add-icon"
                      className="dark:hidden cursor-pointer ml-3"
                      onClick={() => handleChipOpen(selectedCuration?._id)}
                    />
                  )}
                  <img
                    src={Share}
                    alt="share"
                    className="dark:block hidden w-6 h-6 text-primary ml-3 cursor-pointer"
                    onClick={handleShareOpen}
                  />
                  <img
                    src={ShareLight}
                    alt="share"
                    className="dark:hidden w-6 h-6 text-primary ml-3 cursor-pointer"
                    onClick={handleShareOpen}
                  />
                </div>
              </div>
              <div className="mt-4"></div>
              {chipLoading ? (
                <ProfileItemsSkeleton />
              ) : chips.length === 0 ? (
                <div className="flex items-center mt-20">
                  <div
                    className="container rounded-md bg pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36"
                    style={{ marginRight: "auto" }}
                  >
                    <h3 className=" text-textColor text-sm">
                      (. ❛ ᴗ ❛.) Seems like this curation is empty
                    </h3>
                    <div className="mt-2 rounded-md bg-chipBackground pl-5 pt-4 pb-4 cursor-pointer">
                      <p
                        className=" text-textColor text-xs font-light"
                        onClick={handleEmptyCuration}
                      >
                        {myData?._id === selectedCuration?.user?._id ||
                        selectedCuration.visibility === "anyone"
                          ? "Add a Chip ->"
                          : `Explore more ->`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <ResponsiveMasonry columnsCountBreakPoints={{ 500: 1 }}>
                  <Masonry gutter="15px">
                    {chips.map((item, index) =>
                      item.user?._id === myData?._id ? (
                        <ProfileChips key={item._id} item={item} />
                      ) : (
                        <Chips key={item._id} item={item} />
                      )
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </div>
          </div>
          <div className="hidden sm:flex flex-row w-full h-full rounded-lg -ml-3">
            <div className="flex flex-col sm:ml-2 sm:w-1/3 lg:w-1/5 rounded-lg">
              {/* <div className="flex flex-row items-center  pr-3 pt-1">
                <div className="relative flex-1">
                  <FontAwesomeIcon icon={faSearch} className="absolute top-1/2 mb-2 pl-1 transform -translate-y-1/2 text-textFieldColor w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-5 pr-3 py-3 rounded-lg text-theme-secondaryText bg-primaryBackground focus:outline-none w-full font-inter font-normal text-sm flex items-center placeholder:text-textFieldColor placeholder:text-xs"
                  />
                </div>
              </div> */}
              <div className="overflow-y-auto max-h-[calc(100vh-162px)] custom-scrollbar mt-3">
                {loading ? (
                  <CurationItemsSkeleton />
                ) : (
                  curations.map((item, index) => (
                    <div
                      key={item._id}
                      className={`flex flex-col justify-start rounded-lg ml-1 pl-2.5 pr-2 cursor-pointer ${
                        selectedCuration?._id === item._id
                          ? " bg-chipBackground border border-borderColor"
                          : " bg-primaryBackground"
                      }`}
                      onClick={() => handleItemClick(item, index)}
                    >
                      <div className="flex items-start rounded-lg pt-2.5 pb-2.5 w-full">
                        <img
                          src={item.image}
                          alt="Curation"
                          className="w-1/4 h-12 object-cover rounded-lg mr-1.5 flex-shrink-0"
                        />
                        <div className="flex flex-col w-3/4">
                          <span className=" w-full text-textColor font-normal text-sm md:text-xs truncate">
                            {item.name}
                          </span>
                          <span className="mt-2 text-lightText text-xs">
                            {item.user?.name}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-full  ${
                          selectedCuration?._id === item._id
                            ? " "
                            : " border border-borderColor"
                        } `}
                        style={{ height: "1px" }}
                      ></div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div
              className="border ml-3 mt-4   mr-4 border-borderColor"
              style={{ width: "0.1px" }}
            ></div>
            <div className="flex-1  mr-5 mt-4">
              <div className="flex flex-col mb-1">
                <div className="flex flex-row items-center">
                  <p className="text-lg text-theme-secondaryText font-normal  font-inter">
                    {selectedCuration?.name}
                  </p>
                  {!isOwner && (
                    <div className="relative">
                      {isSavedMessageVisible && (
                        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg text-theme-secondaryText text-xs rounded-lg px-2 py-1">
                          {savedMessage}
                        </div>
                      )}
                      <div
                        className={`${
                          isSaved ? "bg-iconColor" : "bg-primary"
                        } px-2 py-0.5 rounded-xl ml-2 cursor-pointer`}
                        onClick={() => handleSaved(selectedCuration?._id)}
                      >
                        <img
                          src={isSaved ? SavedIcon : SaveIcon}
                          alt="save"
                          className="h-5 w-5"
                        />
                      </div>
                    </div>
                  )}
                  {isEditable && (
                    <img
                      src={AddIcon}
                      alt="add-icon"
                      className="dark:block hidden cursor-pointer ml-3"
                      onClick={() => handleChipOpen(selectedCuration?._id)}
                    />
                  )}
                  {isEditable && (
                    <img
                      src={AddIconLight}
                      alt="add-icon"
                      className="dark:hidden cursor-pointer ml-3"
                      onClick={() => handleChipOpen(selectedCuration?._id)}
                    />
                  )}
                  <img
                    src={Share}
                    alt="share"
                    className="w-7 h-7 text-primary ml-3 cursor-pointer"
                    onClick={handleShareOpen}
                  />
                </div>
                {selectedCuration?.description && (
                  <p className="text-textColor text-xs mt-1.5 mb-1 font-normal font-inter">
                    {selectedCuration?.description}
                  </p>
                )}
                <div className="flex flex-row justify-between mt-0.5 items-center mb-2">
                  <a
                    href={`https://${domainUrl}/profile/${selectedCuration.user.username}`}
                    className="text-center text-primary text-xs font-normal font-inter underline custom-underline-offset w-max cursor-pointer"
                    style={{ textUnderlineOffset: "2px" }}
                  >
                    {selectedCuration?.user?.name}
                  </a>
                  {/* <div>
                    <button className=" px-4 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Sort</button>
                    <button className="ml-2 mr-2 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Filter</button>
                  </div> */}
                </div>
              </div>
              {chipLoading ? (
                <ProfileItemsSkeleton />
              ) : chips.length === 0 ? (
                <div className="flex items-center mt-20">
                  <div
                    className="container rounded-md bg pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36"
                    style={{ marginRight: "auto" }}
                  >
                    <h3 className=" text-textColor text-sm">
                      (. ❛ ᴗ ❛.) Seems like this curation is empty
                    </h3>
                    <div className="mt-2 rounded-md bg-chipBackground pl-5 pt-4 pb-4 cursor-pointer">
                      <p
                        className=" text-textColor text-xs font-light"
                        onClick={handleEmptyCuration}
                      >
                        {myData?._id === selectedCuration?.user?._id ||
                        selectedCuration.visibility === "anyone"
                          ? "Add a Chip ->"
                          : `Explore more ->`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 500: 1, 800: 2, 1060: 3 }}
                >
                  <Masonry gutter="15px">
                    {chips.map((item, index) =>
                      item.user._id === myData._id ? (
                        <ProfileChips key={item._id} item={item} />
                      ) : (
                        <Chips key={item._id} item={item} />
                      )
                    )}
                  </Masonry>
                </ResponsiveMasonry>
              )}
            </div>
          </div>
        </>
      ) : curations.length > 0 ? (
        <div className="-ml-1 mt-4 xs:grid-cols-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 mr-6">
          {curations.map((curation, index) => (
            <div
              key={index}
              className={`flex flex-col items-start flex-shrink-0 cursor-pointer p-2 rounded-lg`}
              onClick={() => handleChipsPage(curation._id)}
            >
              <img
                className="rounded-xl object-cover w-full h-44 "
                src={curation.image}
                alt={curation.name}
              />
              <p
                className="text-theme-secondaryText text-sm mt-1  font-inter font-normal text-left overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  lineHeight: "1.5rem",
                  maxWidth: "192px",
                }}
              >
                {curation.name}
              </p>
              <a
                href={`https://${domainUrl}/profile/${curation?.user?.username}`}
                className="text-viewAll text-xs font-inter font-normal text-start w-max cursor-pointer"
                style={{ textUnderlineOffset: "2px" }}
              >
                {curation.user.name}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center mt-20">
          <div
            className="container rounded-md bg pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36"
            style={{ marginRight: "auto" }}
          >
            <h3 className=" text-textColor text-sm">
              Seems like this category is still unexplored.
            </h3>
            <div className="mt-2 rounded-md bg-chipBackground pl-6 pt-4 pb-4">
              <h3 className=" text-textColor">{explore}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurationsCategory;
