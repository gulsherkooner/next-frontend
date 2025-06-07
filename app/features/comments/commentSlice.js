import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie } from "../../lib/utils/cookie";

// Async thunk to post a comment or reply
export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ post_id, text, parent_comment_id = null }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('please login to post a comment');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ post_id, text, parent_comment_id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }
      return data; // Returns the created comment object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (comment_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('please login to delete a comment');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/comments/${comment_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete comment');
      }
      return comment_id; // Return the deleted comment's ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to like a comment
export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (comment_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('please login to like a comment');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/comments/${comment_id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to like comment');
      }
      return { comment_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to unlike a comment
export const unlikeComment = createAsyncThunk(
  'comments/unlikeComment',
  async (comment_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/comments/${comment_id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to unlike comment');
      }
      return { comment_id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Comments slice
const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.error = null;
      })
      .addCase(postComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.comment_id !== action.payload);
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.find(c => c.comment_id === action.payload.comment_id);
        if (comment) {
          comment.likes_count = (comment.likes_count || 0) + 1;
        }
        state.error = null;
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const comment = state.comments.find(c => c.comment_id === action.payload.comment_id);
        if (comment && comment.likes_count > 0) {
          comment.likes_count -= 1;
        }
        state.error = null;
      })
      .addCase(unlikeComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default commentSlice.reducer;