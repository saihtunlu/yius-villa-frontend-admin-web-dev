import { GET_STORE_SUCCESS, GET_STORE_FAIL } from '../actions/type';

export const INITIAL_STORE = {
  name: '',
  email: '',
  tags: [],
  phone: '',
  store_address: { state: '', city: '', address: '' },
  logo: '/media/default.png',
  type: '',
  subdomain_name: '',
  settings: {
    tax_type: 'Inclusive',
    surffix_currency: 'MMK',
    prefix_currency: '',
    tax: '5',
  },
  staffs: [],
};

const initialState = null;
const store = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_STORE_SUCCESS:
      if (!payload.store_address) {
        payload.store_address = { state: '', city: '', address: '' };
      }
      return payload;
    case GET_STORE_FAIL:
      return null;
    default:
      return state;
  }
};
export default store;
