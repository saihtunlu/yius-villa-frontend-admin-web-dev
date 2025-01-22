import { replace } from 'lodash';
import numeral from 'numeral';
import store from '../redux/store';
import { INITIAL_USER } from '../components/pages/user/NewUserForm';

// ----------------------------------------------------------------------

export function checkRole(name, type, user = INITIAL_USER) {
  // If the user's role is 'Owner', return true for all permissions
  if (user?.role?.name === 'Owner') {
    return true;
  }

  // Check for the specific permission and type in other roles
  const permissions = user?.role?.permissions || [];
  const permission = permissions.find((val) => val.name === name);

  if (permission && permission[type] !== undefined) {
    return permission[type];
  }

  // Return false if type is not found or the user does not have the permission
  return false;
}
