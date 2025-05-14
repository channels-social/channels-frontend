import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  deleteChip,
  clearChipIdToDelete,
} from "../../../redux/slices/deleteChipSlice";

const DeleteChipModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalChipDeleteOpen);
  const chipIdToDelete = useSelector((state) => state.chipDeletion.chipId);
  const profile_category = useSelector(
    (state) => state.chipDeletion.profile_category
  );

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal("modalChipDeleteOpen"));
    dispatch(clearChipIdToDelete());
  };

  const handleDelete = () => {
    dispatch(deleteChip({ chipId: chipIdToDelete, profile_category }))
      .unwrap()
      .then(() => {
        dispatch(closeModal("modalChipDeleteOpen"));
        dispatch(clearChipIdToDelete());
      })
      .catch((error) => {
        console.error("Failed to delete chip:", error);
      });
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Delete Chip
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-normal font-inter">
                Do you really want to delete the chip?
              </div>
              <div className="flex flex-row mt-5 space-x-8">
                <button
                  className="w-full py-2.5 rounded-full text-theme-secondaryText bg-transparent border border-theme-secondaryText font-normal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full text-theme-primaryBackground bg-theme-secondaryText  font-normal"
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

export default DeleteChipModal;
