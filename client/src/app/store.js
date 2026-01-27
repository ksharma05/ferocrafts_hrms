import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeeReducer from '../features/employees/employeeSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import siteReducer from '../features/sites/siteSlice';
import payoutReducer from '../features/payouts/payoutSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    attendance: attendanceReducer,
    site: siteReducer,
    payout: payoutReducer,
    profile: profileReducer,
  },
});
