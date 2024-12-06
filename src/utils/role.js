import { replace } from 'lodash';
import numeral from 'numeral';
import store from '../redux/store';

// ----------------------------------------------------------------------

export function checkRole(name, type, user) {
  return user.is_superuser || user?.role?.permissions?.filter((val) => val.name === name)[0][type] || false;
}
