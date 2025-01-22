import { useState, ReactNode } from 'react';
import { connect, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
// pages
import Login from '../pages/authentication/Login';

function AuthGuard({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isLoggedIn) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}

export default AuthGuard;
