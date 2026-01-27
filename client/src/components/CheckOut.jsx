import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkOut, getAttendanceHistory } from '../features/attendance/attendanceSlice';
import Spinner from './Spinner';

function CheckOut() {
  const dispatch = useDispatch();
  const { attendances, isLoading } = useSelector((state) => state.attendance);
  const [activeCheckIn, setActiveCheckIn] = useState(null);

  useEffect(() => {
    // Fetch attendance history to find active check-in
    dispatch(getAttendanceHistory());
  }, [dispatch]);

  useEffect(() => {
    // Find today's active check-in (no check-out time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const active = attendances.find((attendance) => {
      const attendanceDate = new Date(attendance.date);
      attendanceDate.setHours(0, 0, 0, 0);
      return attendanceDate.getTime() === today.getTime() && !attendance.checkOutTime;
    });

    setActiveCheckIn(active);
  }, [attendances]);

  const handleCheckOut = async () => {
    try {
      await dispatch(checkOut()).unwrap();
      toast.success('Checked out successfully!');
      setActiveCheckIn(null);
    } catch (error) {
      toast.error(error || 'Failed to check out');
    }
  };

  const calculateHoursWorked = () => {
    if (!activeCheckIn) return '0h 0m';
    
    const checkInTime = new Date(activeCheckIn.checkInTime);
    const now = new Date();
    const diff = now - checkInTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!activeCheckIn) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Check-out</h2>
        <p className="text-gray-600">You don't have an active check-in today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Active Check-in</h2>
      
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Check-in Time:</span>
          <span className="font-medium">
            {new Date(activeCheckIn.checkInTime).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Hours Worked:</span>
          <span className="font-medium text-indigo-600">{calculateHoursWorked()}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            activeCheckIn.status === 'approved' ? 'bg-green-100 text-green-800' :
            activeCheckIn.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {activeCheckIn.status}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckOut}
        className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
      >
        🕐 Punch Out
      </button>
    </div>
  );
}

export default CheckOut;

