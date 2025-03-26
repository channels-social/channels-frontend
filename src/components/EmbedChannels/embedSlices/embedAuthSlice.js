import { createSlice } from "@reduxjs/toolkit";
import StorageManager from "../utility/storage_manager";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkAutoLogin = createAsyncThunk(
  "embed-auth/check-auto-login",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/check/auto/login",
        data
      );
      if (response.success) {
        const data = {
          token: response.token,
          user: response.user,
        };
        dispatch(setEmbedCredentials(data));
      }
    } catch (error) {
      console.error("Failed to check auto login:", error);
    }
  }
);

const initialState = {
  user: StorageManager.getItem("user")
    ? JSON.parse(StorageManager.getItem("user"))
    : null,
  token: StorageManager.getItem("auth_token") || null,
  isLoggedIn: !!StorageManager.getItem("auth_token"),
  isOnboarding: false,
};

const embedAuthSlice = createSlice({
  name: "embedAuth",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    setEmbedCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logOutEmbed: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      StorageManager.removeItem("auth_token");
      StorageManager.removeItem("user");
    },
    setOnboarding: (state, action) => {
      state.isOnboarding = action.payload;
    },
    initializeEmbedAuth: (state) => {
      const storedToken = StorageManager.getItem("auth_token");
      const storedUser = StorageManager.getItem("user");

      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        state.isLoggedIn = true;
      } else {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
      }
    },
  },
});

export const { setEmbedCredentials, logOutEmbed, initializeEmbedAuth } =
  embedAuthSlice.actions;
export default embedAuthSlice.reducer;
