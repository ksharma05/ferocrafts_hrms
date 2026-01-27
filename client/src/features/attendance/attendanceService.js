import axiosInstance from '../../services/axiosInstance';

const API_URL = '/attendance/';

// Check in
const checkIn = async (attendanceData) => {
  // Support both FormData (for file upload) and JSON
  const config = {};
  if (attendanceData instanceof FormData) {
    config.headers = {
      'Content-Type': 'multipart/form-data',
    };
  }

  const response = await axiosInstance.post(API_URL + 'check-in', attendanceData, config);
  return response.data.data;
};

// Check out
const checkOut = async () => {
  const response = await axiosInstance.post(API_URL + 'check-out');
  return response.data.data;
};

// Get attendance history
const getAttendanceHistory = async () => {
  const response = await axiosInstance.get(API_URL + 'history');
  return response.data.data;
};

// Alter attendance
const alterAttendance = async (id, alterationData) => {
  const response = await axiosInstance.put(API_URL + id + '/alter', alterationData);
  return response.data.data;
};

const attendanceService = {
  checkIn,
  checkOut,
  getAttendanceHistory,
  alterAttendance,
};

export default attendanceService;
