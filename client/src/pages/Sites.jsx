import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getSites, reset, getSiteEmployees } from '../features/sites/siteSlice';
import SiteForm from '../components/SiteForm';
import SiteAssignmentForm from '../components/SiteAssignmentForm';
import { CardSkeleton } from '../components/Skeleton';
import Spinner from '../components/Spinner';

function Sites() {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showEmployeesModal, setShowEmployeesModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { sites = [], isLoading, isError, message, isSuccess, siteEmployees = [] } = useSelector(
    (state) => state.site
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || 'Failed to load sites');
    }

    dispatch(getSites());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message]);

  useEffect(() => {
    if (isSuccess && showForm && !isLoading) {
      // Only close if we just completed an operation (not from a previous one)
      setShowForm(false);
      setEditingSite(null);
      dispatch(getSites()); // Refresh list
      dispatch(reset()); // Reset success state after handling
    }
  }, [isSuccess, showForm, isLoading, dispatch]);

  const handleAdd = () => {
    // Reset any previous success state before opening form
    dispatch(reset());
    setEditingSite(null);
    setShowForm(true);
  };

  const handleEdit = (site) => {
    // Reset any previous success state before opening form
    dispatch(reset());
    setEditingSite(site);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSite(null);
  };

  const handleViewEmployees = async (site) => {
    setSelectedSite(site);
    setShowEmployeesModal(true);
    setLoadingEmployees(true);
    try {
      await dispatch(getSiteEmployees(site._id)).unwrap();
    } catch (error) {
      toast.error(error || 'Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  if (isLoading && sites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
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
            <h1 className="text-3xl font-bold mb-2">Client Sites</h1>
            <p className="text-indigo-100 text-lg">Manage work locations and site assignments</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowAssignmentForm(true)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Assign Employee
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                + Add Site
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sites Grid */}
      {sites.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p className="text-lg">No sites found</p>
          <p className="text-sm mt-2">Add sites to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div key={site._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {site.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{site.location || 'No location'}</span>
                  </div>
                  {site.description && (
                    <p className="text-gray-500 mt-3">{site.description}</p>
                  )}
                </div>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewEmployees(site)}
                      className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      View Employees
                    </button>
                    <button
                      onClick={() => handleEdit(site)}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Site Form Modal */}
      {showForm && (
        <SiteForm
          site={editingSite}
          onClose={handleCloseForm}
          mode={editingSite ? 'edit' : 'create'}
        />
      )}

      {/* Site Assignment Form Modal */}
      {showAssignmentForm && (
        <SiteAssignmentForm onClose={() => setShowAssignmentForm(false)} />
      )}

      {/* Site Employees Modal */}
      {showEmployeesModal && selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Employees at {selectedSite.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedSite.location || 'No location specified'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEmployeesModal(false);
                  setSelectedSite(null);
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingEmployees ? (
              <div className="flex justify-center items-center py-12">
                <Spinner />
              </div>
            ) : siteEmployees.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-900">No employees assigned</p>
                <p className="mt-2 text-sm text-gray-500">Assign employees to this site to see them here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Employee Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Wage Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {siteEmployees.map((assignment) => (
                      <tr key={assignment._id} className="hover:bg-indigo-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.employeeId?.employeeProfile?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignment.employeeId?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {assignment.employeeId?.employeeProfile?.phoneNumber || 'N/A'}
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
                            {assignment.wageRatePerDay && (
                              <div>Daily: ₹{assignment.wageRatePerDay.toFixed(2)}</div>
                            )}
                            {assignment.wageRatePerMonth && (
                              <div>Monthly: ₹{assignment.wageRatePerMonth.toFixed(2)}</div>
                            )}
                            {!assignment.wageRatePerDay && !assignment.wageRatePerMonth && (
                              <span className="text-gray-400">Not set</span>
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
      )}
    </div>
  );
}

export default Sites;
