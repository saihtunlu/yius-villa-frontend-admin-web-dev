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
  isGettingDeliveryList: false,
};

export const deliverySlice = createSlice({
  name: 'Delivery',
  initialState,
  reducers: {
    setDeliveryList: (state, action) => {
      const data = action.payload;
      state.list = {
        ...data,
        results: [...state.list.results, ...data.results],
      };
    },
    setIsGettingDeliveryList: (state, action) => {
      state.isGettingDeliveryList = action.payload;
    },
    clearDeliveryList: (state) => {
      state.list = {
        next: 1,
        previous: null,
        current_page: 1,
        count: 1,
        total_pages: 1,
        results: [],
      };
    },
    removeDelivery: (state, action) => {
      const data = action.payload;
      state.list.results = state.list.results.filter((delivery) => !data.includes(delivery.id));
    },
    addDelivery: (state, action) => {
      const payload = action.payload;
      state.list.results = [...payload, ...state.list.results];
    },
    updateDelivery: (state, action) => {
      const updatedDelivery = action.payload;
      const index = state.list.results.findIndex((delivery) => delivery.id === updatedDelivery.id);
      if (index !== -1) {
        state.list.results[index] = updatedDelivery;
      }
    },
  },
});

export const {
  setDeliveryList,
  clearDeliveryList,
  setIsGettingDeliveryList,
  removeDelivery,
  addDelivery,
  updateDelivery,
} = deliverySlice.actions;

export default deliverySlice.reducer;

export const handleClearDeliveryList = () => {
  dispatch(clearDeliveryList());
};

export const handleGetDeliveryList = async (filters) => {
  dispatch(setIsGettingDeliveryList(true));

  try {
    const link = `delivery/list/?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page + 1}&order_by=${filters.order_by}`;

    const res = await axios.get(link);
    if (res.status === 200) {
      if (parseInt(filters.page, 10) + 1 === 1) {
        dispatch(clearDeliveryList());
      }
      const data = res.data;
      dispatch(setDeliveryList(data));
      dispatch(setIsGettingDeliveryList(false));
    }
    return Promise.resolve();
  } catch (err) {
    dispatch(setIsGettingDeliveryList(false));
    return Promise.reject(err);
  }
};

export const handleAddDelivery = async (delivery) => {
  try {
    const response = await axios.post('delivery/', delivery);
    dispatch(addDelivery([response.data]));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleRemoveDelivery = async (data) => {
  try {
    await axios.post('delivery/remove/', { data });
    dispatch(removeDelivery(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleUpdateDelivery = async (delivery) => {
  try {
    const response = await axios.put(`delivery/`, delivery);
    dispatch(updateDelivery(response.data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
