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
export const deleteTopicChat = createAsyncThunk(
  "channelChat/deleteChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/topic/chat", {
        id: id,
      });
      console.log(response);
      if (response.success) {
        return response.id;
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
export const pushToResource = createAsyncThunk(
  "channelChat/pushtoresource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/push/to/resource",
        data
      );
      const resourceData = {
        chatId: response.chatId,
        mediaId: response.mediaId,
      };
      if (response.success) {
        return resourceData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeFromResource = createAsyncThunk(
  "channelChat/removefromresource",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/from/resource",
        data
      );
      const resourceData = {
        chatId: response.chatId,
        mediaId: response.mediaId,
      };
      if (response.success) {
        return resourceData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const makeReaction = createAsyncThunk(
  "channelChat/make-reaction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/make/reaction", data);
      console.log(response);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeReaction = createAsyncThunk(
  "channelChat/remove-reaction",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/remove/reaction", data);
      if (response.success) {
        return response;
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
    chatReplyId: "",
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
    clearChatIdToDelete: (state, action) => {
      state.chatReplyId = "";
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
      state.chatReplyId = "";
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
      })
      .addCase(pushToResource.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(pushToResource.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const mediaData = action.payload;
        let index = state.chats.findIndex(
          (item) => item._id === mediaData.chatId
        );
        if (index !== -1) {
          let mediaIndex = state.chats[index].media.findIndex(
            (item) => item._id === mediaData.mediaId
          );
          state.chats[index].media[mediaIndex].resource = true;
        }
      })
      .addCase(pushToResource.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(removeFromResource.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(removeFromResource.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const mediaData = action.payload;
        let index = state.chats.findIndex(
          (item) => item._id === mediaData.chatId
        );
        if (index !== -1) {
          let mediaIndex = state.chats[index].media.findIndex(
            (item) => item._id === mediaData.mediaId
          );
          state.chats[index].media[mediaIndex].resource = false;
        }
      })
      .addCase(removeFromResource.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(createTopicChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(createTopicChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        state.chats.push(action.payload);
      })
      .addCase(createTopicChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      })
      .addCase(deleteTopicChat.pending, (state) => {
        state.chatStatus = "loading";
      })
      .addCase(deleteTopicChat.fulfilled, (state, action) => {
        state.chatStatus = "idle";
        const id = action.payload;
        const index = state.chats.findIndex((item) => item._id === id);
        if (index !== -1) {
          state.chats.splice(index, 1); // Corrected splice usage
        }
      })

      .addCase(deleteTopicChat.rejected, (state, action) => {
        state.chatStatus = "idle";
        state.chatError = action.payload || action.error.message;
      });
  },
});

export const {
  setChatField,
  addMediaItem,
  removeMediaItem,
  clearChat,
  clearChatIdToDelete,
} = chatSlice.actions;

export default chatSlice.reducer;
