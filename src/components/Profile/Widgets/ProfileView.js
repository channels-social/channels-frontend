import { React, useEffect, useState, useRef } from "react";
import Chips from "./../../chips/Chips";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import CurationMansonry from "./../../curations/CurationMansonry";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  fetchProfileItems,
  fetchGalleryItems,
  clearItems,
  updateCategoryField,
  updateField,
} from "../../../redux/slices/profileItemsSlice";
import {
  setCategoryIdToDelete,
  setCategoryNameToDelete,
} from "../../../redux/slices/deleteCategorySlice";
import { updateReorderItems } from "../../../redux/slices/pushItemsSlice";
import AddIcon from "../../../assets/icons/addIcon.svg";
import DropDown from "../../../assets/icons/arrow_drop_down.svg";
import { useDispatch, useSelector } from "react-redux";
import ProfileItemsSkeleton from "./../../skeleton/profileItemsSkeleton";
import EmptyItemsCard from "./EmptyItemsCard";
import ProfileChips from "./../../chips/ProfileChips";
import useModal from "./../../hooks/ModalHook";
import { setCurationField } from "../../../redux/slices/curationSlice";
import { setChipField } from "../../../redux/slices/chipSlice";
import ChipIcon from "../../../assets/icons/chip_icon.svg";
import CurationIcon from "../../../assets/icons/curation_icon.svg";
import Edit from "../../../assets/icons/Edit.svg";
import Delete from "../../../assets/icons/Delete.svg";
import DragDrop from "../../../assets/icons/dragdrop.png";

const MasonryItem = ({ item, owner, gallery, enableReorder }) => {
  if (item.type === "curation") {
    return (
      <div className="curation-item ">
        <CurationMansonry curation={item} owner={owner} gallery={gallery} />
      </div>
    );
  } else if (item.type === "chip") {
    return (
      <div className="chip-item ">
        {owner ? <ProfileChips item={item} /> : <Chips item={item} />}
      </div>
    );
  }
  return null;
};

