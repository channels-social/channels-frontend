import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";

export const createChannel = createAsyncThunk(
  "channel/create-channel",
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel",
        channelData
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
export const updateChannel = createAsyncThunk(
  "channel/update-channel",
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/update/channel",
        channelData
      );
      console.log(response);
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
export const createGeneralTopic = createAsyncThunk(
  "channel/create-general-topic",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/create/general/topic", {
        channelId,
      });
      console.log(response);
      if (response.success) {
        return response.topic;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchMyChannels = createAsyncThunk(
  "channel/fetch-my-channels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/my/channels");
      if (response.success) {
        return response.channels;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const channelItemsSlice = createSlice({
  name: "channelItems",
  initialState: {
    channels: [],
    selectedChannel: null,
    channelstatus: "idle",
    topicstatus: false,
    selectedPage: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
    clearchannels: (state) => {
      state.channels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGeneralTopic.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(createGeneralTopic.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          state.channels[index].topics.unshift(topic);
        }
      })
      .addCase(createGeneralTopic.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createChannel.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.channels.unshift(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(updateChannel.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const channel = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === channel._id
        );
        if (index !== -1) {
          state.channels[index] = channel;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(fetchMyChannels.pending, (state) => {
        state.channelstatus = "loading";
      })
      .addCase(fetchMyChannels.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        state.channels = action.payload;
      })
      .addCase(fetchMyChannels.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        if (index !== -1) {
          state.channels[index].topics.unshift(topic);
        }
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let index = state.channels.findIndex(
          (item) => item._id === topic.channel
        );
        let topicIndex;
        if (index !== -1) {
          topicIndex = state.channels[index].topics.findIndex(
            (item) => item._id === topic._id
          );
          state.channels[index].topics[topicIndex].name = topic.name;
        }
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
      });
  },
});

export const { setSelectedCuration, setError, clearCurationChips } =
  channelItemsSlice.actions;

export default channelItemsSlice.reducer;
