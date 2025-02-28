import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestUnAuthenticated } from "./../../services/rest";

export const fetchCurationSearch = createAsyncThunk(
  "globalSearchItems/curations",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/global/search/curations",
        { data }
      );
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchProfileSearch = createAsyncThunk(
  "globalSearchItems/profiles",
  async (query, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/global/search/profiles",
        { query }
      );
      if (response.success) {
        return response.profiles;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchItemsSlice = createSlice({
  name: "searchItems",
  initialState: {
    curations: [],
    profiles: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearItems: (state) => {
      state.curations = [];
      state.profiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurationSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurationSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curations = action.payload;
      })
      .addCase(fetchCurationSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchProfileSearch.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProfileSearch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profiles = action.payload;
      })
      .addCase(fetchProfileSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearItems } = searchItemsSlice.actions;

export default searchItemsSlice.reducer;
export const selectProfileItemsStatus = (state) => state.searchItems.status;
export const selectProfileItemsError = (state) => state.searchItems.error;
