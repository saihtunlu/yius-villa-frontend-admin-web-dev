import { replace } from 'lodash';
import numeral from 'numeral';
import store from '../redux/store';
import { INITIAL_USER } from '../components/pages/user/NewUserForm';

// ----------------------------------------------------------------------

export function checkRole(name, type, user = INITIAL_USER) {
  return user?.is_superuser || user?.role?.permissions?.filter((val) => val.name === name)[0][type] || false;
}
