import { getCookie } from "@/app/lib/utils/cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const followUser = createAsyncThunk(
  'followers/followUser',
  async (target_userid, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/followers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ target_userid }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to follow user');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkFollowUser = createAsyncThunk(
  'followers/checkFollowUser',
  async (target_userId, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/followers/check/${target_userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to follow user');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'followers/unfollowUser',
  async (target_userid, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/followers/${target_userid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to follow user');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get followers for a user
export const getFollowers = createAsyncThunk(
  "followers/getFollowers",
  async (user_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/followers/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get followers");
      }
      return data.followers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get users a user is following
export const getFollowing = createAsyncThunk(
  "followers/getFollowing",
  async (user_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/followers/following/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to get following");
      }
      return data.following;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);