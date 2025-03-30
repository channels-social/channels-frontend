import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { joinChannel } from "./channelSlice";

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
export const updateWhatsAppNumber = createAsyncThunk(
  "myData/updateWhatsAppNumber",
  async (number, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/whatsapp/number",
        { number }
      );
      if (response.success) {
        return number;
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
  channel_subscriptions: [],
  subscribers: [],
  updatestatus: "idle",
  updateerror: null,
  whatsapp_number: "",
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
      .addCase(updateWhatsAppNumber.pending, (state) => {
        state.updatestatus = "loading";
        state.updateerror = null;
      })
      .addCase(updateWhatsAppNumber.fulfilled, (state, action) => {
        state.updatestatus = "succeeded";
        state.whatsapp_number = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updatestatus = "failed";
        state.updateerror = action.payload || action.error.message;
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if (response.success && response.visit) {
          if (!state.channel_subscriptions.includes(response.channel._id)) {
            state.channel_subscriptions.push(response.channel._id);
          }
        }
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
  // console.log(auth);
  try {
    const response = await postRequestAuthenticated("/fetch/userData");
    console.log(response);
    if (response.success) {
      dispatch(setMyData(response.user));
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};
