// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
} from "./../../services/rest";
import { createTopic, updateTopic } from "./createTopicSlice";
import { deleteTopic } from "./deleteTopicSlice";

export const fetchTopics = createAsyncThunk(
  "reorderTopics/fetchChannelTopics",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/fetch/channel/topics", {
        channelId,
      });
      if (response.success) {
        return response.topics;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOtherTopics = createAsyncThunk(
  "topic/fetch-other-topics",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/other/topics",
        data
      );
      if (response.success) {
        return response.topics;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchMembers = createAsyncThunk(
  "reorderTopics/fetchChannelMembers",
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/fetch/channel/members",
        {
          channelId,
        }
      );
      if (response.success) {
        return response.members;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const removeMember = createAsyncThunk(
  "reorderTopics/removeMember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/remove/channel/member",
        data
      );
      if (response.success) {
        return response.member;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTopicsOrder = createAsyncThunk(
  "reorderTopics/updateTopicsOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/update/channel/topics/order",
        data
      );
      const topicData = {
        topics: response.topics,
        channelId: response.channelId,
      };
      if (response.success) {
        return topicData;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  topics: [],
  members: [],
  removeChannelId: "",
  removeUser: {},
  status: "idle",
  memberStatus: "idle",
  error: false,
  otherTopics: [],
};

export const reorderTopicSlice = createSlice({
  name: "reorderTopic",
  initialState,
  reducers: {
    setReorderTopicField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearItems: (state) => {
      state.status = "idle";
      state.error = null;
    },
    clearRemovalDelete: (state) => {
      state.removeUser = {};
      state.removeChannelId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.status = "idle";
        state.topics = action.payload;
      })
      .addCase(fetchOtherTopics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOtherTopics.fulfilled, (state, action) => {
        state.status = "idle";
        state.otherTopics = action.payload;
      })
      .addCase(fetchMembers.pending, (state) => {
        state.memberStatus = "loading";
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.memberStatus = "idle";
        state.members = action.payload;
      })
      .addCase(removeMember.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.status = "idle";
        const removeData = action.payload;
        let memberIndex = state.members.findIndex(
          (member) => member._id === removeData.userId
        );
        if (memberIndex !== -1) {
          state.members.splice(memberIndex, 1);
        }
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.status = "idle";
        state.topics.push(action.payload);
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let topicIndex = state.topics.findIndex(
          (item) => item._id === topic._id
        );
        state.topics[topicIndex] = topic;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.topicstatus = "idle";
        const topic = action.payload;
        let topicIndex = state.topics.findIndex(
          (item) => item._id === topic._id
        );
        state.topics.splice(topicIndex, 1);
      })
      .addCase(updateTopicsOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTopicsOrder.fulfilled, (state, action) => {
        state.status = "idle";
        const topicData = action.payload;
        state.topics = topicData.topics;
      });
  },
});

export const { clearItems, setReorderTopicField, clearRemovalDelete } =
  reorderTopicSlice.actions;

export default reorderTopicSlice.reducer;
