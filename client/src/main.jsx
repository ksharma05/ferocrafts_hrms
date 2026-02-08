import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Spinner from './components/Spinner';
import ErrorBoundary from './components/ErrorBoundary';
import lazyWithRetry from './utils/lazyWithRetry';

// Lazy load pages with automatic retry on network failures
const Dashboard = lazy(() => lazyWithRetry(() => import('./pages/Dashboard')));
const Login = lazy(() => lazyWithRetry(() => import('./pages/Login')));
const Employees = lazy(() => lazyWithRetry(() => import('./pages/Employees')));
const Sites = lazy(() => lazyWithRetry(() => import('./pages/Sites')));
const Payouts = lazy(() => lazyWithRetry(() => import('./pages/Payouts')));
const Admin = lazy(() => lazyWithRetry(() => import('./pages/Admin')));
const Profile = lazy(() => lazyWithRetry(() => import('./pages/Profile')));
const AttendanceApproval = lazy(() => lazyWithRetry(() => import('./pages/AttendanceApproval')));
const AttendanceHistory = lazy(() => lazyWithRetry(() => import('./pages/AttendanceHistory')));
const WorkHistory = lazy(() => lazyWithRetry(() => import('./pages/WorkHistory')));
const PrivateRoute = lazy(() => lazyWithRetry(() => import('./components/PrivateRoute')));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Spinner />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<Spinner />}>
        <PrivateRoute />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Spinner />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: 'employees',
            element: (
              <Suspense fallback={<Spinner />}>
                <Employees />
              </Suspense>
            ),
          },
          {
            path: 'sites',
            element: (
              <Suspense fallback={<Spinner />}>
                <Sites />
              </Suspense>
            ),
          },
          {
            path: 'payouts',
            element: (
              <Suspense fallback={<Spinner />}>
                <Payouts />
              </Suspense>
            ),
          },
          {
            path: 'admin',
            element: (
              <Suspense fallback={<Spinner />}>
                <Admin />
              </Suspense>
            ),
          },
          {
            path: 'attendance/approval',
            element: (
              <Suspense fallback={<Spinner />}>
                <AttendanceApproval />
              </Suspense>
            ),
          },
          {
            path: 'attendance/history',
            element: (
              <Suspense fallback={<Spinner />}>
                <AttendanceHistory />
              </Suspense>
            ),
          },
          {
            path: 'work-history',
            element: (
              <Suspense fallback={<Spinner />}>
                <WorkHistory />
              </Suspense>
            ),
          },
          {
            path: 'profile',
            element: (
              <Suspense fallback={<Spinner />}>
                <Profile />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);
