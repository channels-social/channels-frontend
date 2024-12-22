// redux/slices/curationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const createTopic = createAsyncThunk(
  "topic/create-topic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/topic",
        topicData
      );
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
export const updateTopic = createAsyncThunk(
  "topic/update-topic",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile(
        "/update/topic",
        topicData
      );
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

export const topicSlice = createSlice({
  name: "topic",
  initialState: {
    name: "",
    visibility: "anyone",
    channel: "",
    editability: "me",
    _id: "",
    topicstatus: "idle",
    topicNameError: false,
  },
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
    },
  },
});

export const { setSelectedUnsplashImage, setTopicField, clearTopic } =
  topicSlice.actions;

export default topicSlice.reducer;
