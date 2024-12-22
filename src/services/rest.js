import axios from 'axios';
import { getAuthToken } from './cookies';
import { hostUrl } from './../utils/globals';

export const postRequestAuthenticated = async (endpoint, data) => {
  try {
    const authToken = getAuthToken();
    if (authToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          'auth-token': authToken,
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: 'Invalid Token'
        };
      } else {
        return { error: true, success: false, message: 'Network Error' };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: 'Invalid Token'
      };
    }
  } catch (e) {
    console.error('Error in authenticated request:', e);
    return { error: true, success: false, message: 'Network Error' };
  }
};
export const postRequestAuthenticatedWithFile = async (endpoint, data) => {
  try {
    const authToken = getAuthToken();
    if (authToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          'auth-token': authToken,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true 
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: 'Invalid Token'
        };
      } else {
        return { error: true, success: false, message: 'Network Error' };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: 'Invalid Token'
      };
    }
  } catch (e) {
    console.error('Error in authenticated request:', e);
    return { error: true, success: false, message: 'Network Error' };
  }
};
export const postRequestUnAuthenticated = async (endpoint, data, headers = {}) => {
  try {
    const url = `${hostUrl}/api${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      withCredentials: true // Ensure cookies are included if needed
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return {
        error: true,
        success: false,
        auth: false,
        message: 'Invalid Token'
      };
    } else {
      return { error: true, success: false, message: 'Network Error' };
    }
  } catch (e) {
    console.error('Error in unauthenticated request:', e);
    return { error: true, success: false, message: 'Network Error' };
  }
};
