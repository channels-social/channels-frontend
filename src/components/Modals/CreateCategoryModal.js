import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCategoryField,
  createCategory,
  updateCategory,
  clearCategory,
} from "../../redux/slices/profileItemsSlice";
import { closeModal } from "../../redux/slices/modalSlice";

const CreateCategoryModal = () => {
  const [error, setError] = useState("");

  const handleClose = () => {
    setError("");
    dispatch(updateCategoryField({ field: "name", value: "" }));
    dispatch(updateCategoryField({ field: "_id", value: "" }));
    dispatch(updateCategoryField({ field: "expanded", value: true }));
    dispatch(closeModal("modalCreateCategoryOpen"));
  };

  const dispatch = useDispatch();
  const profileItems = useSelector((state) => state.profileItems);

  const categorystatus = profileItems.categoryStatus;

  const handleChange = (e) => {
    dispatch(updateCategoryField({ field: "name", value: e.target.value }));
  };

  const isOpen = useSelector((state) => state.modals.modalCreateCategoryOpen);
  const isNameEmpty = profileItems.category.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
    : "dark:bg-secondaryText-dark dark:text-primaryBackground-dark";

  const handleCreateCategory = () => {
    setError("");
    dispatch(createCategory(profileItems.category))
      .unwrap()
      .then(() => {
        handleClose();
        dispatch(clearCategory());
      })
      .catch((error) => {
        setError(error);
      });
  };
  const handleEditCategory = () => {
    setError("");
    dispatch(updateCategory(profileItems.category))
      .unwrap()
      .then(() => {
        handleClose();
        dispatch(clearCategory());
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="dark:bg-secondaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[80%] overflow-y-auto custom-scrollbar w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="dark:text-secondaryText-dark text-lg font-normal fonr-inter">
                  {profileItems.type === "edit"
                    ? "Edit Category"
                    : "New category"}
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-4">
                <p className="dark:text-secondaryText-dark text-sm font-light font-inter">
                  Name of the category
                </p>
                <input
                  id="category-name"
                  className="w-full mt-3 text-md font-normal p-1 rounded dark:bg-transparent border-b dark:border-b-chatDivider-dark placeholder:font-light 
                  placeholder:text-sm dark:text-secondaryText-dark focus:outline-none placeholder:text-primaryText-dark"
                  type="text"
                  value={profileItems.category.name}
                  onChange={handleChange}
                  autocomplete="off"
                  placeholder="Example: About, Products, Events, FAQ, etc"
                />
              </div>
              {error && (
                <p className="text-center my-2 dark:text-error-dark text-xs font-normal">
                  {error}
                </p>
              )}
              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-full ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={
                  profileItems.type === "edit"
                    ? handleEditCategory
                    : handleCreateCategory
                }
              >
                {categorystatus === "loading"
                  ? "Please wait..."
                  : profileItems.type === "edit"
                  ? "Save Changes"
                  : "Create new category"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateCategoryModal;
