import { combineReducers } from "@reduxjs/toolkit";
import authReducer, { logOut } from "../slices/authSlice";
import networkReducer from "../../components/context/Network/networkReducer";
import profileReducer from "../slices/profileSlice";
import myDataReducer from "../slices/myDataSlice";
import curationReducer from "../slices/curationSlice";
import chipReducer from "../slices/chipSlice";
import editChipReducer from "../slices/editChipSlice";
import profileItemsReducer from "./../slices/profileItemsSlice";
import imageCardsReducer from "./../slices/imageCardsSlice";
import modalReducer from "./../slices/modalSlice";
import deleteChipReducer from "./../slices/deleteChipSlice";
import deleteCurationReducer from "./../slices/deleteCurationSlice";
import galleryReducer from "./../slices/gallerySlice";
import curationPageReducer from "./../slices/curationPageSlice";
import savedReducer from "./../slices/savedSlice";
import chipItemReducer from "./../slices/chipItemSlice";
import curationEngagementReducer from "./../slices/curationEngagementSlice";
import chipEngagementReducer from "./../slices/chipEngagementSlice";
import profileEngagementReducer from "./../slices/profileEngagementSlice";
import searchItemsReducer from "./../slices/searchSlice";
import homeItemsReducer from "./../slices/homeSlice";
import categoryCurationReducer from "./../slices/categoryCurations";
import homeCardReducer from "./../slices/homeCardSlice";
import uiReducer from "./../slices/uiSlice";
import commentReducer from "./../slices/commentChipSlice";
import newsletterReducer from "./../slices/newsletterSlice";
import deleteCategoryReducer from "./../slices/deleteCategorySlice";
import pushItemsReducer from "./../slices/pushItemsSlice";
import themeReducer from "./../slices/themeSlice";
import createChannelReducer from "./../slices/createChannelSlice";
import createTopicReducer from "./../slices/createTopicSlice";
import topicReducer from "./../slices/topicSlice";
import channelItemsReducer from "./../slices/channelItemsSlice";
import channelReducer from "./../slices/channelSlice";
import FaqsReducer from "./../slices/faqsSlice";
import chatReducer from "./../slices/chatSlice";
import reorderTopicReducer from "./../slices/reorderTopicSlice";
import eventReducer from "./../slices/eventSlice";

export const appReducer = {
  auth: authReducer,
  network: networkReducer,
  profileData: profileReducer,
  myData: myDataReducer,
  curation: curationReducer,
  chip: chipReducer,
  editChip: editChipReducer,
  profileItems: profileItemsReducer,
  imageCards: imageCardsReducer,
  modals: modalReducer,
  chipDeletion: deleteChipReducer,
  curationDeletion: deleteCurationReducer,
  galleryData: galleryReducer,
  curationPage: curationPageReducer,
  saved: savedReducer,
  chipItem: chipItemReducer,
  curationEngagement: curationEngagementReducer,
  chipEngagement: chipEngagementReducer,
  profileEngagement: profileEngagementReducer,
  searchItems: searchItemsReducer,
  homeItems: homeItemsReducer,
  categoryCurations: categoryCurationReducer,
  homeCard: homeCardReducer,
  ui: uiReducer,
  commentChip: commentReducer,
  newsletter: newsletterReducer,
  categoryDeletion: deleteCategoryReducer,
  pushItems: pushItemsReducer,
  theme: themeReducer,
  createChannel: createChannelReducer,
  createTopic: createTopicReducer,
  channelItems: channelItemsReducer,
  topic: topicReducer,
  faqs: FaqsReducer,
  channel: channelReducer,
  chat: chatReducer,
  reorderTopic: reorderTopicReducer,
  event: eventReducer,
};

const combinedReducer = combineReducers(appReducer);

const rootReducer = (state, action) => {
  if (action.type === logOut.type) {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default rootReducer;
