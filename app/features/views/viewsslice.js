import { getCookie } from "@/app/lib/utils/cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to record a view for a post
export const recordView = createAsyncThunk(
  "views/recordView",
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ post_id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to record view");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get views for a post
export const getViewsByPost = createAsyncThunk(
  "views/getViewsByPost",
  async ({ post_id, page = 1, limit = 50 }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(
        `${apiGatewayUrl}/views/post/${post_id}?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch views");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to get view count for a post
export const getViewCountByPost = createAsyncThunk(
  "views/getViewCountByPost",
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/views/post/${post_id}/count`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch view count");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to check if user has viewed a post
export const checkUserViewedPost = createAsyncThunk(
  "views/checkUserViewedPost",
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/views/post/${post_id}/viewed`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to check view status");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const viewsSlice = createSlice({
  name: "views",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Record view
      .addCase(recordView.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordView.fulfilled, (state) => {
        state.loading = false;
        // Don't store data, just return success
      })
      .addCase(recordView.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get views by post
      .addCase(getViewsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getViewsByPost.fulfilled, (state) => {
        state.loading = false;
        // Don't store data, caller will handle the returned data
      })
      .addCase(getViewsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get view count
      .addCase(getViewCountByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getViewCountByPost.fulfilled, (state) => {
        state.loading = false;
        // Don't store data, caller will handle the returned data
      })
      .addCase(getViewCountByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check user viewed post
      .addCase(checkUserViewedPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserViewedPost.fulfilled, (state) => {
        state.loading = false;
        // Don't store data, caller will handle the returned data
      })
      .addCase(checkUserViewedPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = viewsSlice.actions;
export default viewsSlice.reducer;
