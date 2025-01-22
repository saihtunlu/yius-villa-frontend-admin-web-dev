import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: [],
  reducers: {
    getPaymentMethodSuccess: (state, action) => {
      return action.payload;
    },
  },
});

export const { getPaymentMethodSuccess } = paymentSlice.actions;
export default paymentSlice.reducer;

export const getPaymentMethods = async () => {
  const url = 'payment-method/list/';
  axios.get(url).then(({ data }) => {
    dispatch(getPaymentMethodSuccess(data));
  });
};
export const updatePaymentMethod = async (data) => {
  try {
    await axios.put('payment-method/', { data });
    getPaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const addPaymentMethod = async (data) => {
  try {
    await axios.post('payment-method/', { data });
    getPaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const deletePaymentMethod = async (id) => {
  try {
    await axios.delete(`payment-method/?id=${id}`);
    getPaymentMethods();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
