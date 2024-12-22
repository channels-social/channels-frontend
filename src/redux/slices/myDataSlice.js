import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const updateProfile = createAsyncThunk(
  "myData/updateProfile",
  async (updatedProfileData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/update/profile",
        updatedProfileData
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
  updatestatus: "idle",
  updateerror: null,
};

const myDataSlice = createSlice({
  name: "myData",
  initialState,
  reducers: {
    setMyData: (state, action) => {
      return { ...initialState, ...action.payload };
    },
    updateMyField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    clearMyData: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updatestatus = "loading";
        state.updateerror = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updatestatus = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatestatus = "failed";
        state.updateerror = action.payload || action.error.message;
      });
  },
});

export const { setMyData, updateMyField, clearMyData } = myDataSlice.actions;

export default myDataSlice.reducer;

export const fetchMyData = () => async (dispatch, getState) => {
  const { auth } = getState();
  if (!auth.token) {
    return;
  }
  try {
    const response = await postRequestAuthenticated("/fetch/userData");
    if (response.success) {
      dispatch(setMyData(response.user));
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};
