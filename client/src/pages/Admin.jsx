import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosInstance';
import { getEmployees } from '../features/employees/employeeSlice';
import { getSites } from '../features/sites/siteSlice';
import UserRegistrationForm from '../components/UserRegistrationForm';
import Spinner from '../components/Spinner';

function Admin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employees } = useSelector((state) => state.employee);
  const { sites } = useSelector((state) => state.site);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalSites: 0,
    pendingAttendance: 0,
    totalPayouts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Redirect non-admin users to dashboard
    if (user.role !== 'admin' && user.role !== 'manager') {
      navigate('/');
      return;
    }

    fetchStats();
    dispatch(getEmployees());
    dispatch(getSites());
  }, [user, navigate, dispatch]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Fetch pending attendance count
      const attendanceRes = await axiosInstance.get('/attendance/pending');
      const pendingCount = attendanceRes.data.count || 0;

      // Fetch payouts count for current month
      const payoutsRes = await axiosInstance.get('/payouts/history');
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const currentMonthPayouts = payoutsRes.data.data?.filter(
        (p) => p.period === currentMonth
      ).length || 0;

      setStats({
        totalEmployees: employees.length,
        totalSites: sites.length,
        pendingAttendance: pendingCount,
        totalPayouts: currentMonthPayouts,
      });
    } catch (error) {
      toast.error('Failed to load statistics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (employees.length > 0 || sites.length > 0) {
      fetchStats();
    }
  }, [employees.length, sites.length]);

  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return null;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Management Dashboard'}
            </h1>
            <p className="text-indigo-100 text-lg">Welcome, {user.name || user.email?.split('@')[0]}</p>
          </div>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            + Register User
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalEmployees}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Sites</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalSites}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pending Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.pendingAttendance}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Payouts (This Month)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalPayouts}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* User Registration Form Modal */}
      {showRegisterForm && (
        <UserRegistrationForm onClose={() => setShowRegisterForm(false)} />
      )}
    </div>
  );
}

export default Admin;

