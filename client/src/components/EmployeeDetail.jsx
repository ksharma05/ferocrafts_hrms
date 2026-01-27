import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getEmployee } from '../features/employees/employeeSlice';
import Spinner from '../components/Spinner';

function EmployeeDetail({ employeeId, onClose }) {
  const dispatch = useDispatch();
  const { employee, isLoading, isError, message } = useSelector(
    (state) => state.employee
  );

  useEffect(() => {
    if (employeeId) {
      dispatch(getEmployee(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load employee details');
    }
  }, [isError, message]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!employee || !employee._id) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold">Employee Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{employee.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.user?.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.phoneNumber || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.aadhaarNo || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.dob
                    ? new Date(employee.dob).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                    {employee.user?.role || 'N/A'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
              Bank Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Number
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.bankDetails?.accountNumber || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.bankDetails?.ifscCode || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                <p className="mt-1 text-sm text-gray-900">{employee.upiId || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {employee.documents && employee.documents.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                Documents
              </h4>
              <div className="space-y-2">
                {employee.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">{doc.name}</span>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;




