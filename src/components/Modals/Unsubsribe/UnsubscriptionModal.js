import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  UnsubscribeProfile,
  fetchmySubscriptions,
} from "./../../../redux/slices/homeSlice";

const UnsubscriptionModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalUnsubscriptionOpen);
  const username = useSelector((state) => state.modals.shareUsername);
  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal("modalUnsubscriptionOpen"));
  };

  const handleUnsubscribe = () => {
    dispatch(UnsubscribeProfile(username))
      .unwrap()
      .then(() => {
        dispatch(closeModal("modalUnsubscriptionOpen"));
        dispatch(fetchmySubscriptions());
      })
      .catch((error) => {
        console.error("Failed to unsubscribe profile:", error);
      });
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  Action Confirmation
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-normal font-inter">
                <div
                  className="text-textFieldColor text-sm font-normal font-inter tracking-wide"
                  style={{ lineHeight: "1.5" }}
                >
                  Are you sure you want to unsubscribe to {username}. Once you
                  unsubscribe, you will stop receiving updates from them. You
                  can go back to their profile to subscribe again.{" "}
                </div>
              </div>
              <div className="flex flex-row mt-5 space-x-12">
                <button
                  className="w-4/5 py-2.5  rounded-full text-buttonText bg-primary  font-normal"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="w-full py-2.5 rounded-full text-primary bg-chipBackground border border-primary font-normal"
                  onClick={handleUnsubscribe}
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default UnsubscriptionModal;
