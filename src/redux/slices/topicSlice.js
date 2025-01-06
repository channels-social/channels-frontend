// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestUnAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";
import { updateTopic } from "./createTopicSlice";

export const fetchTopic = createAsyncThunk(
  "topic/fetch-topic",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/topic", {
        id: id,
      });
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

const initialState = {
  name: "",
  user: "",
  visibility: "anyone",
  channel: "",
  editability: "me",
  allowedVisibleUsers: [],
  _id: "",
  topicstatus: "idle",
  topicNameError: false,
};

export const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopicField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },

    clearTopic: (state) => {
      state.name = "";
      state.visibility = "anyone";
      state.channel = "";
      state.editability = "anyone";
      state._id = "";
      state.topicstatus = "idle";
      state.topicNameError = false;
      state.allowedVisibleUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopic.pending, (state) => {
        state.topicstatus = "loading";
      })
      .addCase(fetchTopic.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.topicstatus = "idle";
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        Object.assign(state, initialState, action.payload);
        state.topicstatus = "idle";
      })
      .addCase(fetchTopic.rejected, (state, action) => {
        state.topicstatus = "idle";
        state.topicNameError = action.payload || action.error.message;
      });
  },
});

export const { setSelectedUnsplashImage, setTopicField, clearTopic } =
  topicSlice.actions;

export default topicSlice.reducer;
