import { jwtDecode } from 'jwt-decode';
import axios from './axios';

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  try {
    const decoded = jwtDecode(accessToken);

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};

export const setToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};
