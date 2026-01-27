import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { generatePayouts } from '../features/payouts/payoutSlice';
import { getEmployees } from '../features/employees/employeeSlice';

function PayoutGenerationForm({ onClose }) {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    period: '',
    employeeId: '',
    generateFor: 'all', // 'all' or 'employee'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch employees if not already loaded
    if (employees.length === 0) {
      dispatch(getEmployees());
    }
  }, [dispatch, employees.length]);

  // Set default period to current month
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    setFormData((prev) => ({
      ...prev,
      period: prev.period || `${year}-${month}`,
    }));
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.period) {
      newErrors.period = 'Period is required';
    } else if (!/^\d{4}-\d{2}$/.test(formData.period)) {
      newErrors.period = 'Period must be in YYYY-MM format (e.g., 2024-01)';
    }

    if (formData.generateFor === 'employee' && !formData.employeeId) {
      newErrors.employeeId = 'Employee is required when generating for specific employee';
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
      const generateData = {
        period: formData.period,
        ...(formData.generateFor === 'employee' && formData.employeeId
          ? { employeeId: formData.employeeId }
          : {}),
      };

      const result = await dispatch(generatePayouts(generateData)).unwrap();
      toast.success(
        `Successfully generated ${result.count || result.data?.length || 0} payout(s)!`
      );
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to generate payouts');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Generate Payouts</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pay Period <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.period ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: YYYY-MM (e.g., 2024-01 for January 2024)
            </p>
            {errors.period && (
              <p className="text-red-500 text-xs mt-1">{errors.period}</p>
            )}
          </div>

          {/* Generate For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Generate For <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="generateFor"
                  value="all"
                  checked={formData.generateFor === 'all'}
                  onChange={handleChange}
                  className="mr-2"
                />
                All Employees
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="generateFor"
                  value="employee"
                  checked={formData.generateFor === 'employee'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Specific Employee
              </label>
            </div>
          </div>

          {/* Employee Selection (if specific employee) */}
          {formData.generateFor === 'employee' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.user?._id || employee._id}>
                    {employee.name} ({employee.user?.email})
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
              )}
            </div>
          )}

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Payouts will be calculated based on approved attendance
              records for the selected period. Make sure attendance is approved before
              generating payouts.
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
              {isLoading ? 'Generating...' : 'Generate Payouts'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PayoutGenerationForm;




