import { createSlice } from '@reduxjs/toolkit';
import { getUserData,getAuthToken } from './../../services/cookies';

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    initializeAuth: (state) => {
      const token = getAuthToken();
      const user = getUserData();
    
     if (token && user) {
        state.token = token;
        state.user = user;
        state.isLoggedIn = true;
      } else {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setCredentials, logOut, initializeAuth,updateUser } = authSlice.actions;
export default authSlice.reducer;
