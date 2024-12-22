import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestAuthenticated, postRequestUnAuthenticated } from './../../services/rest';
import { upvoteChip, saveChip, shareChips, createChip } from './profileItemsSlice';
import {createChipComment, createChipCommentReply } from './commentChipSlice';

export const fetchmySubscriptions = createAsyncThunk('homeItems/fetchSubscriptions', async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated('/get/my/subscriptions');
      if (response.success) {
        return response.subscriptions;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const fetchHomeSubscribeItems = createAsyncThunk('homeItems/fetchItems', async (userId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/profile/chips/curations', {userId} );
      if (response.success) {
        // console.log(response);
        return response.items;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

  export const fetchCategoryCurations = createAsyncThunk(
    'homeItems/fetchCategoryCurations',
    async (_, { rejectWithValue }) => {
      try {
        const response = await postRequestUnAuthenticated('/get/curations/by/category');
        if (response.success) {
          return response.categories;
        } else {
          return rejectWithValue(response.message);
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    });

  export const fetchChipsofCuration = createAsyncThunk('homeItems/fetchChipsofCuration', async (curId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/fetch/chips/of/curation`, { curId });
      if (response.success) {
        return response.chips;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  export const UnsubscribeProfile = createAsyncThunk('homeItems/unsubscribeProfile', async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(`/unsubscribe/profile`, { username:username});
      if (response.success) {
        return response.subscriptions;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });



export const homeItemsSlice = createSlice({
  name: 'homeItems',
  initialState: {
    subscriptions:[],
    subscriptionstatus:'idle',
    subscriptionerror:null,
    items: [],
    itemsStatus: 'idle',
    itemsError: null,
    categories:[],
    categoriesstatus:'idle',
    categorieserror:null,
    chips:[],
    chipsstatus:'idle',
    chipserror:null,
    selectedCuration: {},
  },
  reducers: {
    clearCurationItems:(state)=>{
      state.chips=[];
    },
    clearSubscriptionItems:(state)=>{
      state.items=[];
    },
    selectCuration: (state, action) => {
      state.selectedCuration = action.payload;
    },
    clearCuration: (state) => {
      state.selectedCuration = [];
    },
   
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchmySubscriptions.pending, (state) => {
        state.subscriptionstatus = 'loading';
        state.subscriptionerror = null;
    })
    .addCase(fetchmySubscriptions.fulfilled, (state, action) => {
        state.subscriptionstatus = 'succeeded';
        state.subscriptions = action.payload;
    })
    .addCase(fetchmySubscriptions.rejected, (state, action) => {
        state.subscriptionstatus = 'failed';
        state.subscriptionerror = action.payload;
    })
    // .addCase(UnsubscribeProfile.fulfilled, (state, action) => {
    //   state.subscriptionstatus = 'succeeded';
    //   state.subscriptions = action.payload;
    // })
    // .addCase(UnsubscribeProfile.pending, (state, action) => {
    //   state.subscriptionstatus = 'loading';
    //   state.subscriptionerror = null;
    // })
    // .addCase(UnsubscribeProfile.rejected, (state, action) => {
    //   state.subscriptionstatus = 'failed';
    //   state.subscriptionerror = action.payload;
    // })
    .addCase(fetchHomeSubscribeItems.pending, (state) => {
        state.itemsStatus = 'loading';
        state.itemsError = null;
    })
    .addCase(fetchHomeSubscribeItems.fulfilled, (state, action) => {
        state.itemsStatus = 'succeeded';
        state.items = action.payload;
    })
    .addCase(fetchHomeSubscribeItems.rejected, (state, action) => {
        state.itemsStatus = 'failed';
        state.itemsError = action.payload;
    })
    
    .addCase(fetchCategoryCurations.pending, (state) => {
        state.categoriesstatus = 'loading';
        state.categorieserror = null;
    })
    .addCase(fetchCategoryCurations.fulfilled, (state, action) => {
        state.categoriesstatus = 'succeeded';
        state.categories = action.payload;
    })
    .addCase(fetchCategoryCurations.rejected, (state, action) => {
        state.categoriesstatus = 'failed';
        state.categorieserror = action.payload;
    })
    .addCase(fetchChipsofCuration.pending, (state) => {
        state.chipsstatus = 'loading';
        state.chipserror = null;
    })
    .addCase(fetchChipsofCuration.fulfilled, (state, action) => {
        state.chipsstatus = 'succeeded';
        state.chips = action.payload;
    })
    .addCase(fetchChipsofCuration.rejected, (state, action) => {
        state.chipsstatus = 'failed';
        state.chipserror = action.payload;
    })
    .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.items.findIndex(item => item._id === updatedChip._id);
        if (index !== -1) {
            state.items[index].upvotes = updatedChip.upvotes; 
        }
        const index2 = state.chips.findIndex(item => item._id === updatedChip._id);
        if (index2 !== -1) {
            state.chips[index2].upvotes = updatedChip.upvotes; 
        }
    })
    .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.items.findIndex(item => item._id === updatedComment.chipId);
        if (index !== -1) {
          state.items[index].comments+=1;
        }
        const index2 = state.chips.findIndex(item => item._id === updatedComment.chipId);
        if (index2 !== -1) {
            state.chips[index2].comments +=1; 
        }
    })
    .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        const index = state.items.findIndex(item => item._id === updatedReply.parentCommentId.chipId);
        if (index !== -1) {
            state.items[index].comments +=1; 
        }
        const index2 = state.chips.findIndex(item => item._id === updatedReply.parentCommentId.chipId);
        if (index2 !== -1) {
            state.chips[index2].comments +=1;
        }
    })
    .addCase(shareChips.fulfilled, (state, action) => {
      const chip = action.payload;
      const index = state.items.findIndex(item => item._id === chip._id);
      if (index !== -1) {
        state.items[index].shared_by = chip.shared_by; 
      }
      const index2 = state.chips.findIndex(item => item._id === chip._id);
      if (index2 !== -1) {
          state.chips[index2].shared_by = chip.shared_by; 
      }
    })
    .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.items.findIndex(item => item._id === updatedChip._id);
        if (index !== -1) {
            state.items[index].saved_by = updatedChip.saved_by; 
        }
        const index2 = state.chips.findIndex(item => item._id === updatedChip._id);
        if (index2 !== -1) {
            state.chips[index2].saved_by = updatedChip.saved_by; 
        }
    })
    .addCase(createChip.fulfilled, (state, action) => {
        state.chips.push(action.payload);
    })
      
  },
});

export const { clearCurationItems,clearSubscriptionItems,selectCuration, clearCuration } = homeItemsSlice.actions;

export default homeItemsSlice.reducer;

