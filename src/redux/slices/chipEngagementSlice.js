import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestUnAuthenticated } from './../../services/rest';

export const setChipSearched = createAsyncThunk('chipEngagement/searched', async (chip_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/set/chip/searched`, { chip_id });
      if (response.success) {
        return chip_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const setChipEngagement= createAsyncThunk('chipEngagement/engagement', async (chip_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/set/chip/engagement`, { chip_id });
      if (response.success) {
        return chip_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const chipEngagementSlice = createSlice({
  name: 'chipEngagement',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(setChipSearched.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setChipSearched.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setChipSearched.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(setChipEngagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setChipEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setChipEngagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// export const { } = curationEngagementSlice.actions;

export default chipEngagementSlice.reducer;
