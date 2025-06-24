import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "@/app/lib/utils/cookie";

// Async thunk to create a membership
export const createMembership = createAsyncThunk(
  "membership/createMembership",
  async (membershipData, { getState, rejectWithValue }) => {
    const accessToken = getState().auth.accessToken || getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No access token available');
    }
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/memberships`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(membershipData),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create membership");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to get a membership by user_id
export const fetchMembershipByUser = createAsyncThunk(
  "membership/fetchMembershipByUser",
  async (user_id, { rejectWithValue }) => {
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/memberships/user/${user_id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch membership");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to get a membership by membership_id
export const fetchMembershipById = createAsyncThunk(
  "membership/fetchMembershipById",
  async (membership_id, { rejectWithValue }) => {
    try {
      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001';
      const response = await fetch(`${apiGatewayUrl}/memberships/${membership_id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch membership");
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const membershipSlice = createSlice({
  name: "membership",
  initialState: {
    membership: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createMembership.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMembership.fulfilled, (state, action) => {
        state.loading = false;
        state.membership = action.payload;
      })
      .addCase(createMembership.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by user
      .addCase(fetchMembershipByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.membership = action.payload;
      })
      .addCase(fetchMembershipByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchMembershipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembershipById.fulfilled, (state, action) => {
        state.loading = false;
        state.membership = action.payload;
      })
      .addCase(fetchMembershipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default membershipSlice.reducer;