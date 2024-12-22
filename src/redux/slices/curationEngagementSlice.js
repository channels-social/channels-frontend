import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestUnAuthenticated } from './../../services/rest';

export const setCurationSearched = createAsyncThunk('curationEngagement/searched', async (curation_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/set/curation/searched`, { curation_id });
      if (response.success) {
        return curation_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const setCurationEngagement= createAsyncThunk('curationEngagement/engagement', async (curation_id, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/set/curation/engagement`, { curation_id });
      if (response.success) {
        return curation_id;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const curationEngagementSlice = createSlice({
  name: 'curationEngagement',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCurationSearched.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCurationSearched.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can update the state related to this specific curation if needed
      })
      .addCase(setCurationSearched.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(setCurationEngagement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setCurationEngagement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // You can update the state related to this specific curation if needed
      })
      .addCase(setCurationEngagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// export const { } = curationEngagementSlice.actions;

export default curationEngagementSlice.reducer;
