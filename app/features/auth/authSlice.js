import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "../../lib/utils/cookie";

// Existing fetchUserData thunk
export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { getState, dispatch, rejectWithValue }) => {
    let accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    if (!getState().auth.accessToken && accessToken) {
      dispatch(updateAccessToken(accessToken));
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/auth/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // Include cookies for refreshToken
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data");
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// New updateProfile thunk
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/auth/user`, {
        method: "PUT", // Using PUT to update user profile
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }
      return data.user; // Assuming the API returns the updated user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (email, { rejectWithValue }) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/auth/sendOTP`, {
        method: "POST", // Using PUT to update user profile
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data || "Failed to send OTP");
      }// Assuming the API returns the updated user data
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.status = "succeeded";
      state.error = null;
      
      if (action.payload.accessToken) {
        setCookie("accessToken", action.payload.accessToken, {
          secure: process.env.NODE_ENV === 'production', // Use secure in production
          sameSite: "Strict",
          maxAge: 15 * 60, // 15 minutes
          path: '/'
        });
      }
      
      if (action.payload.refreshToken) {
        setCookie("refreshToken", action.payload.refreshToken, {
          secure: process.env.NODE_ENV === 'production', // Use secure in production
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/'
        });
      }
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.status = "succeeded";
      state.error = null;
      if (action.payload.accessToken) {
        setCookie("accessToken", action.payload.accessToken, {
          secure: false,
          sameSite: "Strict",
          maxAge: 24 * 60 * 60,
        });
      }
      if (action.payload.refreshToken) {
        setCookie("refreshToken", action.payload.refreshToken, {
          secure: false,
          sameSite: "Strict",
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCredentials, updateAccessToken, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
