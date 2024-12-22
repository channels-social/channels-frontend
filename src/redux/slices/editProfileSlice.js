import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _id:'',
    name: '',
    email: '',
    logo: '',
    username: '',
    description: '',
    links: [],
    location: '',
    contact: '',
    customText: '',
    customUrl: '',
    otherLink: '',
    imageCards: [],
    subscriptions: [],
    subscribers: [],
  };

const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateProfileField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

export const { setProfileData, updateProfileField } = editProfileSlice.actions;

export default editProfileSlice.reducer;
