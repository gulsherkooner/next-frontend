import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, { getState, dispatch, rejectWithValue }) => {
  let accessToken = getState().auth.accessToken || sessionStorage.getItem('accessToken');
  if (!accessToken) {
    return rejectWithValue('No access token available');
  }
  if (!getState().auth.accessToken && accessToken) {
    dispatch(updateAccessToken(accessToken));
  }
  try {
    const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
    const response = await fetch(`${apiGatewayUrl}/auth/user`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user data');
    }
    return data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.status = 'succeeded';
      state.error = null;
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;