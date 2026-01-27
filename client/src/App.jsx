import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function App() {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main dashboard layout */}
      <div className="flex h-screen">
        {/* Sidebar on the left (only show if user is logged in) */}
        {user && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}

        {/* Main content area */}
        <main className={`flex-1 overflow-y-auto ${user ? 'lg:ml-0' : ''}`}>
          {/* Mobile menu button */}
          {user && (
            <div className="sticky top-0 z-30 flex items-center gap-x-4 bg-white px-4 py-4 shadow-sm lg:hidden">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
                FeroCrafts HRMS
              </div>
            </div>
          )}
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
