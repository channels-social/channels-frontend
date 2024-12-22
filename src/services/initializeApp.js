// src/hooks/useInitializeApp.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from '../redux/slices/authSlice';
import { fetchMyData, clearMyData } from '../redux/slices/myDataSlice';

const useInitializeApp = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());

    const fetchUserData = async () => {
      if (auth.isLoggedIn) {
        await dispatch(fetchMyData());
      } 
      else {
        dispatch(clearMyData());

      }
    };

    fetchUserData();
  }, [dispatch, auth.isLoggedIn]);
};

export default useInitializeApp;
