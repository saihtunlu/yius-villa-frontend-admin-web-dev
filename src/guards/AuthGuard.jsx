import { useState, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
// pages
import Login from '../pages/authentication/Login';


function AuthGuard({ children, isLoggedIn }) {
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

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn
})

export default connect(mapStateToProps)(AuthGuard)