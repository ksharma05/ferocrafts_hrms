import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createEmployee, updateEmployee } from '../features/employees/employeeSlice';

function EmployeeForm({ employee, onClose, mode = 'create' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
    name: '',
    phoneNumber: '',
    aadhaarNo: '',
    dob: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
    },
    upiId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && employee) {
      setFormData({
        email: employee.user?.email || '',
        password: '', // Don't pre-fill password
        role: employee.user?.role || 'employee',
        name: employee.name || '',
        phoneNumber: employee.phoneNumber || '',
        aadhaarNo: employee.aadhaarNo || '',
        dob: employee.dob ? new Date(employee.dob).toISOString().split('T')[0] : '',
        bankDetails: {
          accountNumber: employee.bankDetails?.accountNumber || '',
          ifscCode: employee.bankDetails?.ifscCode || '',
        },
        upiId: employee.upiId || '',
      });
    }
  }, [employee, mode]);

  // Reset role to employee if manager tries to select admin
  useEffect(() => {
    if (mode === 'create' && user?.role === 'manager' && formData.role === 'admin') {
      setFormData((prev) => ({ ...prev, role: 'employee' }));
    }
  }, [mode, user?.role, formData.role]);

  const validate = () => {
    const newErrors = {};

    if (mode === 'create' && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (
      formData.password &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (!formData.aadhaarNo) {
      newErrors.aadhaarNo = 'Aadhaar number is required';
    } else if (!/^[0-9]{12}$/.test(formData.aadhaarNo)) {
      newErrors.aadhaarNo = 'Aadhaar number must be exactly 12 digits';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (new Date(formData.dob) > new Date()) {
      newErrors.dob = 'Date of birth cannot be in the future';
    }

    if (formData.bankDetails.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bankDetails.ifscCode)) {
      newErrors.ifscCode = 'Please provide a valid IFSC code';
    }

    // Prevent managers from creating admin accounts
    if (mode === 'create' && user?.role === 'manager' && formData.role === 'admin') {
      newErrors.role = 'Managers cannot create admin accounts. Please select Employee role.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent managers from selecting admin role
    if (name === 'role' && user?.role === 'manager' && value === 'admin') {
      toast.error('Managers cannot create admin accounts');
      return;
    }
    
    if (name === 'accountNumber' || name === 'ifscCode') {
      setFormData({
        ...formData,
        bankDetails: {
          ...formData.bankDetails,
          [name]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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
      const submitData = { ...formData };
      
      // Don't send password if empty in edit mode
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }
      
      // Don't send email/role in edit mode (they're in User model, not EmployeeProfile)
      if (mode === 'edit') {
        delete submitData.email;
        delete submitData.role;
      }

      if (mode === 'create') {
        await dispatch(createEmployee(submitData)).unwrap();
        toast.success('Employee created successfully!');
      } else {
        await dispatch(updateEmployee({ id: employee._id, employeeData: submitData })).unwrap();
        toast.success('Employee updated successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to save employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Add New Employee' : 'Edit Employee'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' ? 'Fill in the details to create a new employee profile' : 'Update employee information'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (create only) */}
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="employee@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {mode === 'create' && <span className="text-red-500">*</span>}
              {mode === 'edit' && <span className="text-gray-500 text-xs">(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={mode === 'edit' ? 'Enter new password (optional)' : 'Password'}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Role (create only) */}
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="employee">Employee</option>
                {user?.role === 'admin' && (
                  <>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </>
                )}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="9876543210"
              maxLength="10"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="aadhaarNo"
              value={formData.aadhaarNo}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.aadhaarNo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123456789012"
              maxLength="12"
            />
            {errors.aadhaarNo && (
              <p className="text-red-500 text-xs mt-1">{errors.aadhaarNo}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 ${
                errors.dob ? 'border-red-500' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Bank Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.bankDetails.accountNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 ${
                  errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="IFSC0001234"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.ifscCode && (
                <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
              )}
            </div>
          </div>

          {/* UPI ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="user@upi"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                mode === 'create' ? 'Create Employee' : 'Update Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;

