import {
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SIGNOUT,
  GET_AUTH_FAIL,
  GET_AUTH_SUCCESS,
  UPDATE_STORE_SUCCESS,
} from '../actions/type';
import { INITIAL_STORE } from './store';

export const INITIAL_USER = {
  is_superuser: false,
  first_name: '',
  last_name: '',
  email: '',
  avatar: '/media/default.png',
  username: '',
  role: 'Owner',
  type: 'customer',
  is_staff: false,
  is_active: true,
  permissions: [
    {
      name: 'Store',
      create: false,
      update: true,
      delete: true,
      read: true,
      is_allowable_create: false,
      is_allowable_update: true,
      is_allowable_delete: true,
      is_allowable_read: true,
    },
  ],
  store: INITIAL_STORE,
  tags: [],
};

const initialState = {
  isLoggedIn: !!localStorage.getItem('token'),
  isReady: false,
  user: INITIAL_USER,
};
const auth = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case SIGNIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
      };
    case GET_AUTH_SUCCESS:
      return {
        ...state,
        user: payload,
        isReady: true,
      };
    case GET_AUTH_FAIL:
      return {
        isLoggedIn: false,
        isReady: true,
        user: null,
      };
    case SIGNIN_FAIL:
      return {
        isLoggedIn: false,
        isReady: true,
        user: null,
      };
    case SIGNOUT:
      return {
        isLoggedIn: false,
        isReady: true,
        user: null,
      };
    case UPDATE_STORE_SUCCESS:
      return {
        ...state,
        user: { ...state.user, store: payload },
      };
    default:
      return state;
  }
};

export default auth;
