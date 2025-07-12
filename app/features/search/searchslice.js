"use client"
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from "@/app/lib/utils/cookie";

// Get the API base URL from environment variables or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL  || 'http://localhost:3001';

// Async thunk to search posts
export const searchPosts = createAsyncThunk(
  "search/searchPosts",
  async ({ q, post_type, page = 1, limit = 20, seed }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      const params = new URLSearchParams({
        q,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (post_type) params.append('post_type', post_type);
      if (seed) params.append('seed', seed);

      const response = await fetch(`${API_BASE_URL}/search/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to search posts');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Add this new thunk to searchslice.js
export const searchUserSuggestions = createAsyncThunk(
  "search/searchUserSuggestions",
  async ({ q, limit = 5 }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      const params = new URLSearchParams({
        q,
        limit: limit.toString(),
        page: '1',
      });

      const response = await fetch(`${API_BASE_URL}/auth/search/users?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to get user suggestions');
      }

      const data = await response.json();
      return {
        suggestions: data.users.map(user => ({
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          profile_img_url: user.profile_img_url,
          is_verified: user.is_verified,
          type: 'user'
        })),
        total: data.total,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update the searchSuggestions thunk in searchslice.js
export const searchSuggestions = createAsyncThunk(
  "search/searchSuggestions",
  async ({ q, activeTab = 'posts', limit = 5 }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      // Map activeTab to the correct post_type for the API
      let post_type;
      switch (activeTab) {
        case 'posts':
          post_type = 'image';
          break;
        case 'videos':
          post_type = 'video';
          break;
        case 'reels':
          post_type = 'reel';
          break;
        case 'users':
          post_type = 'users';
          break;
        default:
          post_type = 'image';
      }

      const params = new URLSearchParams({
        q,
        limit: limit.toString(),
        page: '1',
        post_type: post_type
      });

      console.log(`Making API call for ${activeTab} with post_type: ${post_type}`);
      console.log(`URL: ${API_BASE_URL}/search/search?${params}`);

      const response = await fetch(`${API_BASE_URL}/search/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`Response status for ${activeTab}:`, response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error response for ${activeTab}:`, errorData);
        return rejectWithValue(errorData.error || 'Failed to get search suggestions');
      }

      const data = await response.json();
      console.log(`Response data for ${activeTab}:`, data);
      
      // Handle different response formats
      let suggestions = [];
      if (activeTab === 'users' && data.users) {
        suggestions = data.users.map(user => ({
          user_id: user.user_id,
          username: user.username,
          name: user.name,
          profile_img_url: user.profile_img_url,
          is_verified: user.is_verified,
          type: 'user'
        }));
      } else if (data.posts) {
        suggestions = data.posts.map(post => ({
          post_id: post.post_id,
          title: post.title,
          description: post.description,
          post_type: post.post_type,
          is_reel: post.is_reel,
          user: post.user,
          type: 'post'
        }));
      }

      console.log(`Final suggestions for ${activeTab}:`, suggestions);

      return {
        suggestions: suggestions || [],
        activeTab
      };
    } catch (error) {
      console.error(`Network error for ${activeTab}:`, error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Async thunk to search posts by type specifically
export const searchPostsByType = createAsyncThunk(
  "search/searchPostsByType",
  async ({ q, post_type, page = 1, limit = 20, seed }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      const params = new URLSearchParams({
        q,
        post_type,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (seed) params.append('seed', seed);

      const response = await fetch(`${API_BASE_URL}/search/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to search posts by type');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Async thunk to get trending search terms (if you want to implement this later)
export const getTrendingSearches = createAsyncThunk(
  "search/getTrendingSearches",
  async ({ limit = 10 }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search/trending?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to get trending searches');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);