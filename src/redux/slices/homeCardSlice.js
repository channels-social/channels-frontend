import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestUnAuthenticated, postRequestAuthenticated, postRequestAuthenticatedWithFile} from './../../services/rest';

export const fetchTrendingChip = createAsyncThunk('homeCard/fetchTrendingChip', async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/get/trending/chips');
      if (response.success) {
        return response.chips;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const fetchTrendingProfile = createAsyncThunk('homeCard/fetchTrendingProfile', async (_,{ rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/get/trending/profiles');
      if (response.success) {
        return response.profiles;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const fetchEditorsCurations = createAsyncThunk('homeCard/fetchEditorsCuration', async (_,{ rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/get/editors/curations');
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const postEditorsCurations = createAsyncThunk('homeCard/postEditorsCuration', async ({curations},{ rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated('/post/editors/curations',{curations:curations});
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const postBannerCards = createAsyncThunk('homeCard/postBannerCards', async ({formDataToSend},{ rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticatedWithFile('/post/banner/cards',{formDataToSend:formDataToSend});
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });


export const homeCardSlice = createSlice({
  name: 'homeCard',
  initialState: {
    profiles:[],
    profilestatus:'idle',
    profileerror:null,
    chips:[],
    chipStatus: 'idle',
    chipError: null,
    curations:[],
    curationstatus:'idle',
    curationerror:null,
    imageCards:[],
    imageCardStatus:'idle',
    imageCardError:null,
  },
  reducers: {
    clearItems:(state)=>{
      state.chip={};
      state.profiles=[];
      state.curations=[];
    },
   
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTrendingChip.pending, (state) => {
        state.chipstatus = 'loading';
        state.chiperror = null;
    })
    .addCase(fetchTrendingChip.fulfilled, (state, action) => {
        state.chipstatus = 'succeeded';
        state.chips = action.payload;
    })
    .addCase(fetchTrendingChip.rejected, (state, action) => {
        state.chipstatus = 'failed';
        state.chiperror = action.payload;
    })
    .addCase(fetchTrendingProfile.pending, (state) => {
        state.profileStatus = 'loading';
        state.profileError = null;
    })
    .addCase(fetchTrendingProfile.fulfilled, (state, action) => {
        state.profileStatus = 'succeeded';
        state.profiles = action.payload;
    })
    .addCase(fetchTrendingProfile.rejected, (state, action) => {
        state.profileStatus = 'failed';
        state.profileError = action.payload;
    })
    .addCase(fetchEditorsCurations.pending, (state) => {
        state.curationStatus = 'loading';
        state.curationError = null;
    })
    .addCase(fetchEditorsCurations.fulfilled, (state, action) => {
        state.curationStatus = 'succeeded';
        state.curations = action.payload;
    })
    .addCase(fetchEditorsCurations.rejected, (state, action) => {
        state.curationStatus = 'failed';
        state.curationError = action.payload;
    })
  },
});

export const { clearItems } = homeCardSlice.actions;

export default homeCardSlice.reducer;

