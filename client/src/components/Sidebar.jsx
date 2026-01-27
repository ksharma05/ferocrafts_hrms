import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSignOutAlt } from 'react-icons/fa';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col gap-y-5 overflow-y-auto 
        border-r border-gray-200 bg-white px-6 
        w-64 lg:w-64 h-screen
        dark:border-white/10 dark:bg-gray-900
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="relative flex h-16 shrink-0 items-center">
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="FeroCrafts" className="h-8 w-auto dark:hidden" />
        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="FeroCrafts" className="h-8 w-auto hidden dark:block" />
      </div>
      <nav className="relative flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                    isActive('/')
                      ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                    <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Dashboard
                </Link>
              </li>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <>
                  <li>
                    <Link
                      to="/employees"
                      onClick={handleLinkClick}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                        isActive('/employees')
                          ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/employees') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                        <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Employees
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/attendance/approval"
                      onClick={handleLinkClick}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                        isActive('/attendance/approval')
                          ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/attendance/approval') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                        <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Attendance
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/sites"
                      onClick={handleLinkClick}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                        isActive('/sites')
                          ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/sites') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                        <path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sites
                    </Link>
                  </li>
                </>
              )}

              {user?.role === 'employee' && (
                <>
                  <li>
                    <Link
                      to="/attendance/history"
                      onClick={handleLinkClick}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                        isActive('/attendance/history')
                          ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/attendance/history') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                        <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Attendance History
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/work-history"
                      onClick={handleLinkClick}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                        isActive('/work-history')
                          ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/work-history') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                        <path d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m0 0h4.5m-4.5 0-4.5-4.5m4.5 4.5 4.5-4.5m-4.5 4.5v-4.25m0 0h-4.5m4.5 0 4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Work History
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/payouts"
                  onClick={handleLinkClick}
                  className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                    isActive('/payouts')
                      ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/payouts') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                    <path d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Payouts
                </Link>
              </li>

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <li>
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold ${
                      isActive('/admin')
                        ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 shrink-0 ${isActive('/admin') ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'}`}>
                      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {user?.role === 'admin' ? 'Admin' : 'Management'}
                  </Link>
                </li>
              )}
            </ul>
          </li>

          <li className="-mx-6 mt-auto">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className={`flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold hover:bg-gray-50 w-full dark:hover:bg-white/5 ${
                isActive('/profile')
                  ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`size-6 ${isActive('/profile') ? 'text-indigo-600 dark:text-white' : 'text-gray-400'}`}>
                <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Profile</span>
            </Link>
          </li>

          <li className="-mx-6 mb-6">
            <button
              onClick={onLogout}
              className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-50 w-full dark:text-white dark:hover:bg-white/5"
            >
              <FaSignOutAlt className="size-6 text-gray-400" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
    </>
  );
}

export default Sidebar