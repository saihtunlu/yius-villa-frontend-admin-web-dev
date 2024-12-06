import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
// routes
import { PATH_DASHBOARD } from '../router/paths';

function GuestGuard({ children, isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(GuestGuard);
