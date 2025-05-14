import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";
import { updateTopicsOrder, removeMember } from "./reorderTopicSlice";
import { joinChannel } from "./channelSlice";

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
export const fetchChannels = createAsyncThunk(
  "channel/fetch-channels",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/channels", {
        username,
      });
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
export const fetchEmbedChannels = createAsyncThunk(
  "channel/fetch-embed-channels",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/embed/channels",
        data
      );
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
export const fetchUserChannels = createAsyncThunk(
  "channel/fetch-user-channels",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/user/channels",
        { username }
      );
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
export const fetchCommunityChannel = createAsyncThunk(
  "channel/fetch-community-channels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/community/channel"
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

const channelItemsSlice = createSlice({
  name: "channelItems",
  initialState: {
    channels: [],
    userChannels: [],
    selectedChannel: null,
    channelstatus: "idle",
    topicstatus: false,
    selectedPage: null,
    loading: false,
    error: null,
    communityChannel: null,
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
        let index2 = state.userChannels.findIndex(
          (item) => item._id === channel._id
        );
        if (index2 !== -1) {
          state.userChannels[index] = channel;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.channelstatus = "idle";
        state.channelNameError = action.payload || action.error.message;
      })

      .addCase(joinChannel.fulfilled, (state, action) => {
        state.channelstatus = "idle";
        const response = action.payload;
        if (response.success && response.visit) {
          const channelId = response.channel._id;
          let index = state.channels.findIndex(
            (item) => item._id === channelId
          );
          if (index === -1) {
            state.channels.push(response.channel);
          }
        }
      })
      .addCase(fetchMyChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchMyChannels.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(fetchEmbedChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmbedChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchEmbedChannels.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(fetchUserChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.userChannels = action.payload;
      })
      .addCase(fetchUserChannels.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(fetchCommunityChannel.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommunityChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.communityChannel = action.payload;
      })
      .addCase(fetchCommunityChannel.rejected, (state, action) => {
        state.loading = false;
        state.channelNameError = action.payload || action.error.message;
      })
      .addCase(createTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(updateTopicsOrder.fulfilled, (state, action) => {
        state.status = "idle";
        const topicData = action.payload;
        const channelId = topicData.channelId;
        const topics = topicData.topics;
        let index = state.channels.findIndex((item) => item._id === channelId);
        if (index !== -1) {
          state.channels[index].topics = topics;
        }
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
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let channelIndex = state.channels.findIndex(
          (channel) => channel._id === removeData.channelId
        );
        if (channelIndex !== -1) {
          let memberIndex = state.channels[channelIndex].members.findIndex(
            (member) => member === removeData.userId
          );
          if (memberIndex !== -1) {
            state.channels[channelIndex].members.splice(memberIndex, 1);
          }
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
