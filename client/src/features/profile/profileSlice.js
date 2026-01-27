import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService';

const initialState = {
  profile: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user profile
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, thunkAPI) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch profile';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile picture
export const updateProfilePicture = createAsyncThunk(
  'profile/updateProfilePicture',
  async (formData, thunkAPI) => {
    try {
      return await profileService.updateProfilePicture(formData);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Failed to update profile picture';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Request email change OTP
export const requestEmailChangeOTP = createAsyncThunk(
  'profile/requestEmailChangeOTP',
  async (newEmail, thunkAPI) => {
    try {
      return await profileService.requestEmailChangeOTP(newEmail);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Failed to request OTP';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify OTP and update email
export const verifyEmailChangeOTP = createAsyncThunk(
  'profile/verifyEmailChangeOTP',
  async (otp, thunkAPI) => {
    try {
      return await profileService.verifyEmailChangeOTP(otp);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Failed to verify OTP';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update profile picture
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.profile) {
          state.profile.user.profilePicture = action.payload.profilePicture;
        }
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Request email OTP
      .addCase(requestEmailChangeOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestEmailChangeOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(requestEmailChangeOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Verify OTP
      .addCase(verifyEmailChangeOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmailChangeOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.profile) {
          state.profile.user.email = action.payload.email;
        }
      })
      .addCase(verifyEmailChangeOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = profileSlice.actions;
export default profileSlice.reducer;

