import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { updateChannel } from "./channelItemsSlice";
import { createGeneralTopic } from "./channelItemsSlice";

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
export const fetchChannel = createAsyncThunk(
  "channel/fetch-channel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/channel", {
        id: id,
      });
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

export const createChannelInvite = createAsyncThunk(
  "channel/create-channel-invite",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/channel/invite",
        {
          channelId: id,
        }
      );
      if (response.success) {
        return response.invite;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinChannel = createAsyncThunk(
  "channel/join-channel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/join/channel", {
        channelId: id,
      });
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
export const joinChannelInvite = createAsyncThunk(
  "channel/join-channel-invite",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/join/channel/invite",
        data
      );
      if (response.success) {
        return response.channelId;
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
  isEdit: false,
  code: "",
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    // setSelectedUnsplashImage: (state, action) => {
    //   state.cover_image = action.payload;
    //   state.imageSource = "unsplash";
    // },
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
      state.isEdit = false;
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
      })
      .addCase(createGeneralTopic.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const topic = action.payload;
        state.topics.unshift(topic._id);
      })
      .addCase(fetchChannel.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(fetchChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        Object.assign(state, initialState, action.payload);
      })
      .addCase(fetchChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
      });
  },
});

export const {
  setSelectedUnsplashImage,
  setChannelField,
  clearChannel,
  setChannelItems,
} = channelSlice.actions;

export default channelSlice.reducer;
