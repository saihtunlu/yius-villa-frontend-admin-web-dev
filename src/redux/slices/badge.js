import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

const initialState = {
  websiteOrderBadge: { 'To Pay': 0, 'To Verify': 0, 'To Pack': 0, 'To Delivery': 0 },
};

export const badgeSlice = createSlice({
  name: 'badge',
  initialState,
  reducers: {
    setWebsiteOrderBadge: (state, action) => {
      const data = action.payload;
      return { ...state, websiteOrderBadge: data };
    },
  },
});

export const { setWebsiteOrderBadge } = badgeSlice.actions;

export default badgeSlice.reducer;

export const handleGetWebsiteOrderBadges = async () => {
  try {
    const response = await axios.get('order/badge/');
    dispatch(setWebsiteOrderBadge(response.data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
