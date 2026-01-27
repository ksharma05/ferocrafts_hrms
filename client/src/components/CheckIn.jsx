import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIn } from '../features/attendance/attendanceSlice';
import CameraCapture from './CameraCapture';
import Spinner from './Spinner';

function CheckIn() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.attendance);
  const [showCamera, setShowCamera] = useState(false);

  const handleCapturePhoto = (blob) => {
    setShowCamera(false);
    // Proceed with check-in
    processCheckIn(blob);
  };

  const processCheckIn = (photoBlob) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Create FormData to send file
        const formData = new FormData();
        formData.append('selfie', photoBlob, 'selfie.jpg');
        formData.append('location', JSON.stringify({
          type: 'Point',
          coordinates: [longitude, latitude],
        }));

        try {
          await dispatch(checkIn(formData)).unwrap();
          toast.success('Checked in successfully!');
        } catch (error) {
          toast.error(error || 'Failed to check in');
        }
      },
      (error) => {
        console.error('Location error:', error);
        toast.error('Unable to get your location. Please enable location services.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Attendance Check-in</h2>
      <p className="text-gray-600 mb-4">
        Click the button below to check in. You'll need to allow camera and location access.
      </p>
      <button
        onClick={() => setShowCamera(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
      >
        📸 Punch In
      </button>

      {showCamera && (
        <CameraCapture
          onCapture={handleCapturePhoto}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default CheckIn;
