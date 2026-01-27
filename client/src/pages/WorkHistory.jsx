import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getWorkHistory, reset } from '../features/sites/siteSlice';
import { TableSkeleton } from '../components/Skeleton';
import Spinner from '../components/Spinner';

function WorkHistory() {
  const dispatch = useDispatch();
  const { workHistory, isLoading, isError, message } = useSelector(
    (state) => state.site
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load work history');
    }

    dispatch(getWorkHistory());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);


  if (isLoading && workHistory.length === 0) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Work History</h1>
        <p className="text-gray-600 mt-2">View your site assignment history</p>
      </div>

      {/* Work History List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {workHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">No work history found</p>
            <p className="text-sm mt-2">Your site assignments will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wage Rates
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workHistory.map((assignment) => (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.siteId?.name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.siteId?.location || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.startDate
                          ? new Date(assignment.startDate).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.endDate
                          ? new Date(assignment.endDate).toLocaleDateString()
                          : 'Ongoing'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.wageRatePerDay && (
                          <div>Daily: ₹{assignment.wageRatePerDay.toFixed(2)}</div>
                        )}
                        {assignment.wageRatePerMonth && (
                          <div>Monthly: ₹{assignment.wageRatePerMonth.toFixed(2)}</div>
                        )}
                        {!assignment.wageRatePerDay && !assignment.wageRatePerMonth && (
                          <div>N/A</div>
                        )}
                      </div>
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

export default WorkHistory;

