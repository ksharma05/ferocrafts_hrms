import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getProfile,
  updateProfilePicture,
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
  reset,
} from '../features/profile/profileSlice';
import Spinner from '../components/Spinner';
import { FaCamera, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaMoneyBillWave, FaIdCard } from 'react-icons/fa';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.profile
  );

  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getProfile());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        toast.error('Only JPEG, PNG, and WEBP images are allowed');
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      await dispatch(updateProfilePicture(formData)).unwrap();
      toast.success('Profile picture updated successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
      dispatch(getProfile());
    } catch (error) {
      toast.error(error || 'Failed to update profile picture');
    }
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      toast.error('Please enter a new email');
      return;
    }

    try {
      const result = await dispatch(requestEmailChangeOTP(newEmail)).unwrap();
      toast.success(result.message || 'OTP sent to your new email');
      setOtpSent(true);
      
      // For development, show OTP in console
      if (result.otp) {
        console.log('Development OTP:', result.otp);
        toast.info(`Development OTP: ${result.otp}`);
      }
    } catch (error) {
      toast.error(error || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    try {
      await dispatch(verifyEmailChangeOTP(otp)).unwrap();
      toast.success('Email updated successfully!');
      setShowEmailChange(false);
      setNewEmail('');
      setOtp('');
      setOtpSent(false);
      dispatch(getProfile());
    } catch (error) {
      toast.error(error || 'Failed to verify OTP');
    }
  };

  if (isLoading && !profile) {
    return <Spinner />;
  }

  const profilePicture = previewUrl || profile?.user?.profilePicture || '/default-avatar.png';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-indigo-100 text-sm sm:text-base md:text-lg">
          View and manage your profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Picture Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Profile Picture
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-indigo-100"
                  onError={(e) => {
                    e.target.src = 'https://ui-avatars.com/api/?name=' + 
                      encodeURIComponent(profile?.profile?.name || user?.email || 'User') +
                      '&background=6366f1&color=fff&size=200';
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 sm:p-3 rounded-full hover:bg-indigo-700 shadow-lg transition-all"
                >
                  <FaCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFile && (
                <div className="mt-4 w-full space-y-2">
                  <p className="text-sm text-gray-600 text-center truncate">
                    {selectedFile.name}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProfilePictureUpload}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
                    >
                      {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <p className="text-base text-gray-900">
                  {profile?.profile?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaEnvelope className="text-indigo-600" />
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-900 flex-1 break-all">
                    {profile?.user?.email || 'N/A'}
                  </p>
                  <button
                    onClick={() => setShowEmailChange(!showEmailChange)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium whitespace-nowrap"
                  >
                    Change
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-base text-gray-900">
                  {profile?.profile?.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <p className="text-base text-gray-900">
                  {profile?.profile?.dob
                    ? new Date(profile.profile.dob).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <FaIdCard className="text-indigo-600" />
                  Aadhaar Number
                </label>
                <p className="text-base text-gray-900">
                  {profile?.profile?.aadhaarNo || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                  {profile?.user?.role || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Current Site Assignment */}
          {profile?.currentSite && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaBuilding className="text-indigo-600" />
                Current Site Assignment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <p className="text-base text-gray-900">
                    {profile.currentSite.site?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-600" />
                    Location
                  </label>
                  <p className="text-base text-gray-900">
                    {profile.currentSite.site?.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaMoneyBillWave className="text-indigo-600" />
                    Wage Rate (Per Day)
                  </label>
                  <p className="text-base text-gray-900">
                    ₹{profile.currentSite.wageRatePerDay?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaMoneyBillWave className="text-indigo-600" />
                    Wage Rate (Per Month)
                  </label>
                  <p className="text-base text-gray-900">
                    ₹{profile.currentSite.wageRatePerMonth?.toFixed(2) || 'N/A'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Start Date
                  </label>
                  <p className="text-base text-gray-900">
                    {profile.currentSite.startDate
                      ? new Date(profile.currentSite.startDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Banking Details */}
          {profile?.profile?.bankDetails && (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Banking Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <p className="text-base text-gray-900 font-mono">
                    {profile.profile.bankDetails.accountNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IFSC Code
                  </label>
                  <p className="text-base text-gray-900 font-mono">
                    {profile.profile.bankDetails.ifscCode || 'N/A'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <p className="text-base text-gray-900 font-mono">
                    {profile.profile.upiId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Change Modal */}
      {showEmailChange && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Change Email
              </h3>
              <button
                onClick={() => {
                  setShowEmailChange(false);
                  setNewEmail('');
                  setOtp('');
                  setOtpSent(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter new email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    OTP sent to: <strong>{newEmail}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

