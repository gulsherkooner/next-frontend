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

// Async thunk to search posts with auto-complete suggestions
export const searchSuggestions = createAsyncThunk(
  "search/searchSuggestions",
  async ({ q, limit = 5 }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }

    try {
      const params = new URLSearchParams({
        q,
        limit: limit.toString(),
        page: '1', // Only get first page for suggestions
      });

      const response = await fetch(`${API_BASE_URL}/search/search?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to get search suggestions');
      }

      const data = await response.json();
      // Return only essential data for suggestions
      return {
        suggestions: data.posts.map(post => ({
          post_id: post.post_id,
          title: post.title,
          description: post.description,
          user: post.user,
          post_type: post.post_type,
          is_reel: post.is_reel,
        })),
        total: data.total,
        search_query: data.search_query,
      };
    } catch (error) {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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