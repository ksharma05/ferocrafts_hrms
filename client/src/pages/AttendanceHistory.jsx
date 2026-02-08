import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getAttendanceHistory, reset } from '../features/attendance/attendanceSlice';
import { TableSkeleton } from '../components/Skeleton';
import Spinner from '../components/Spinner';

function AttendanceHistory() {
  const dispatch = useDispatch();
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: '',
  });
  const { attendances = [], isLoading, isError, message } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load attendance history');
    }

    dispatch(getAttendanceHistory());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const filteredAttendances = attendances.filter((attendance) => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    const attendanceDate = new Date(attendance.date);
    if (dateFilter.startDate && attendanceDate < new Date(dateFilter.startDate)) {
      return false;
    }
    if (dateFilter.endDate && attendanceDate > new Date(dateFilter.endDate)) {
      return false;
    }
    return true;
  });

  if (isLoading && attendances.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <TableSkeleton rows={5} columns={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Attendance History</h1>
        <p className="text-gray-600 mt-2">View your attendance records</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, endDate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setDateFilter({ startDate: '', endDate: '' })}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAttendances.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No attendance records found</p>
            <p className="text-sm mt-2">
              {dateFilter.startDate || dateFilter.endDate
                ? 'Try adjusting your date filters'
                : 'Your attendance records will appear here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours Worked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(attendance.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attendance.checkInTime
                          ? new Date(attendance.checkInTime).toLocaleTimeString()
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attendance.checkOutTime
                          ? new Date(attendance.checkOutTime).toLocaleTimeString()
                          : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateHours(attendance.checkInTime, attendance.checkOutTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          attendance.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : attendance.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceHistory;




