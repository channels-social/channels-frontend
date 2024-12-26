// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";

export const fetchTopicChats = createAsyncThunk(
  "channelChat/fetchChats",
  async (topicId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/topic/chats", {
        topicId,
      });
      console.log(response);
      if (response.success) {
        return response.chats;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createTopicChat = createAsyncThunk(
  "channelChat/createChat",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel/chat",
        data
      );
      console.log(response);
      if (response.success) {
        return response.chat;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChannelChatReply = createAsyncThunk(
  "channelChat/createChatReply",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/create/channel/chat/reply",
        data
      );
      if (response.success) {
        return response.chat;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const chatSlice = createSlice({
  name: "chatSlice ",
  initialState: {
    chats: [],
    chatStatus: "idle",
    chatError: null,
    isScroll: true,
    topic: null,
    channel: null,
    user: null,
    media: [],
    replyTo: null,
    replyUsername: "",
    poll: {},
    event: {},
    reactions: [],
    mentions: [],
    content: "",
  },
  reducers: {
    setChatField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addMediaItem: (state, action) => {
      state.media.push(action.payload);
    },
    removeMediaItem: (state, action) => {
      state.media = state.media.filter((_, index) => index !== action.payload);
    },
    clearChat: (state) => {
      state.user = null;
      state.media = [];
      state.replyTo = null;
      state.poll = {};
      state.event = {};
      state.reactions = [];
      state.mentions = [];
      state.content = "";
      state.replyUsername = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicChats.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(fetchTopicChats.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        state.chats = action.payload;
      })
      .addCase(fetchTopicChats.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      });
  },
});

export const { setChatField, addMediaItem, removeMediaItem, clearChat } =
  chatSlice.actions;

export default chatSlice.reducer;
