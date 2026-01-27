import axios from '../../services/axiosInstance';

// Get user profile
const getProfile = async () => {
  const response = await axios.get('/profile');
  return response.data.data;
};

// Update profile picture
const updateProfilePicture = async (formData) => {
  const response = await axios.put('/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

// Request email change OTP
const requestEmailChangeOTP = async (newEmail) => {
  const response = await axios.post('/profile/email/request-otp', {
    newEmail,
  });
  return response.data;
};

// Verify OTP and update email
const verifyEmailChangeOTP = async (otp) => {
  const response = await axios.post('/profile/email/verify-otp', {
    otp,
  });
  return response.data.data;
};

const profileService = {
  getProfile,
  updateProfilePicture,
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
};

export default profileService;

