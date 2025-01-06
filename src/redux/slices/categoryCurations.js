import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { upvoteChip, saveChip, createChip } from "./profileItemsSlice";
import { saveCuration } from "./curationPageSlice";
import { deleteChip } from "./deleteChipSlice";
import { createChipComment, createChipCommentReply } from "./commentChipSlice";

export const fetchCurationsfromCategory = createAsyncThunk(
  "categories/fetchCurations",
  async (category, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/category/curations`,
        { category: category }
      );
      // console.log(response);
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

export const fetchChips = createAsyncThunk(
  "categories/fetchChips",
  async (curId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/chips/of/curation`,
        { curId }
      );
      if (response.success) {
        return response.chips;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categoryCurationSlice = createSlice({
  name: "categoryCuration",
  initialState: {
    curations: [],
    chips: [],
    selectedCuration: null,
    loading: false,
    chipLoading: false,
    error: null,
    chipError: null,
  },
  reducers: {
    setSelectedCuration: (state, action) => {
      state.selectedCuration = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCurationChips: (state) => {
      state.chips = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurationsfromCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurationsfromCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.curations = action.payload;
        if (action.payload.length > 0) {
          state.selectedCuration = action.payload[0];
        }
      })
      .addCase(fetchCurationsfromCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChips.pending, (state) => {
        state.chipLoading = true;
        state.chipError = null;
      })
      .addCase(fetchChips.fulfilled, (state, action) => {
        state.chipLoading = false;
        state.chips = action.payload;
      })
      .addCase(fetchChips.rejected, (state, action) => {
        state.chipLoading = false;
        state.chipError = action.payload;
      })

      .addCase(saveCuration.fulfilled, (state, action) => {
        const updatedCuration = action.payload;
        const index = state.curations.findIndex(
          (curation) => curation._id === updatedCuration._id
        );
        if (index !== -1) {
          state.curations[index].saved_by = updatedCuration.saved_by;
        }
        if (state.selectedCuration !== null) {
          state.selectedCuration.saved_by = updatedCuration.saved_by;
        }
      })
      .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index2 = state.chips.findIndex(
          (item) => item._id === updatedComment.chipId
        );
        if (index2 !== -1) {
          state.chips[index2].comments += 1;
        }
      })
      .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        const index2 = state.chips.findIndex(
          (item) => item._id === updatedReply.parentCommentId.chipId
        );
        if (index2 !== -1) {
          state.chips[index2].comments += 1;
        }
      })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.chips.findIndex(
          (chip) => chip._id === updatedChip._id
        );
        if (index !== -1) {
          state.chips[index].upvotes = updatedChip.upvotes;
        }
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.chips.findIndex(
          (chip) => chip._id === updatedChip._id
        );
        if (index !== -1) {
          state.chips[index].saved_by = updatedChip.saved_by;
        }
      })
      .addCase(createChip.fulfilled, (state, action) => {
        state.chips.unshift(action.payload);
      })
      .addCase(deleteChip.fulfilled, (state, action) => {
        const chipId = action.payload._id;
        const index = state.chips.findIndex((item) => item._id === chipId);
        if (index !== -1) {
          state.chips.splice(index, 1);
        }
      });
  },
});

export const { setSelectedCuration, setError, clearCurationChips } =
  categoryCurationSlice.actions;

export default categoryCurationSlice.reducer;
