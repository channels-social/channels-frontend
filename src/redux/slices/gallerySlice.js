import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateMyField } from "./myDataSlice";
import { setProfileEngagement } from "./profileEngagementSlice";

import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const fetchGallery = createAsyncThunk(
  "gallery/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/gallery/username",
        { username }
      );
      if (response.success) {
        return response.user;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleGallerySubscription = createAsyncThunk(
  "gallery/toggleSubscription",
  async (galleryData, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const myData = state.myData;
    const isSubscribed = galleryData.subscribers.includes(myData._id);
    dispatch(
      updateGalleryField({
        name: "subscribers",
        value: isSubscribed
          ? galleryData.subscribers.filter((id) => id !== myData._id)
          : [...galleryData.subscribers, myData._id],
      })
    );
    try {
      const response = await postRequestAuthenticated("/toggle/subscription", {
        receiverId: galleryData._id,
      });
      console.log(response);
      if (response.success) {
        // dispatch(
        //   updateProfileField({
        //     name: "subscribers",
        //     value: response.subscribers,
        //   })
        // );
        dispatch(
          updateMyField({
            name: "subscriptions",
            value: response.subscriptions,
          })
        );
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue("Error toggling subscription");
    } finally {
      dispatch(setProfileEngagement(galleryData._id));
    }
  }
);

const initialState = {
  _id: "",
  name: "",
  email: "",
  logo: "",
  username: "",
  description: "",
  links: [],
  location: "",
  contact: "",
  customText: "",
  customUrl: "",
  otherLink: "",
  imageCards: [],
  subscriptions: [],
  subscribers: [],
  status: "idle",
  error: null,
  activeTab: "profileDetails",
  usernameError: false,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setGalleryData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateGalleryField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearGalleryData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.status = "succeeded";
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setGalleryData, updateGalleryField, clearGalleryData } =
  gallerySlice.actions;

export default gallerySlice.reducer;

export const selectGallery = (state) => state.galleryData;
export const selectGalleryStatus = (state) => state.galleryData.status;
export const selectGalleryError = (state) => state.galleryData.error;
