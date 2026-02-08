import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getPayoutHistory, reset, getPayoutSlip } from '../features/payouts/payoutSlice';
import { getEmployees } from '../features/employees/employeeSlice';
import PayoutGenerationForm from '../components/PayoutGenerationForm';
import { TableSkeleton } from '../components/Skeleton';
import Spinner from '../components/Spinner';

function Payouts() {
  const dispatch = useDispatch();
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [filters, setFilters] = useState({
    employeeId: '',
    period: '',
  });
  const { user } = useSelector((state) => state.auth);
  const { employees = [] } = useSelector((state) => state.employee);
  const { payouts = [], isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.payout
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load payouts');
    }

    if ((user?.role === 'admin' || user?.role === 'manager') && employees.length === 0) {
      dispatch(getEmployees());
    }

    dispatch(getPayoutHistory());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, user, employees.length]);

  useEffect(() => {
    if (isSuccess && showGenerateForm && !isLoading) {
      // Only close if we just completed an operation (not from a previous one)
      setShowGenerateForm(false);
      dispatch(getPayoutHistory()); // Refresh list
      dispatch(reset()); // Reset success state after handling
    }
  }, [isSuccess, showGenerateForm, isLoading, dispatch]);

  const handleDownloadSlip = async (payoutId) => {
    setDownloadingId(payoutId);
    try {
      const result = await dispatch(getPayoutSlip(payoutId)).unwrap();
      if (result.url) {
        // Open PDF in new tab
        window.open(result.url, '_blank');
        toast.success('Payout slip opened in new tab');
      } else {
        toast.error('PDF URL not available');
      }
    } catch (error) {
      toast.error(error || 'Failed to download payout slip');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    if (filters.employeeId && payout.employeeId?._id !== filters.employeeId) {
      return false;
    }
    if (filters.period && payout.period !== filters.period) {
      return false;
    }
    return true;
  });

  if (isLoading && payouts.length === 0) {
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user?.role === 'employee' ? 'My Payouts' : 'Payouts'}
            </h1>
            <p className="text-indigo-100 text-lg">View salary and payment records</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => {
                dispatch(reset()); // Reset any previous success state before opening form
                setShowGenerateForm(true);
              }}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Generate Payouts
            </button>
          )}
        </div>
      </div>

      {/* Filters (for Manager/Admin) */}
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Employee
              </label>
              <select
                value={filters.employeeId}
                onChange={(e) =>
                  setFilters({ ...filters, employeeId: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Employees</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee.user?._id || employee._id}>
                    {employee.name} ({employee.user?.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Period
              </label>
              <input
                type="month"
                value={filters.period}
                onChange={(e) =>
                  setFilters({ ...filters, period: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ employeeId: '', period: '' })}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No payout records found</p>
            <p className="text-sm mt-2">Payouts will appear here once generated</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Worked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
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
                {filteredPayouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-gray-50">
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payout.employeeId?.name || payout.employeeId?.email || 'N/A'}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payout.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payout.totalDaysWorked}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{payout.grossPay?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{payout.deductions?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">
                        ₹{payout.netPay?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payout.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownloadSlip(payout._id)}
                        disabled={downloadingId === payout._id}
                        className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
                      >
                        {downloadingId === payout._id ? 'Generating...' : 'Download Slip'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Generation Form Modal */}
      {showGenerateForm && (
        <PayoutGenerationForm onClose={() => setShowGenerateForm(false)} />
      )}
    </div>
  );
}

export default Payouts;