const CategorySection = ({
  category,
  owner,
  gallery,
  enableReorder,
  provided,
  items,
}) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownDotOpen, setIsDropdownDotOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefDot = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const handleClickOutside2 = (event) => {
    if (
      dropdownRefDot.current &&
      !dropdownRefDot.current.contains(event.target)
    ) {
      setIsDropdownDotOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isDropdownDotOpen) {
      document.addEventListener("mousedown", handleClickOutside2);
    } else {
      document.removeEventListener("mousedown", handleClickOutside2);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [isDropdownDotOpen]);

  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const handleChipOpen = (id) => {
    if (isLoggedIn) {
      dispatch(setChipField({ field: "profile_category", value: id }));
      handleOpenModal("modalChipOpen");
    } else {
      openLoginModal();
    }
  };
  const handleCurationOpen = (id) => {
    if (isLoggedIn) {
      dispatch(setCurationField({ field: "profile_category", value: id }));
      handleOpenModal("modalCurationOpen");
    } else {
      openLoginModal();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownDot = () => {
    setIsDropdownDotOpen(!isDropdownDotOpen);
  };

  const handleDeleteModal = (category) => {
    if (isLoggedIn) {
      setIsDropdownDotOpen(false);
      dispatch(setCategoryIdToDelete(category._id));
      dispatch(setCategoryNameToDelete(category.name));
      handleOpenModal("modalCategoryDeleteOpen");
    } else {
      openLoginModal();
    }
  };
  const handleEditModal = (category) => {
    if (isLoggedIn) {
      setIsDropdownDotOpen(false);
      dispatch(updateCategoryField({ field: "name", value: category.name }));
      dispatch(updateCategoryField({ field: "_id", value: category._id }));
      dispatch(
        updateCategoryField({ field: "expanded", value: category.expanded })
      );
      dispatch(
        updateCategoryField({ field: "expanded", value: category.expanded })
      );
      dispatch(updateField({ field: "type", value: "edit" }));
      handleOpenModal("modalCreateCategoryOpen");
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="mb-12 flex flex-col border dark:border-chatDivider-dark rounded-lg px-3 pb-3">
      {items.length > 1 && (
        <div className="flex flex-row items-center  space-x-4 py-3 relative mb-2">
          <div className="text-white text-2xl font-normal font-familjen-grotesk -mt-1">
            {category.name || "All"}
          </div>
          <div className="relative">
            {owner && category.name && (
              <img
                src={AddIcon}
                alt="add-icon"
                className="cursor-pointer"
                onClick={toggleDropdown}
              />
            )}
            {isDropdownOpen && category.name && (
              <div
                ref={dropdownRef}
                className="absolute  top-8 left-0  w-28 rounded-md shadow-lg dark:bg-tertiaryBackground-dark dark:border-chatDivider-dark  ring-1 ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div
                    className="flex flex-row px-3 items-center cursor-pointer"
                    onClick={() => handleChipOpen(category._id)}
                  >
                    <img src={ChipIcon} alt="edit" className="w-4 h-4" />
                    <p
                      className="block px-2 py-2 text-sm dark:text-secondaryText-dark "
                      role="menuitem"
                    >
                      Chip
                    </p>
                  </div>
                  <div
                    className="flex flex-row px-3 items-center cursor-pointer"
                    onClick={() => handleCurationOpen(category._id)}
                  >
                    <img src={CurationIcon} alt="edit" className="w-4 h-4" />
                    <p
                      className="block px-2 py-2 text-sm dark:text-secondaryText-dark "
                      role="menuitem"
                    >
                      Curation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative flex">
            {owner && category.name && (
              <div
                className="flex flex-col space-y-1 cursor-pointer"
                onClick={toggleDropdownDot}
              >
                <div className="w-1 h-1 dark:bg-emptyEvent-dark rounded-full"></div>
                <div className="w-1 h-1 dark:bg-emptyEvent-dark rounded-full"></div>
                <div className="w-1 h-1 dark:bg-emptyEvent-dark rounded-full"></div>
              </div>
            )}
            {isDropdownDotOpen && (
              <div
                ref={dropdownRefDot}
                className="absolute left-0 top-6  w-28 rounded-md shadow-lg dark:bg-tertiaryBackground-dark dark:border-chatDivider-dark ring-1
                    ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div
                    className="flex flex-row px-3 items-center"
                    onClick={() => handleEditModal(category)}
                  >
                    <img src={Edit} alt="edit" className="w-3 h-3 mr-2" />
                    <p
                      className="block ml-1 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                      role="menuitem"
                    >
                      Edit
                    </p>
                  </div>
                  <div
                    className="flex flex-row px-3 items-center"
                    onClick={() => handleDeleteModal(category)}
                  >
                    <img src={Delete} alt="edit" className="w-4 h-4 mr-2" />
                    <p
                      className="block  ml-1 py-2 text-sm dark:text-secondaryText-dark cursor-pointer"
                      role="menuitem"
                    >
                      Delete
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="border border-primary rounded-full p-0.5 absolute right-4 items-center">
            <img src={DropDown} alt="drop-down" className="w-5 h-5" />
          </div> */}
        </div>
      )}
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          default: 4,
          1500: 4,
          1150: 3,
          1100: 4,
          900: 3,
          700: 2,
          600: 2,
          460: 2,
          300: 1,
        }}
      >
        <Masonry
          gutter="18px"
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {category.items.map((item, index) => (
            <Draggable
              key={item._id}
              draggableId={item._id}
              index={index}
              isDragDisabled={!enableReorder}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <MasonryItem
                    key={item._id}
                    item={item}
                    owner={owner}
                    enableReorder={enableReorder}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

const ProfileView = ({ gallery, owner, enableReorder }) => {
  const profileData = useSelector((state) => state.profileData);
  const galleryData = useSelector((state) => state.galleryData);

  const dispatch = useDispatch();

  const {
    items: initialItems,
    status,
    error,
  } = useSelector((state) => state.profileItems);

  const fetchedOnce = useSelector((state) => state.profileItems.fetchedOnce);

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    if (!gallery && profileData._id && !fetchedOnce) {
      dispatch(fetchProfileItems(profileData._id));
    } else if (gallery && galleryData.username && !fetchedOnce) {
      dispatch(fetchGalleryItems(galleryData.username));
    }
  }, [dispatch, profileData._id, galleryData.username, gallery, fetchedOnce]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceCategoryIndex = source.droppableId;
    const destinationCategoryIndex = destination.droppableId;
    if (sourceCategoryIndex === destinationCategoryIndex) return;
    const sourceCategory = items[sourceCategoryIndex];
    const destinationCategory = items[destinationCategoryIndex];
    const draggedItem = sourceCategory.items.find(
      (item) => item._id === draggableId
    );
    const { type } = draggedItem;
    const newSourceItems = [...sourceCategory.items];
    newSourceItems.splice(source.index, 1);
    const newDestinationItems = [...destinationCategory.items];
    newDestinationItems.splice(destination.index, 0, draggedItem);
    const newItems = [...items];
    newItems[sourceCategoryIndex] = {
      ...sourceCategory,
      items: newSourceItems,
    };
    newItems[destinationCategoryIndex] = {
      ...destinationCategory,
      items: newDestinationItems,
    };

    setItems(newItems);
    dispatch(
      updateReorderItems({
        itemId: draggableId,
        newCategoryId: destinationCategory._id,
        type,
      })
    );
  };

  if (status === "loading" && !fetchedOnce) {
    return <ProfileItemsSkeleton />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (status === "success" && items.length === 0 && owner) {
    return <EmptyItemsCard />;
  }

  return (
    <div className="w-full flex flex-col mt-4 rounded-md">
      <DragDropContext onDragEnd={handleDragEnd}>
        {items.map((category, index) => (
          <Droppable key={category._id} droppableId={String(index)}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <CategorySection
                  key={category._id}
                  category={category}
                  owner={owner}
                  enableReorder={enableReorder}
                  gallery={gallery}
                  provided={provided}
                  items={items}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default ProfileView;
