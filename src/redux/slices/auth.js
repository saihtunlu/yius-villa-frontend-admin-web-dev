import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { dispatch } from '../store';
import { handleGettingImagesList } from './images';
import { isValidToken, setToken } from '../../utils/jwt';

export const INITIAL_USER = {
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
  store: {},
  tags: [],
};

const initialState = {
  isLoggedIn: !!localStorage.getItem('accessToken'),
  isReady: false,
  user: INITIAL_USER,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signinSuccess: (state, action) => {
      state.isLoggedIn = true;
    },
    getUserSuccess: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    signOutSuccess: (state) => {
      state.isLoggedIn = false;
    },
    setIsReady: (state) => {
      state.isReady = true;
    },
  },
});

export const { signinSuccess, getUserSuccess, signOutSuccess, setIsReady } = authSlice.actions;

export default authSlice.reducer;

// actions

export const handleLogOut = async () => {
  try {
    const res = await axios.delete('logout/');
    if (res.status === 200) {
      localStorage.removeItem('accessToken');
      setToken('');
      dispatch(signOutSuccess());
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const setOldToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    if (isValidToken(accessToken)) {
      setToken(accessToken);
      dispatch(signinSuccess());
      getAllData();
    } else {
      handleLogOut();
    }
  } else {
    dispatch(setIsReady());
  }
};

export const handleLogin = async (payload) => {
  try {
    const res = await axios.post('login/', payload);
    if (res.status === 200) {
      loginSuccess(res.data);
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const loginSuccess = (token) => {
  if (isValidToken(token.access)) {
    localStorage.setItem('accessToken', token.access);
    setToken(token.access);
    dispatch(signinSuccess());
    getAllData();
  } else {
    console.error('Invalid Token!');
  }
};
// User
export const getUser = async () => {
  try {
    const url = `auth/`;
    const res = await axios.get(url);
    const data = res.data;
    dispatch(getUserSuccess(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateAuth = async (user) => {
  try {
    const response = await axios.put('auth/', { data: user });
    const data = response.data;
    dispatch(getUserSuccess(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const storeFCMToken = async (token) => {
  try {
    const response = await axios.put('auth/fcm_token', { token });
    const data = response.data;
    dispatch(getUserSuccess(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getAllData = async () => {
  try {
    await getUser();
    dispatch(setIsReady());
  } catch (e) {
    dispatch(setIsReady());
  }
};

export const changePassword = async (payload) => {
  try {
    await axios.put('change-password/', payload);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
export const forgot = async (email) => {
  try {
    const res = await axios.post('reset-password/', { email });
    return Promise.resolve(res.data.uid);
  } catch (err) {
    return Promise.reject(err);
  }
};
// ----------------------------------------------------------------------
export const verify = async (payload) => {
  try {
    const res = await axios.post('verify-code/', payload);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
// ----------------------------------------------------------------------
export const resetPassword = async (data) => {
  try {
    const res = await axios.put('reset-password/', data);
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
