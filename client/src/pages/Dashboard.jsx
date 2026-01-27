import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getCurrentSite } from '../features/sites/siteSlice';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import Spinner from '../components/Spinner';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { site, isLoading: siteLoading } = useSelector((state) => state.site);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch data immediately when user is available
    if (user.role === 'employee') {
      dispatch(getCurrentSite());
    }
  }, [user, navigate, dispatch]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white transform transition-all duration-300 hover:shadow-xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user && (user.name || user.email?.split('@')[0])}!
        </h1>
        <p className="text-indigo-100 text-sm sm:text-base md:text-lg">FeroCrafts HRMS Dashboard</p>
      </div>

      {user && user.role === 'employee' && (
        <>
          {/* Current Site Assignment */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Current Site Assignment
            </h2>
            {siteLoading ? (
              <Spinner />
            ) : site && site.siteId ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {site.siteId.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {site.siteId.location || 'N/A'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Wage Rate (Per Day)
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {site.wageRatePerDay
                        ? `₹${site.wageRatePerDay.toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Wage Rate (Per Month)
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {site.wageRatePerMonth
                        ? `₹${site.wageRatePerMonth.toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Assignment Start Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {site.startDate
                      ? new Date(site.startDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No site assigned</p>
            )}
          </div>

          {/* Check In/Out */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CheckIn />
            <CheckOut />
          </div>
        </>
      )}

      {user && (user.role === 'admin' || user.role === 'manager') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/employees"
                className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                Manage Employees
              </Link>
              <Link
                to="/attendance/approval"
                className="flex items-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                Approve Attendance
              </Link>
              <Link
                to="/sites"
                className="flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                Manage Sites
              </Link>
              <Link
                to="/payouts"
                className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-[1.02] group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                View Payouts
              </Link>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link
                  to="/admin"
                  className="flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 transform hover:scale-[1.02] group"
                >
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Management Dashboard'}
                </Link>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              System Overview
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Access comprehensive management tools from the navigation menu.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Employee Management
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Site Management
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Attendance Approval
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Payout Management
              </div>
              {user.role === 'admin' && (
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  User Registration
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
