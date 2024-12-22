import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { updateMyField } from "./myDataSlice";
import {
  setProfileEngagement,
  setProfileSubscription,
} from "./profileEngagementSlice";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
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

export const toggleSubscription = createAsyncThunk(
  "profile/toggleSubscription",
  async (profileData, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const myData = state.myData;
    const isSubscribed = profileData.subscribers.includes(myData._id);
    dispatch(
      updateProfileField({
        name: "subscribers",
        value: isSubscribed
          ? profileData.subscribers.filter((id) => id !== myData._id)
          : [...profileData.subscribers, myData._id],
      })
    );
    try {
      const response = await postRequestAuthenticated("/toggle/subscription", {
        receiverId: profileData._id,
      });
      // console.log(response);
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
      dispatch(setProfileEngagement(profileData._id));
      dispatch(setProfileSubscription(profileData._id));
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearProfileData: () => initialState,
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.status = "succeeded";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  setProfileData,
  updateProfileField,
  clearProfileData,
  setActiveTab,
} = profileSlice.actions;

export default profileSlice.reducer;

export const selectProfile = (state) => state.profileData;
export const selectProfileStatus = (state) => state.profileData.status;
export const selectProfileError = (state) => state.profileData.error;
