import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEmployees, reset } from '../features/employees/employeeSlice';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeDetail from '../components/EmployeeDetail';
import ConfirmDialog from '../components/ConfirmDialog';
import { TableSkeleton } from '../components/Skeleton';
import Spinner from '../components/Spinner';
import { deleteEmployee } from '../features/employees/employeeSlice';

function Employees() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployeeId, setViewingEmployeeId] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { employees = [], isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.employee
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load employees');
    }

    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(getEmployees());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  useEffect(() => {
    if (isSuccess && showForm && !isLoading) {
      // Only close if we just completed an operation (not from a previous one)
      setShowForm(false);
      setEditingEmployee(null);
      dispatch(getEmployees()); // Refresh list
      dispatch(reset()); // Reset success state after handling
    }
  }, [isSuccess, showForm, isLoading, dispatch]);

  const handleAdd = () => {
    // Reset any previous success state before opening form
    dispatch(reset());
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    // Reset any previous success state before opening form
    dispatch(reset());
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleView = (employee) => {
    setViewingEmployeeId(employee._id);
    setShowDetail(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setViewingEmployeeId(null);
  };

  const handleDelete = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deletingEmployee) {
      try {
        await dispatch(deleteEmployee(deletingEmployee._id)).unwrap();
        toast.success('Employee deleted successfully!');
        dispatch(getEmployees()); // Refresh list
      } catch (error) {
        toast.error(error || 'Failed to delete employee');
      }
    }
    setDeletingEmployee(null);
  };

  if (isLoading && employees.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <TableSkeleton rows={5} columns={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Employees</h1>
            <p className="text-indigo-100 text-sm sm:text-base md:text-lg">Manage employee profiles and information</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={handleAdd}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
            >
              + Add Employee
            </button>
          )}
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden border border-gray-100">
        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-900">No employees found</p>
            <p className="mt-2 text-sm text-gray-500">Add employees to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-indigo-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {employee.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 capitalize">
                        {employee.user?.role || 'N/A'}
                      </span>
                    </td>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => handleView(employee)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium px-2 sm:px-3 py-1 rounded-md hover:bg-indigo-50 transition-all duration-200 text-xs sm:text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium px-2 sm:px-3 py-1 rounded-md hover:bg-indigo-50 transition-all duration-200 text-xs sm:text-sm"
                          >
                            Edit
                          </button>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(employee)}
                              className="text-red-600 hover:text-red-800 font-medium px-2 sm:px-3 py-1 rounded-md hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={handleCloseForm}
          mode={editingEmployee ? 'edit' : 'create'}
        />
      )}

      {/* Employee Detail Modal */}
      {showDetail && viewingEmployeeId && (
        <EmployeeDetail
          employeeId={viewingEmployeeId}
          onClose={handleCloseDetail}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingEmployee(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deletingEmployee?.name || 'this employee'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default Employees;
