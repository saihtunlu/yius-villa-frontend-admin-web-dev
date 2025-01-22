import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

const initialState = {
  list: {
    next: 1,
    previous: null,
    current_page: 1,
    count: 1,
    total_pages: 1,
    results: [],
  },
  isGettingCouponList: false,
};

export const CouponSlice = createSlice({
  name: 'Coupon',
  initialState,
  reducers: {
    setCouponList: (state, action) => {
      const data = action.payload;
      state.list = {
        ...data,
        results: [...state.list.results, ...data.results],
      };
    },
    setIsGettingCouponList: (state, action) => {
      state.isGettingCouponList = action.payload;
    },
    clearCouponList: (state) => {
      state.list = {
        next: 1,
        previous: null,
        current_page: 1,
        count: 1,
        total_pages: 1,
        results: [],
      };
    },
    removeCoupon: (state, action) => {
      const data = action.payload;
      state.list.results = state.list.results.filter((Coupon) => !data.includes(Coupon.id));
    },
    addCoupon: (state, action) => {
      const payload = action.payload;
      state.list.results = [...payload, ...state.list.results];
    },
    updateCoupon: (state, action) => {
      const updatedCoupon = action.payload;
      const index = state.list.results.findIndex((Coupon) => Coupon.id === updatedCoupon.id);
      if (index !== -1) {
        state.list.results[index] = updatedCoupon;
      }
    },
  },
});

export const { setCouponList, clearCouponList, setIsGettingCouponList, removeCoupon, addCoupon, updateCoupon } =
  CouponSlice.actions;

export default CouponSlice.reducer;

export const handleClearCouponList = () => {
  dispatch(clearCouponList());
};

export const handleGetCouponList = async (filters) => {
  dispatch(setIsGettingCouponList(true));

  try {
    const link = `coupon/list/?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page + 1}&order_by=${filters.order_by}`;

    const res = await axios.get(link);
    if (res.status === 200) {
      if (parseInt(filters.page, 10) + 1 === 1) {
        dispatch(clearCouponList());
      }
      const data = res.data;
      dispatch(setCouponList(data));
      dispatch(setIsGettingCouponList(false));
    }
    return Promise.resolve();
  } catch (err) {
    dispatch(setIsGettingCouponList(false));
    return Promise.reject(err);
  }
};

export const handleAddCoupon = async (Coupon) => {
  try {
    const response = await axios.post('coupon/', Coupon);
    dispatch(addCoupon([response.data]));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleRemoveCoupon = async (data) => {
  try {
    await axios.post('coupon/remove/', { data });
    dispatch(removeCoupon(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleUpdateCoupon = async (Coupon) => {
  try {
    const response = await axios.put(`coupon/`, Coupon);
    dispatch(updateCoupon(response.data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
