import { getCookie } from "@/app/lib/utils/cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch all public posts (no authentication required)
// Accepts { page, limit, seed } as an argument
export const fetchPublicPosts = createAsyncThunk(
  "posts/fetchPublicPosts",
  async ({ page = 1, limit = 20, seed } = {}, { rejectWithValue }) => {
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const params = new URLSearchParams({ page, limit });
      if (seed) params.append("seed", seed);
      const response = await fetch(
        `${apiGatewayUrl}/posts?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch public posts");
      }
      // API returns { posts, page, limit, total, totalPages }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch all posts for the authenticated user
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/posts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }
      return data.posts; // Assuming API returns { posts: [...] }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      alert("Please login to create a post");
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create post");
      }
      return data.post; // Assuming API returns { post: {...} }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update an existing post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, postData }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update post");
      }
      return data.post; // Assuming API returns { post: {...} }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }
      return postId; // Return the deleted post's ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (user_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/posts/user/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user posts");
      }
      return data.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch public reels (no authentication required)
// Accepts { page, limit, seed, id } as an argument
export const fetchPublicReels = createAsyncThunk(
  "posts/fetchPublicReels",
  async ({ page = 1, limit = 20, seed, id } = {}, { rejectWithValue }) => {
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const params = new URLSearchParams({ page, limit });
      if (seed) params.append("seed", seed);
      if (id) params.append("id", id);
      const response = await fetch(
        `${apiGatewayUrl}/posts/reels?${params.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch public reels");
      }
      // API returns { reels, page, limit, total, totalPages }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [], // Array to store the list of posts
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // Error message if an operation fails
    userPosts: [],
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch public posts with pagination
      .addCase(fetchPublicPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPublicPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // If page is 1, replace; otherwise, append
        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchPublicPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = [...state.posts, ...action.payload];
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
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
        const index = state.posts.findIndex(
          (post) => post.post_id === action.payload.post_id
        );
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
        state.posts = state.posts.filter(
          (post) => post.post_id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userPosts = action.payload;
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer to be included in the store
export default postsSlice.reducer;
