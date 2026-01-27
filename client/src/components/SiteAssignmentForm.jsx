import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { assignEmployeeToSite } from '../features/sites/siteSlice';
import { getEmployees } from '../features/employees/employeeSlice';

function SiteAssignmentForm({ onClose }) {
  const dispatch = useDispatch();
  const { sites } = useSelector((state) => state.site);
  const { employees } = useSelector((state) => state.employee);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    siteId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    wageRatePerDay: '',
    wageRatePerMonth: '',
    wageType: 'daily', // 'daily' or 'monthly'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch employees if not already loaded
    if (employees.length === 0) {
      dispatch(getEmployees());
    }
  }, [dispatch, employees.length]);

  const validate = () => {
    const newErrors = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'Employee is required';
    }

    if (!formData.siteId) {
      newErrors.siteId = 'Site is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.wageType === 'daily') {
      if (!formData.wageRatePerDay || parseFloat(formData.wageRatePerDay) <= 0) {
        newErrors.wageRatePerDay = 'Daily wage rate is required and must be positive';
      }
    } else {
      if (!formData.wageRatePerMonth || parseFloat(formData.wageRatePerMonth) <= 0) {
        newErrors.wageRatePerMonth = 'Monthly wage rate is required and must be positive';
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

  const handleWageTypeChange = (e) => {
    const wageType = e.target.value;
    setFormData({
      ...formData,
      wageType,
      wageRatePerDay: wageType === 'daily' ? formData.wageRatePerDay : '',
      wageRatePerMonth: wageType === 'monthly' ? formData.wageRatePerMonth : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const assignmentData = {
        employeeId: formData.employeeId,
        siteId: formData.siteId,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        wageRatePerDay: formData.wageType === 'daily' ? parseFloat(formData.wageRatePerDay) : undefined,
        wageRatePerMonth: formData.wageType === 'monthly' ? parseFloat(formData.wageRatePerMonth) : undefined,
      };

      await dispatch(assignEmployeeToSite(assignmentData)).unwrap();
      toast.success('Employee assigned to site successfully!');
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to assign employee to site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Assign Employee to Site</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee Selection */}
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

          {/* Site Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site <span className="text-red-500">*</span>
            </label>
            <select
              name="siteId"
              value={formData.siteId}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.siteId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.name} - {site.location}
                </option>
              ))}
            </select>
            {errors.siteId && (
              <p className="text-red-500 text-xs mt-1">{errors.siteId}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* End Date (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for ongoing assignment
            </p>
          </div>

          {/* Wage Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wage Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wageType"
                  value="daily"
                  checked={formData.wageType === 'daily'}
                  onChange={handleWageTypeChange}
                  className="mr-2"
                />
                Daily Wage
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wageType"
                  value="monthly"
                  checked={formData.wageType === 'monthly'}
                  onChange={handleWageTypeChange}
                  className="mr-2"
                />
                Monthly Salary
              </label>
            </div>
          </div>

          {/* Daily Wage Rate */}
          {formData.wageType === 'daily' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Wage Rate (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="wageRatePerDay"
                value={formData.wageRatePerDay}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.wageRatePerDay ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="800.00"
              />
              {errors.wageRatePerDay && (
                <p className="text-red-500 text-xs mt-1">{errors.wageRatePerDay}</p>
              )}
            </div>
          )}

          {/* Monthly Wage Rate */}
          {formData.wageType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Salary (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="wageRatePerMonth"
                value={formData.wageRatePerMonth}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.wageRatePerMonth ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="24000.00"
              />
              {errors.wageRatePerMonth && (
                <p className="text-red-500 text-xs mt-1">{errors.wageRatePerMonth}</p>
              )}
            </div>
          )}

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
              {isLoading ? 'Assigning...' : 'Assign Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SiteAssignmentForm;




