import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Spinner from './components/Spinner';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Employees = lazy(() => import('./pages/Employees'));
const Sites = lazy(() => import('./pages/Sites'));
const Payouts = lazy(() => import('./pages/Payouts'));
const Admin = lazy(() => import('./pages/Admin'));
const Profile = lazy(() => import('./pages/Profile'));
const AttendanceApproval = lazy(() => import('./pages/AttendanceApproval'));
const AttendanceHistory = lazy(() => import('./pages/AttendanceHistory'));
const WorkHistory = lazy(() => import('./pages/WorkHistory'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));

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
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
