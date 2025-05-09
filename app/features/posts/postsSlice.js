import { getCookie } from '@/app/lib/utils/cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch all public posts (no authentication required)
export const fetchPublicPosts = createAsyncThunk('posts/fetchPublicPosts', async (_, { rejectWithValue }) => {
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch public posts');
    }
    return data.posts; // Assuming API returns { posts: [...] }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to fetch all posts for the authenticated user
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.accessToken || getCookie('accessToken');
  if (!accessToken) {
    return rejectWithValue('No access token available');
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch posts');
    }
    return data.posts; // Assuming API returns { posts: [...] }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to create a new post
export const createPost = createAsyncThunk('posts/createPost', async (postData, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.accessToken || getCookie('accessToken');
  if (!accessToken) {
    alert("Please login to create a post");
    return rejectWithValue('No access token available');
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create post');
    }
    return data.post; // Assuming API returns { post: {...} }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to update an existing post
export const updatePost = createAsyncThunk('posts/updatePost', async ({ postId, postData }, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.accessToken || getCookie('accessToken');
  if (!accessToken) {
    return rejectWithValue('No access token available');
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update post');
    }
    return data.post; // Assuming API returns { post: {...} }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk to delete a post
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.accessToken || getCookie('accessToken');
  if (!accessToken) {
    return rejectWithValue('No access token available');
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete post');
    }
    return postId; // Return the deleted post's ID
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchUserPosts = createAsyncThunk('posts/fetchUserPosts', async (user_id, { getState, rejectWithValue }) => {
  const accessToken = getState().auth.accessToken || getCookie('accessToken');
  if (!accessToken) {
    return rejectWithValue('No access token available');
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/posts/user/${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user posts');
    }
    return data.posts;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Create the posts slice
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],           // Array to store the list of posts
    status: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null          // Error message if an operation fails
  },
  reducers: {},          // No synchronous reducers needed for now
  extraReducers: (builder) => {
    builder
      // Fetch public posts
      .addCase(fetchPublicPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.post_id === action.payload.post_id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.post_id !== action.payload);
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Export the reducer to be included in the store
export default postsSlice.reducer;