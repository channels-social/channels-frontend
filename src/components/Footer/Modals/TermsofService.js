import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";

const TermsofService = () => {
  const [markdown, setMarkdown] = useState("");

  const dispatch = useDispatch();
  const isOpenTerms = useSelector((state) => state.modals.modalTermsOpen);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Chips-social/chips-constants/main/terms-of-service.md"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => setMarkdown(text))
      .catch((error) => {
        console.error("Error fetching markdown file:", error);
        setMarkdown("Failed to load privacy policy.");
      });
  }, []);

  const handleTermsClose = () => {
    dispatch(closeModal("modalTermsOpen"));
  };
  const handleOverlayClick = () => {
    dispatch(closeModal("modalTermsOpen"));
  };

  if (!isOpenTerms) return null;

  return (
    <Dialog.Root open={isOpenTerms}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 z-60"
          onClick={handleOverlayClick}
        />
        <div className="fixed inset-0  flex items-center justify-center">
          <Dialog.Content
            className="dark:bg-primaryBackground-dark rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[75%] overflow-y-auto custom-scrollbar w-3/4 md:w-1/2  py-5 pl-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />

            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4 pr-3">
                <h2 className="text-white text-lg font-normal font-inter ">
                  Terms of Service
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-6 h-6 cursor-pointer"
                  onClick={handleTermsClose}
                />
              </div>
              <div
                className="flex-grow overflow-y-auto dark:text-secondaryText-dark text-sm font-inter"
                style={{ lineHeight: "1.5" }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TermsofService;
