import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

const websitePaymentMethodSlice = createSlice({
  name: 'websitePaymentMethod',
  initialState: [],
  reducers: {
    getWebsitePaymentMethodSuccess: (state, action) => {
      return action.payload;
    },
  },
});

export const { getWebsitePaymentMethodSuccess } = websitePaymentMethodSlice.actions;
export default websitePaymentMethodSlice.reducer;

export const getWebsitePaymentMethods = async () => {
  const url = 'order/payment-method/list/';
  axios.get(url).then(({ data }) => {
    dispatch(getWebsitePaymentMethodSuccess(data));
  });
};
export const updateWebsitePaymentMethod = async (data) => {
  try {
    await axios.put('order/payment-method/', { data });
    getWebsitePaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const addWebsitePaymentMethod = async (data) => {
  try {
    await axios.post('order/payment-method/', { data });
    getWebsitePaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const deleteWebsitePaymentMethod = async (id) => {
  try {
    await axios.delete(`order/payment-method/?id=${id}`);
    getWebsitePaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
