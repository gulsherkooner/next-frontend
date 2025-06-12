import { getCookie } from '@/app/lib/utils/cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Like a post
export const likePost = createAsyncThunk(
  'postLikes/likePost',
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/postLikes/${post_id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to like post');
      }
      return { post_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Unlike a post
export const unlikePost = createAsyncThunk(
  'postLikes/unlikePost',
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/postLikes/${post_id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlike post');
      }
      return { post_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all liked posts for a user
export const fetchUserPostLikes = createAsyncThunk(
  'postLikes/fetchUserPostLikes',
  async (user_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/postLikes/user/${user_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user post likes');
      }
      return data.likes; // [{ post_id, created_at }]
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check if the current user liked a specific post
export const fetchUserLikeForPost = createAsyncThunk(
  'postLikes/fetchUserLikeForPost',
  async (post_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/postLikes/${post_id}/like`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        // If not liked, return liked: false
        if (response.status === 404) {
          return { post_id, liked: false };
        }
        throw new Error(data.error || 'Failed to fetch like status');
      }
      return { post_id, liked: true, like: data.like };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all likes for a specific post (public, no user required)
export const fetchAllLikesForPost = async (post_id) => {
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/postLikes/${post_id}/all`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch all likes for post');
    }
    return data.likes; // [{ user_id, created_at }]
  } catch (error) {
    throw error;
  }
};

const postsLikesSlice = createSlice({
  name: 'postLikes',
  initialState: {
    likedPosts: [], // Array of { post_id, created_at }
    status: 'idle',
    error: null,
    userLikes: {}, // { [post_id]: true/false }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        if (!state.likedPosts.some(like => like.post_id === action.payload.post_id)) {
          state.likedPosts.push({ post_id: action.payload.post_id, created_at: new Date().toISOString() });
        }
        state.error = null;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.likedPosts = state.likedPosts.filter(like => like.post_id !== action.payload.post_id);
        state.error = null;
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserPostLikes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPostLikes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.likedPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPostLikes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUserLikeForPost.fulfilled, (state, action) => {
        state.userLikes[action.payload.post_id] = action.payload.liked;
      })
      .addCase(fetchUserLikeForPost.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default postsLikesSlice.reducer;