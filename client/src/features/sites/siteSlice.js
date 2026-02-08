import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import siteService from './siteService';

const initialState = {
  sites: [],
  site: {},
  workHistory: [],
  siteEmployees: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all sites
export const getSites = createAsyncThunk(
  'sites/getAll',
  async (_, thunkAPI) => {
    try {
      return await siteService.getSites();
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

// Create site
export const createSite = createAsyncThunk(
  'sites/create',
  async (siteData, thunkAPI) => {
    try {
      return await siteService.createSite(siteData);
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

// Update site
export const updateSite = createAsyncThunk(
  'sites/update',
  async ({ id, siteData }, thunkAPI) => {
    try {
      return await siteService.updateSite(id, siteData);
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

// Assign employee to site
export const assignEmployeeToSite = createAsyncThunk(
  'sites/assign',
  async (assignmentData, thunkAPI) => {
    try {
      return await siteService.assignEmployeeToSite(assignmentData);
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

// Get current site (for employee)
export const getCurrentSite = createAsyncThunk(
  'sites/getCurrent',
  async (_, thunkAPI) => {
    try {
      return await siteService.getCurrentSite();
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

// Get work history (for employee)
export const getWorkHistory = createAsyncThunk(
  'sites/getWorkHistory',
  async (_, thunkAPI) => {
    try {
      return await siteService.getWorkHistory();
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

// Get employees assigned to a site
export const getSiteEmployees = createAsyncThunk(
  'sites/getSiteEmployees',
  async (siteId, thunkAPI) => {
    try {
      return await siteService.getSiteEmployees(siteId);
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

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getSites.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sites.push(action.payload);
      })
      .addCase(createSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.sites.findIndex(
          (site) => site._id === action.payload._id
        );
        if (index !== -1) {
          state.sites[index] = action.payload;
        }
        state.site = action.payload;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(assignEmployeeToSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignEmployeeToSite.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(assignEmployeeToSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCurrentSite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentSite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.site = action.payload;
      })
      .addCase(getCurrentSite.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWorkHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getWorkHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSiteEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSiteEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.siteEmployees = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getSiteEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = siteSlice.actions;
export default siteSlice.reducer;
