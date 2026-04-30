import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getCurrentSite } from '../features/sites/siteSlice';
import { getProfile } from '../features/profile/profileSlice';
import { getPayoutHistory } from '../features/payouts/payoutSlice';
import { getCurrentMonthSummary } from '../features/attendance/attendanceSlice';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import Spinner from '../components/Spinner';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatINR(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function periodToLabel(period) {
  // period = "2025-01"
  const [year, month] = period.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

function daysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

// ─── custom tooltip for the chart ───────────────────────────────────────────

function EarningsTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-500">
        Gross: <span className="text-gray-800 font-medium">{formatINR(d.grossPay)}</span>
      </p>
      <p className="text-red-400">
        Deductions: <span className="font-medium">{formatINR(d.deductions)}</span>
      </p>
      <p className="text-indigo-600">
        Net Pay: <span className="font-semibold">{formatINR(d.netPay)}</span>
      </p>
    </div>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colors[accent]}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{label}</p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { site, isLoading: siteLoading } = useSelector((state) => state.site);
  const { profile } = useSelector((state) => state.profile);
  const { payouts } = useSelector((state) => state.payout);
  const { monthSummary } = useSelector((state) => state.attendance);

  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isEmployee) {
      dispatch(getCurrentSite());
      dispatch(getProfile());
      dispatch(getPayoutHistory());
      dispatch(getCurrentMonthSummary());
    }
  }, [user, navigate, dispatch, isEmployee]);

  // ── derived earnings data ──────────────────────────────────────────────────

  const totalEarned = Array.isArray(payouts)
    ? payouts.reduce((sum, p) => sum + (p.netPay || 0), 0)
    : 0;

  const wageRatePerMonth = site?.wageRatePerMonth || 0;
  const wageRatePerDay = site?.wageRatePerDay || 0;
  const approvedDays = monthSummary?.approvedDays || 0;
  const daysInMonth = daysInCurrentMonth();

  let thisMonthEstimate = 0;
  if (wageRatePerMonth > 0) {
    thisMonthEstimate = (wageRatePerMonth / daysInMonth) * approvedDays;
  } else if (wageRatePerDay > 0) {
    thisMonthEstimate = wageRatePerDay * approvedDays;
  }

  const chartData = Array.isArray(payouts)
    ? [...payouts]
        .sort((a, b) => a.period.localeCompare(b.period))
        .map((p) => ({
          label: periodToLabel(p.period),
          netPay: p.netPay || 0,
          grossPay: p.grossPay || 0,
          deductions: p.deductions || 0,
        }))
    : [];

  // ── profile display values ─────────────────────────────────────────────────

  const displayName =
    profile?.profile?.name ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'Employee';

  const avatarSrc =
    profile?.user?.profilePicture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=200`;

  const siteName = site?.siteId?.name;

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Employee view ─────────────────────────────────────────────────── */}
      {isEmployee && (
        <>
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="shrink-0">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/40 shadow"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff&size=200`;
                  }}
                />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-indigo-200 text-xs sm:text-sm font-medium">Welcome back</p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">{displayName}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white capitalize">
                    {user?.role}
                  </span>
                  {siteName && (
                    <span className="flex items-center gap-1 text-indigo-100 text-xs sm:text-sm truncate">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {siteName}
                    </span>
                  )}
                </div>
              </div>
              {/* Profile link */}
              <div className="shrink-0">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-200 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Total Earned"
              value={formatINR(totalEarned)}
              sub={Array.isArray(payouts) && payouts.length > 0 ? `across ${payouts.length} payout${payouts.length !== 1 ? 's' : ''}` : 'No payouts yet'}
              accent="indigo"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="This Month (Est.)"
              value={formatINR(Math.round(thisMonthEstimate))}
              sub={`${approvedDays} approved day${approvedDays !== 1 ? 's' : ''} · estimated`}
              accent="emerald"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StatCard
              label="Days Worked (This Month)"
              value={monthSummary?.totalDays || 0}
              sub={`${approvedDays} approved · ${monthSummary?.pendingDays || 0} pending`}
              accent="amber"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          {/* Earnings Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Earnings Growth</h2>
              {chartData.length > 0 && (
                <span className="text-xs text-gray-400">{chartData.length} month{chartData.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <svg className="w-10 h-10 mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium">No payout data yet</p>
                <p className="text-xs mt-0.5">Your earnings chart will appear once payouts are processed</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    width={42}
                  />
                  <Tooltip content={<EarningsTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="netPay"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#earningsGradient)"
                    dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#6366f1' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Current Site Assignment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Current Site Assignment
            </h2>
            {siteLoading ? (
              <Spinner />
            ) : site && site.siteId ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Site</p>
                  <p className="text-sm text-gray-900 mt-0.5 font-medium">{site.siteId.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm text-gray-900 mt-0.5">{site.siteId.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Daily Rate</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {site.wageRatePerDay ? formatINR(site.wageRatePerDay) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monthly Rate</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {site.wageRatePerMonth ? formatINR(site.wageRatePerMonth) : 'N/A'}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned From</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {site.startDate ? new Date(site.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No site assigned yet</p>
            )}
          </div>

          {/* Check In / Check Out */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CheckIn />
            <CheckOut />
          </div>
        </>
      )}

      {/* ── Admin / Manager view (unchanged) ─────────────────────────────── */}
      {user && (user.role === 'admin' || user.role === 'manager') && (
        <>
          <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user.name || user.email?.split('@')[0]}!
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base md:text-lg">FeroCrafts HRMS Dashboard</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 transform transition-all duration-300 hover:shadow-lg border border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/employees" className="flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all duration-200 transform hover:scale-[1.02] group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Manage Employees
                </Link>
                <Link to="/attendance/approval" className="flex items-center px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all duration-200 transform hover:scale-[1.02] group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Approve Attendance
                </Link>
                <Link to="/sites" className="flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 transform hover:scale-[1.02] group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  Manage Sites
                </Link>
                <Link to="/payouts" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-[1.02] group">
                  <span className="mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  View Payouts
                </Link>
                {(user.role === 'admin' || user.role === 'manager') && (
                  <Link to="/admin" className="flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 transform hover:scale-[1.02] group">
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
              <p className="text-sm text-gray-600 mb-4">Access comprehensive management tools from the navigation menu.</p>
              <div className="space-y-2 text-sm">
                {['Employee Management', 'Site Management', 'Attendance Approval', 'Payout Management'].map((item) => (
                  <div key={item} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </div>
                ))}
                {user.role === 'admin' && (
                  <div className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    User Registration
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
