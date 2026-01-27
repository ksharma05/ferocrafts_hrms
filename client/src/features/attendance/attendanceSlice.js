import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from './attendanceService';

const initialState = {
  attendances: [],
  attendance: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Check in
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (attendanceData, thunkAPI) => {
    try {
      return await attendanceService.checkIn(attendanceData);
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

// Check out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, thunkAPI) => {
    try {
      return await attendanceService.checkOut();
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

// Get attendance history
export const getAttendanceHistory = createAsyncThunk(
  'attendance/getHistory',
  async (_, thunkAPI) => {
    try {
      return await attendanceService.getAttendanceHistory();
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

// Alter attendance
export const alterAttendance = createAsyncThunk(
  'attendance/alter',
  async ({ id, alterationData }, thunkAPI) => {
    try {
      return await attendanceService.alterAttendance(id, alterationData);
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

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendances.push(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the attendance record in state
        const index = state.attendances.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.attendances[index] = action.payload;
        }
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAttendanceHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendanceHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendances = action.payload;
      })
      .addCase(getAttendanceHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(alterAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(alterAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.attendances.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.attendances[index] = action.payload;
        }
      })
      .addCase(alterAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
