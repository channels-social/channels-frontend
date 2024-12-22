// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestAuthenticated } from '../../services/rest';

export const deleteCuration = createAsyncThunk('curations/deleteCuration', async (curationId, { rejectWithValue }) => {
  try {
    const response = await postRequestAuthenticated('/delete/curation', {curation_id: curationId });
    if (response.success) {
      return curationId;
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const curationDeletionSlice = createSlice({
  name: 'curationDeletion',
  initialState: {
    curationId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurationIdToDelete: (state, action) => {
      state.curationId = action.payload;
    },
    clearCurationIdToDelete: (state) => {
      state.curationId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCuration.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCuration.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.curationId = null; 
      })
      .addCase(deleteCuration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurationIdToDelete, clearCurationIdToDelete } = curationDeletionSlice.actions;

export default curationDeletionSlice.reducer;
