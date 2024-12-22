// src/redux/slices/chipDeletionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestAuthenticated } from './../../services/rest';

export const deleteChip = createAsyncThunk('chips/deleteChip', async (chipId, { rejectWithValue }) => {
  try {
    const response = await postRequestAuthenticated('/delete/chip', { chipId:chipId });
    if (response.success) {
      return chipId;
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const chipDeletionSlice = createSlice({
  name: 'chipDeletion',
  initialState: {
    chipId: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setChipIdToDelete: (state, action) => {
      state.chipId = action.payload;
    },
    clearChipIdToDelete: (state) => {
      state.chipId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteChip.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteChip.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chipId = null; 
      })
      .addCase(deleteChip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setChipIdToDelete, clearChipIdToDelete } = chipDeletionSlice.actions;

export default chipDeletionSlice.reducer;
