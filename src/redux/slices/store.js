import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

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

const storeSlice = createSlice({
  name: 'store',
  initialState: null,
  reducers: {
    getStoreSuccess: (state, action) => {
      const payload = action.payload;
      if (!payload.store_address) {
        payload.store_address = { state: '', city: '', address: '' };
      }
      return payload;
    },

    getStoreFail: () => null,
  },
});

export const { getStoreSuccess, getStoreFail } = storeSlice.actions;
export default storeSlice.reducer;

export const updateStore = async (data) => {
  try {
    const res = await axios.put('store/', { data });
    dispatch(getStoreSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject();
  }
};
