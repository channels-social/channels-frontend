// src/redux/slices/modalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalLoginOpen: false,
  modalChannelOpen: false,
  modalTopicOpen: false,
  modalChipOpen: false,
  modalChipEditOpen: false,
  modalCustomTagOpen: false,
  modalOnboardOpen: false,
  modalUnsplashModalOpen: false,
  modalChannelUnsplashOpen: false,
  modalChannelCoverOpen: false,
  modalNewsletterUnsplashOpen: false,
  modalSaveChipOpen: false,
  modalPrivacyOpen: false,
  modalTermsOpen: false,
  modalLogoutOpen: false,
  modalChipDeleteOpen: false,
  modalCurationDeleteOpen: false,
  modalChatDeleteOpen: false,
  modalShareOpen: false,
  modalShareChipOpen: false,
  modalShareChannelOpen: false,
  modalShareProfileOpen: false,
  modalTokenExpiryOpen: false,
  modalUnsubscriptionOpen: false,
  modalMySubscribersOpen: false,
  modalCreateCategoryOpen: false,
  modalCategoryDeleteOpen: false,
  modalPushtoCategoryOpen: false,
  modalPushtoCurationOpen: false,
  modalCategoryReorderOpen: false,
  modalFaqDeleteOpen: false,
  shareLink: "",
  shareUsername: "",
  modalDocumentOpen: false,
  modalCommentOpen: false,
  document: null,
  isLoginMode: false,
  profileId: "",
  channelId: "",
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setLoginMode: (state, action) => {
      state.isLoginMode = action.payload;
    },
    openModal: (state, action) => {
      const { modalName, link } = action.payload;
      state[modalName] = true;
      if (
        modalName === "modalShareChipOpen" ||
        modalName === "modalShareProfileOpen"
      ) {
        state.shareLink = link;
      }
      if (modalName === "modalUnsubscriptionOpen") {
        state.shareUsername = link;
      }
      if (modalName === "modalMySubscribersOpen") {
        state.profileId = link;
      }
      if (modalName === "modalShareChannelOpen") {
        state.channelId = link;
      }
      if (modalName === "modalDocumentOpen") {
        state.document = {
          url: link.url,
          name: link.name,
          pages: link.pages,
        };
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      state[modalName] = false;
      if (
        modalName === "modalShareChipOpen" ||
        modalName === "modalShareProfileOpen"
      ) {
        state.shareLink = "";
      }
      if (modalName === "modalUnsubscriptionOpen") {
        state.shareUsername = "";
      }
      if (modalName === "modalDocumentOpen") {
        state.document = null;
      }
      if (modalName === "modalMySubscribersOpen") {
        state.profileId = "";
      }
      if (modalName === "modalShareChannelOpen") {
        state.channelId = "";
      }
    },
  },
});

export const { openModal, closeModal, setLoginMode } = modalSlice.actions;

export default modalSlice.reducer;
