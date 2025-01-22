import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
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
  isGettingDeliveryPickupList: false,
};

export const deliveryPickupSlice = createSlice({
  name: 'DeliveryPickup',
  initialState,
  reducers: {
    setDeliveryPickupList: (state, action) => {
      const data = action.payload;
      state.list = {
        ...data,
        results: [...state.list.results, ...data.results],
      };
    },
    setIsGettingDeliveryPickupList: (state, action) => {
      state.isGettingDeliveryPickupList = action.payload;
    },
    clearDeliveryPickupList: (state) => {
      state.list = {
        next: 1,
        previous: null,
        current_page: 1,
        count: 1,
        total_pages: 1,
        results: [],
      };
    },
    removeDeliveryPickup: (state, action) => {
      const data = action.payload;
      state.list.results = state.list.results.filter((deliveryPickup) => !data.includes(deliveryPickup.id));
    },
    addDeliveryPickup: (state, action) => {
      const payload = action.payload;
      state.list.results = [payload, ...state.list.results];
    },
    updateDeliveryPickup: (state, action) => {
      const updatedDeliveryPickup = action.payload;
      const index = state.list.results.findIndex((deliveryPickup) => deliveryPickup.id === updatedDeliveryPickup.id);
      if (index !== -1) {
        state.list.results[index] = updatedDeliveryPickup;
      }
    },
  },
});

export const {
  setDeliveryPickupList,
  clearDeliveryPickupList,
  setIsGettingDeliveryPickupList,
  removeDeliveryPickup,
  addDeliveryPickup,
  updateDeliveryPickup,
} = deliveryPickupSlice.actions;

export default deliveryPickupSlice.reducer;

export const handleClearDeliveryPickupList = () => {
  dispatch(clearDeliveryPickupList());
};

export const handleGetDeliveryPickupList = async (filters) => {
  dispatch(setIsGettingDeliveryPickupList(true));

  try {
    var fromDate = '';
    var toDate = '';
    if (filters.dates[0] && filters.dates[1]) {
      fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
      toDate = moment(filters.dates[1]).format('YYYY-MM-DD');
    } else {
      fromDate = '';
      toDate = '';
    }

    const link = `delivery-pickup/list/?query=${filters.query}&page_size=${filters.pageSize}&from_date=${fromDate}&to_date=${toDate}&page=${filters.page + 1}&order_by=${filters.order_by}`;

    const res = await axios.get(link);

    if (res.status === 200) {
      if (parseInt(filters.page, 10) + 1 === 1) {
        dispatch(clearDeliveryPickupList());
      }
      const data = res.data;
      dispatch(setDeliveryPickupList(data));
      dispatch(setIsGettingDeliveryPickupList(false));
    }
    return Promise.resolve();
  } catch (err) {
    dispatch(setIsGettingDeliveryPickupList(false));
    return Promise.reject(err);
  }
};

export const handleAddDeliveryPickup = async (deliveryPickup) => {
  try {
    const response = await axios.post('delivery-pickup/', deliveryPickup);
    dispatch(addDeliveryPickup(response.data));
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject();
  }
};

export const handleRemoveDeliveryPickup = async (data) => {
  try {
    await axios.post('delivery-pickup/remove/', { data });
    dispatch(removeDeliveryPickup(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleUpdateDeliveryPickup = async (deliveryPickup) => {
  try {
    const response = await axios.put(`delivery-pickup/`, deliveryPickup);
    dispatch(updateDeliveryPickup(response.data));
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject(err);
  }
};
