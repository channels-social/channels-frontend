import { React, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import AddIcon from "../../../assets/icons/add-icon.svg";
import Category from "../../../assets/icons/category.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  pushItemToCategory,
  clearItems,
  updateItemField,
  fetchCategories,
} from "../../../redux/slices/pushItemsSlice";
import useModal from "./../../hooks/ModalHook";

const PushtoCategoryModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isOpen = useSelector((state) => state.modals.modalPushtoCategoryOpen);
  const dispatch = useDispatch();
  const pushItems = useSelector((state) => state.pushItems);

  const selectedCategoryId = useSelector(
    (state) => state.pushItems.selectedCategoryId
  );
  const { handleOpenModal } = useModal();
  const { categories } = useSelector((state) => state.pushItems);

  const handleClose = () => {
    dispatch(clearItems());
    handleClear();
    dispatch(closeModal("modalPushtoCategoryOpen"));
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleChange = (id) => {
    dispatch(updateItemField({ field: "selectedCategoryId", value: id }));
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleCategoryOpenModal = () => {
    handleOpenModal("modalCreateCategoryOpen");
  };

  const handlePushtoCategory = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", pushItems.id);
    formDataToSend.append("type", pushItems.type);
    formDataToSend.append("categoryId", pushItems.selectedCategoryId);
    dispatch(pushItemToCategory(formDataToSend))
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="dark:bg-tertiaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[80%]  w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="dark:text-secondaryText-dark text-lg font-normal font-inter">
                  Push Chip
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div
                className="flex flex-row mt-2 cursor-pointer w-max"
                onClick={handleCategoryOpenModal}
              >
                <div className="dark:bg-primaryBackground-dark rounded-full p-1">
                  <img src={AddIcon} alt="add" className="w-4 h-4" />
                </div>
                <p className="dark:text-secondaryText-dark ml-2 tracking-wide text-sm font-light font-inter">
                  Create a new category
                </p>
              </div>
              <h2 className="mt-5 dark:text-primaryText-dark text-sm font-light font-inter mb-1">
                Choose Category
              </h2>
              <div className="mt-1.5 relative w-full">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-[45%] transform -translate-y-1/2 dark:text-primaryText-dark w-4 h-4"
                />
                {searchQuery && (
                  <img
                    src={Close}
                    alt="Close"
                    className="absolute top-1/2 right-2 cursor-pointer transform -translate-y-1/2 w-5 h-5"
                    onClick={handleClear}
                  />
                )}
                <input
                  type="text"
                  placeholder="Search"
                  className={` pl-10 pr-3 py-3 mb-2 border dark:border-chatDivider-dark dark:bg-transparent dark:text-secondaryText-dark 
                    placeholder:dark:text-primaryText-dark ${"rounded-lg"}
                                placeholder:text-left focus:outline-none w-full font-inter font-normal flex `}
                  style={{ fontSize: "15px" }}
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4 overflow-y-auto custom-scrollbar max-h-60">
                {filteredCategories?.map(
                  (category, index) =>
                    category._id !== pushItems.exisitingCategoryId && (
                      <div className="flex flex-col mb-4">
                        <div
                          className={`flex flex-row items-center cursor-pointer ${
                            selectedCategoryId === category._id
                              ? "border dark:border-secondaryText-dark rounded-lg p-2"
                              : "pl-2"
                          }`}
                          onClick={() => handleChange(category._id)}
                        >
                          <img
                            src={category.name !== "" ? Category : Close}
                            alt=""
                            className="w-4 h-4"
                          />
                          <p
                            className={`ml-3 ${
                              category.name !== ""
                                ? "dark:text-secondaryText-dark"
                                : "dark:text-error-dark"
                            } text-sm font-normal tracking-wide`}
                          >
                            {category.name !== ""
                              ? category.name
                              : "Remove from category"}
                          </p>
                        </div>
                        {selectedCategoryId !== category._id && (
                          <div className="border-t dark:border-chatDivider-dark w-full mt-3"></div>
                        )}
                      </div>
                    )
                )}
              </div>

              {
                <button
                  className={`w-full mt-3 py-2.5 font-normal text-sm rounded-full dark:bg-secondaryText-dark dark:text-primaryBackground-dark`}
                  onClick={handlePushtoCategory}
                >
                  {selectedCategoryId === "" ? "Update" : "Save to Category"}
                </button>
              }
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PushtoCategoryModal;
