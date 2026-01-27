import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { alterAttendance } from '../features/attendance/attendanceSlice';

function AttendanceAlterationForm({ attendance, onClose }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    checkInTime: '',
    checkOutTime: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (attendance) {
      const date = new Date(attendance.date);
      const checkIn = attendance.checkInTime
        ? new Date(attendance.checkInTime)
        : null;
      const checkOut = attendance.checkOutTime
        ? new Date(attendance.checkOutTime)
        : null;

      setFormData({
        date: date.toISOString().split('T')[0],
        checkInTime: checkIn
          ? `${date.toISOString().split('T')[0]}T${checkIn.toTimeString().split(' ')[0]}`
          : '',
        checkOutTime: checkOut
          ? `${date.toISOString().split('T')[0]}T${checkOut.toTimeString().split(' ')[0]}`
          : '',
        notes: attendance.notes || '',
      });
    }
  }, [attendance]);

  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.checkInTime) {
      newErrors.checkInTime = 'Check-in time is required';
    }

    if (formData.checkOutTime) {
      const checkIn = new Date(formData.checkInTime);
      const checkOut = new Date(formData.checkOutTime);
      if (checkOut <= checkIn) {
        newErrors.checkOutTime = 'Check-out time must be after check-in time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const alterationData = {
        date: formData.date,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime || undefined,
        notes: formData.notes || undefined,
      };

      await dispatch(
        alterAttendance({ id: attendance._id, alterationData })
      ).unwrap();
      toast.success('Attendance record altered successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to alter attendance record');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Alter Attendance Record</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Check-in Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.checkInTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.checkInTime && (
              <p className="text-red-500 text-xs mt-1">{errors.checkInTime}</p>
            )}
          </div>

          {/* Check-out Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Time
            </label>
            <input
              type="datetime-local"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              min={formData.checkInTime}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.checkOutTime ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.checkOutTime && (
              <p className="text-red-500 text-xs mt-1">{errors.checkOutTime}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Leave blank if employee hasn't checked out yet
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Reason for alteration (optional)"
            />
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Altering attendance records will update the
              original record. This action should only be used to correct errors
              or handle special cases.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Alter Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttendanceAlterationForm;




