import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import payoutService from './payoutService';

const initialState = {
  payouts: [],
  payout: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get payout history
export const getPayoutHistory = createAsyncThunk(
  'payouts/getHistory',
  async (_, thunkAPI) => {
    try {
      return await payoutService.getPayoutHistory();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate payouts
export const generatePayouts = createAsyncThunk(
  'payouts/generate',
  async (generateData, thunkAPI) => {
    try {
      return await payoutService.generatePayouts(generateData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get payout slip
export const getPayoutSlip = createAsyncThunk(
  'payouts/getSlip',
  async (id, thunkAPI) => {
    try {
      return await payoutService.getPayoutSlip(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayoutHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayoutHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payouts = action.payload;
      })
      .addCase(getPayoutHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(generatePayouts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generatePayouts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Add generated payouts to the list
        if (action.payload.data && Array.isArray(action.payload.data)) {
          state.payouts = [...state.payouts, ...action.payload.data];
        }
      })
      .addCase(generatePayouts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPayoutSlip.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPayoutSlip.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getPayoutSlip.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = payoutSlice.actions;
export default payoutSlice.reducer;
