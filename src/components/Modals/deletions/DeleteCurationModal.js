import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  deleteCuration,
  clearCurationIdToDelete,
} from "../../../redux/slices/deleteCurationSlice";
import { fetchProfileItems } from "./../../../redux/slices/profileItemsSlice";
import { useNavigate } from "react-router-dom";

const DeleteCurationModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalCurationDeleteOpen);
  const curationIdToDelete = useSelector(
    (state) => state.curationDeletion.curationId
  );
  const myData = useSelector((state) => state.myData);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal("modalCurationDeleteOpen"));
    dispatch(clearCurationIdToDelete());
  };

  const handleDelete = () => {
    dispatch(deleteCuration(curationIdToDelete))
      .unwrap()
      .then(() => {
        dispatch(closeModal("modalCurationDeleteOpen"));
        dispatch(clearCurationIdToDelete());
        dispatch(fetchProfileItems(myData._id));
        navigate(`/profile/${myData.username}`);
      })
      .catch((error) => {
        console.error("Failed to delete curation:", error);
      });
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="dark:bg-tertiaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="dark:text-secondaryText-dark text-lg font-normal fonr-inter">
                  Delete Curation
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 dark:text-secondaryText-dark font-normal font-inter">
                Do you really want to delete the curation? It will also delete
                all chips under it.
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full dark:text-secondaryText-dark dark:bg-transparent border dark:border-secondaryText-dark font-normal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full dark:text-primaryBackground-dark dark:bg-secondaryText-dark  font-normal"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteCurationModal;
