import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosInstance';
import AttendanceAlterationForm from '../components/AttendanceAlterationForm';
import Spinner from '../components/Spinner';

/**
 * Attendance Approval Page for Managers
 * View and approve/reject pending attendance records
 */

function AttendanceApproval() {
  const [attendances, setAttendances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [alteringAttendance, setAlteringAttendance] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [wageData, setWageData] = useState({
    wageRatePerDay: '',
    wageRatePerMonth: '',
  });

  useEffect(() => {
    fetchPendingAttendance();
  }, [filter]);

  const fetchPendingAttendance = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/attendance/pending');
      setAttendances(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch attendance records');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (attendanceId, wageData = null) => {
    try {
      const approveData = {
        notes: 'Approved by manager',
      };
      
      if (wageData) {
        if (wageData.wageRatePerDay) {
          approveData.wageRatePerDay = parseFloat(wageData.wageRatePerDay);
        }
        if (wageData.wageRatePerMonth) {
          approveData.wageRatePerMonth = parseFloat(wageData.wageRatePerMonth);
        }
      }

      await axiosInstance.put(`/attendance/${attendanceId}/approve`, approveData);
      toast.success('Attendance approved!');
      fetchPendingAttendance(); // Refresh list
      setSelectedAttendance(null);
      setWageData({ wageRatePerDay: '', wageRatePerMonth: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to approve attendance');
    }
  };

  const handleReject = async (attendanceId, notes) => {
    if (!notes || notes.trim() === '') {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await axiosInstance.put(`/attendance/${attendanceId}/reject`, { notes });
      toast.success('Attendance rejected');
      fetchPendingAttendance(); // Refresh list
      setSelectedAttendance(null);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reject attendance');
    }
  };

  const openDetails = (attendance) => {
    setSelectedAttendance(attendance);
  };

  const closeDetails = () => {
    setSelectedAttendance(null);
    setWageData({ wageRatePerDay: '', wageRatePerMonth: '' });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(attendances.map((a) => a._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one attendance record');
      return;
    }

    try {
      const promises = Array.from(selectedIds).map((id) =>
        axiosInstance.put(`/attendance/${id}/approve`, {
          notes: 'Bulk approved by manager',
        })
      );
      await Promise.all(promises);
      toast.success(`Successfully approved ${selectedIds.size} attendance record(s)!`);
      setSelectedIds(new Set());
      fetchPendingAttendance();
    } catch (error) {
      toast.error('Failed to approve some attendance records');
      console.error(error);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one attendance record');
      return;
    }

    const notes = prompt('Please provide a reason for rejection:');
    if (!notes || notes.trim() === '') {
      toast.error('Rejection reason is required');
      return;
    }

    try {
      const promises = Array.from(selectedIds).map((id) =>
        axiosInstance.put(`/attendance/${id}/reject`, { notes })
      );
      await Promise.all(promises);
      toast.success(`Successfully rejected ${selectedIds.size} attendance record(s)!`);
      setSelectedIds(new Set());
      fetchPendingAttendance();
    } catch (error) {
      toast.error('Failed to reject some attendance records');
      console.error(error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Approval</h1>
        <p className="text-gray-600 mt-2">Review and approve employee attendance records</p>
      </div>

      {/* Filter and Bulk Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pending ({attendances.length})
            </button>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex gap-3">
              <span className="text-sm text-gray-700 self-center">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Bulk Approve
              </button>
              <button
                onClick={handleBulkReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Bulk Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {attendances.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending attendance records to review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === attendances.length && attendances.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.map((attendance) => (
                  <tr key={attendance._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(attendance._id)}
                        onChange={() => handleSelectOne(attendance._id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.employeeId?.email || 
                         attendance.employeeId?.name ||
                         (typeof attendance.employeeId === 'object' && attendance.employeeId?._id ? String(attendance.employeeId._id) : 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
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
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openDetails(attendance)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setAlteringAttendance(attendance)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Alter
                      </button>
                      <button
                        onClick={() => {
                          openDetails(attendance);
                          // Quick approve without wage update
                          handleApprove(attendance._id);
                        }}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Quick Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Attendance Details</h3>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Employee Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedAttendance.employeeId?.email || 
                   selectedAttendance.employeeId?.name ||
                   (typeof selectedAttendance.employeeId === 'object' && selectedAttendance.employeeId?._id ? String(selectedAttendance.employeeId._id) : 'N/A')}
                </p>
              </div>

              {/* Date and Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedAttendance.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Check-in Time</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedAttendance.checkInTime
                      ? new Date(selectedAttendance.checkInTime).toLocaleTimeString()
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Selfie */}
              {selectedAttendance.selfieUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Selfie
                  </label>
                  <img
                    src={selectedAttendance.selfieUrl}
                    alt="Check-in selfie"
                    className="w-full max-w-md rounded-lg border"
                  />
                </div>
              )}

              {/* Location */}
              {selectedAttendance.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-sm text-gray-900">
                    Lat: {selectedAttendance.location.coordinates[1]}, Long:{' '}
                    {selectedAttendance.location.coordinates[0]}
                  </p>
                </div>
              )}

              {/* Wage Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wage Rates (Optional - to update employee's current assignment)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Daily Wage (₹)
                    </label>
                    <input
                      type="number"
                      value={wageData.wageRatePerDay}
                      onChange={(e) =>
                        setWageData({ ...wageData, wageRatePerDay: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="800.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Monthly Salary (₹)
                    </label>
                    <input
                      type="number"
                      value={wageData.wageRatePerMonth}
                      onChange={(e) =>
                        setWageData({ ...wageData, wageRatePerMonth: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="24000.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current wage rates
                </p>
              </div>

              {/* Notes for Rejection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Notes (if rejecting)
                </label>
                <textarea
                  id="rejection-notes"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Provide reason for rejection..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const notes = document.getElementById('rejection-notes').value;
                    handleReject(selectedAttendance._id, notes);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedAttendance._id, wageData);
                    closeDetails();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Alteration Form Modal */}
      {alteringAttendance && (
        <AttendanceAlterationForm
          attendance={alteringAttendance}
          onClose={() => {
            setAlteringAttendance(null);
            fetchPendingAttendance(); // Refresh list
          }}
        />
      )}
    </div>
  );
}

export default AttendanceApproval;

