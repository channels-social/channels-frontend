import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const removeCover = createAsyncThunk(
  "channel/remove-cover",
  async (channel, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/channel/cover",
        channel
      );
      if (response.success) {
        return response.channel;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const saveCover = createAsyncThunk(
  "channel/save-cover",
  async (channel, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/save/channel/cover",
        channel
      );
      if (response.success) {
        return response.channel;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const channelSlice = createSlice({
  name: "channel",
  initialState: {
    _id: "",
    name: "",
    visibility: "anyone",
    members: [],
    cover_image: null,
    admins: [],
    paywall: false,
    topics: [],
    logo: null,
    description: "",
    channelstatus: "idle",
    channelNameError: false,
  },
  reducers: {
    setSelectedUnsplashImage: (state, action) => {
      state.cover_image = action.payload;
      state.imageSource = "unsplash";
    },
    setChannelItems: (state, action) => {
      return { ...state, ...action.payload };
    },
    setChannelField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    clearChannel: (state) => {
      state.name = "";
      state._id = "";
      state.visibility = "anyone";
      state.cover_image = null;
      state.logo = null;
      state.cover_image = null;
      state.visibility = [];
      state.admins = [];
      state.editability = [];
      state.members = [];
      state.name = "";
      state.description = "";
      state.channelstatus = "idle";
      state.channelNameError = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeCover.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(removeCover.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.cover_image = "";
      })
      .addCase(removeCover.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(saveCover.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(saveCover.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.cover_image = action.payload.cover_image;
      })
      .addCase(saveCover.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      });
    // .addCase(updateChannel.pending, (state) => {
    //   state.channelstatus = "loading";
    // })
    // .addCase(updateChannel.fulfilled, (state, action) => {
    //   state.channelstatus = "idle";
    // })
    // .addCase(updateChannel.rejected, (state, action) => {
    //   state.channelstatus = "idle";
    //   state.channelNameError = action.payload || action.error.message;
    // });
  },
});

export const {
  setSelectedUnsplashImage,
  setChannelField,
  clearChannel,
  setChannelItems,
} = channelSlice.actions;

export default channelSlice.reducer;
