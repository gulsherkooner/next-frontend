import { getCookie } from "@/app/lib/utils/cookie";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to create a new story
export const createStory = createAsyncThunk(
  "stories/createStory",
  async (storyData, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(storyData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create story");
      }
      return data.story;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update a story (mark as viewed or update video)
export const updateStory = createAsyncThunk(
  "stories/updateStory",
  async ({ story_id, updateData }, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/stories/${story_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData), // Send updateData directly as body
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update story");
      }

      const data = await response.json();
      return data.story;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch stories for a specific user_id
export const fetchStoriesByUser = createAsyncThunk(
  "stories/fetchStoriesByUser",
  async (user_id, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie("accessToken");
    if (!accessToken) {
      return rejectWithValue("No access token available");
    }
    try {
      const apiGatewayUrl =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
      const response = await fetch(`${apiGatewayUrl}/stories/feed/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stories");
      }
      return data.stories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storiesSlice = createSlice({
  name: "stories",
  initialState: {
    stories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create story
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.stories.unshift(action.payload);
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update story
      .addCase(updateStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.stories.findIndex(
          (story) => story.story_id === action.payload.story_id
        );
        if (idx !== -1) {
          state.stories[idx] = action.payload;
        }
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch stories by user
      .addCase(fetchStoriesByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoriesByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStoriesByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default storiesSlice.reducer;