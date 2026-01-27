import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute() {
  const { user } = useSelector((state) => state.auth);

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render child routes
  return <Outlet />;
}

export default PrivateRoute;




