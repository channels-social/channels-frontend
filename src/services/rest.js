import axios from "axios";
import { getAuthToken } from "./cookies";
import { hostUrl } from "./../utils/globals";
import { useSelector } from "react-redux";
import { getCsrfToken } from "../services/csrfToken";

export const postRequestAuthenticated = async (endpoint, data) => {
  try {
    const authToken = getAuthToken();
    // const csrfToken = getCsrfToken();
    if (authToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          "auth-token": authToken,
          // "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: "Invalid Token",
        };
      } else {
        return { error: true, success: false, message: "Network Error" };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestAuthenticatedWithFile = async (endpoint, data) => {
  try {
    const authToken = getAuthToken();
    // const csrfToken = getCsrfToken();
    if (authToken) {
      const url = `${hostUrl}/api${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          "auth-token": authToken,
          // "X-CSRF-Token": csrfToken,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 401) {
        return {
          error: true,
          success: false,
          auth: false,
          message: "Invalid Token",
        };
      } else {
        return { error: true, success: false, message: "Network Error" };
      }
    } else {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestUnAuthenticatedWithFile = async (
  endpoint,
  data,
  headers = {}
) => {
  try {
    // const csrfToken = getCsrfToken();
    const url = `${hostUrl}/api${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        // "X-CSRF-Token": csrfToken,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    } else {
      return { error: true, success: false, message: "Network Error" };
    }
  } catch (e) {
    console.error("Error in authenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
export const postRequestUnAuthenticated = async (
  endpoint,
  data,
  headers = {}
) => {
  try {
    // const csrfToken = getCsrfToken();
    const url = `${hostUrl}/api${endpoint}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        // "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 401) {
      return {
        error: true,
        success: false,
        auth: false,
        message: "Invalid Token",
      };
    } else {
      return { error: true, success: false, message: "Network Error" };
    }
  } catch (e) {
    console.error("Error in unauthenticated request:", e);
    return { error: true, success: false, message: "Network Error" };
  }
};
