import {
  GET_AUTH_SUCCESS,
  GET_AUTH_FAIL,
  GET_STORE_FAIL,
  SIGNIN_SUCCESS,
  SIGNOUT,
  GET_IMAGES_SUCCESS,
  ADD_IMAGES_SUCCESS,
  GET_IMAGES_FAIL,
  TOGGLE_THEME,
  TOGGLE_SIDEBAR,
  SIGNIN_FAIL,
  REMOVE_IMAGES_SUCCESS,
  GET_CATEGORY_SUCCESS,
  GET_LOCATIONS_SUCCESS,
  GET_INVOICE_SETTING_SUCCESS,
  UPDATE_STORE_SUCCESS,
  GET_PAYMENT_METHOD_SUCCESS,
  GET_PACKING_SLIP_SETTING_SUCCESS,
  GET_CUSTOMER_SUCCESS,
} from './type';
import axios from '../../utils/axios';
import store from '../store';
import { isValidToken, setToken } from '../../utils/jwt';

// ----------------------------------------------------------------------
export const login = async (payload) => {
  try {
    const res = await axios.post('login/', payload);
    if (res.status === 200) {
      if (isValidToken(res.data.access)) {
        localStorage.setItem('accessToken', res.data.access);
        setToken(res.data.access);
        store.dispatch({
          type: SIGNIN_SUCCESS,
        });
        getAuth();
      } else {
        console.error('Invalid Token!');
      }
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
//-----------------------------------------------------------------------------------------------------------------
export const register = async (data) => {
  try {
    await axios.post('store/register/', data);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
// ----------------------------------------------------------------------
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
// ----------------------------------------------------------------------
export const setOldToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    if (isValidToken(accessToken)) {
      setToken(accessToken);
      store.dispatch({
        type: SIGNIN_SUCCESS,
      });
      getAuth();
    } else {
      logout();
      store.dispatch({
        type: SIGNIN_FAIL,
      });
    }
  } else {
    store.dispatch({
      type: SIGNIN_FAIL,
    });
  }
};
// ----------------------------------------------------------------------
export const logout = () => {
  localStorage.removeItem('accessToken');
  setToken('');
  store.dispatch({
    type: SIGNOUT,
  });
  return Promise.resolve();
};
// ----------------------------------------------------------------------
export const getAuth = async () => {
  try {
    const response = await axios.get('auth/');
    store.dispatch({
      type: GET_AUTH_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve();
  } catch (err) {
    store.dispatch({
      type: GET_AUTH_FAIL,
    });
    store.dispatch({
      type: GET_STORE_FAIL,
    });
    return Promise.reject();
  }
};

export const updateAuth = async (user) => {
  try {
    const response = await axios.put('auth/', { data: user });
    store.dispatch({
      type: GET_AUTH_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
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

// ----------------------------------------------------------------------
export const getImages = async (page) => {
  await axios
    .get(`file/list/?page=${page}&page_size=35`)
    .then(({ data }) => {
      store.dispatch({
        type: GET_IMAGES_SUCCESS,
        payload: data,
      });
    })
    .catch(() => {
      store.dispatch({
        type: GET_IMAGES_FAIL,
      });
    });
};
export const uploadImages = async (files) => {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  // eslint-disable-next-line
  let formData = new FormData();

  formData.append('length', String(files.length));
  formData.append('type', 'Image');
  files.forEach((file, index) => {
    formData.append(`image${index}`, file);
  });

  try {
    const response = await axios.post('file/', formData, config);
    store.dispatch({
      type: ADD_IMAGES_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const removeImage = async (data) => {
  try {
    await axios.post('files/remove/', { data });
    store.dispatch({
      type: REMOVE_IMAGES_SUCCESS,
      payload: data,
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
// ----------------------------------------------------------------------
export const getCategory = async () => {
  const url = 'categories/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_CATEGORY_SUCCESS,
      payload: data,
    });
  });
};
export const removeCategories = async ({ data }) => {
  try {
    await axios.post('category/remove/', { data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
export const editCategory = async (data) => {
  try {
    const response = await axios.put('category/', { data });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
export const addCategory = async (data) => {
  try {
    const response = await axios.post('category/', { data });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
// ----------------------------------------------------------------------
export const searchProducts = async (query) => {
  const url = `product/search/?query=${query}`;
  try {
    const { data } = await axios.get(url);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const createNewProduct = async (data) => {
  try {
    const response = await axios.post('product/', { data });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
export const removeProducts = async ({ data, type }) => {
  try {
    await axios.post(`product/remove/?type=${type}`, { data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
export const editProduct = async (data, removedVariations) => {
  try {
    const response = await axios.put('product/', { data, removed_variations: removedVariations });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
//-----------------------------------------------------------------------------------------------------------------
export const updateOrderStatus = async ({ data, status }) => {
  try {
    await axios.put('sale/status/', { status, data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
export const addOrderPayment = async (payment) => {
  try {
    const { data } = await axios.post('sale/payment/', { data: payment });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const removeOrderPayment = async (id) => {
  try {
    const { data } = await axios.delete(`sale/payment/?id=${id}`);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createNewOrder = async (order) => {
  try {
    const { data } = await axios.post('sale/', { data: order });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const updateOrder = async (order, removedIDs) => {
  try {
    const { data } = await axios.put('sale/', { data: order, removed_ids: removedIDs });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const generateInvoice = async (invoiceParams) => {
  try {
    const { data } = await axios.post('invoice/', { data: invoiceParams });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const generatePackingSlip = async (id) => {
  try {
    const { data } = await axios.get('packing-slip/?sid=' + id);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getInvoiceSetting = async () => {
  const url = 'invoice/setting/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_INVOICE_SETTING_SUCCESS,
      payload: data,
    });
  });
};

export const updateInvoiceSetting = async (data) => {
  try {
    const response = await axios.put('invoice/setting/', { data });
    store.dispatch({
      type: GET_INVOICE_SETTING_SUCCESS,
      payload: data,
    });
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject();
  }
};

export const getPackingSlipSetting = async () => {
  const url = 'packing-slip/setting/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_PACKING_SLIP_SETTING_SUCCESS,
      payload: data,
    });
  });
};

export const updatePackingSlipSetting = async (data) => {
  try {
    const response = await axios.put('packing-slip/setting/', { data });
    store.dispatch({
      type: GET_PACKING_SLIP_SETTING_SUCCESS,
      payload: data,
    });
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject();
  }
};

//-----------------------------------------------------------------------------------------------------------------
export const updateStore = async (data) => {
  try {
    const response = await axios.put('store/', { data });
    store.dispatch({
      type: UPDATE_STORE_SUCCESS,
      payload: response.data,
    });
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject();
  }
};
// ----------------------------------------------------------------------
export const getLocations = async () => {
  const url = 'location/list/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_LOCATIONS_SUCCESS,
      payload: data,
    });
  });
};
export const updateLocation = async (data, index) => {
  try {
    await axios.put('location/', { data });
    getLocations();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const addLocation = async (data) => {
  try {
    await axios.post('location/', { data });
    getLocations();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const deleteLocation = async (id) => {
  try {
    await axios.delete(`location/?id=${id}`);
    getLocations();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
// ----------------------------------------------------------------------
export const getPaymentMethods = async () => {
  const url = 'payment-method/list/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_PAYMENT_METHOD_SUCCESS,
      payload: data,
    });
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
// ----------------------------------------------------------------------
export const toggleTheme = (theme) =>
  store.dispatch({
    type: TOGGLE_THEME,
    payload: theme,
  });
// ----------------------------------------------------------------------
export const toggleSidebar = (mode) => {
  localStorage.setItem('sidebar', mode);
  store.dispatch({
    type: TOGGLE_SIDEBAR,
    payload: mode,
  });
};
// ----------------------------------------------------------------------

export const getCustomer = async () => {
  const url = 'customer/list/all/';
  axios.get(url).then(({ data }) => {
    store.dispatch({
      type: GET_CUSTOMER_SUCCESS,
      payload: data,
    });
  });
};
export const removeCustomers = async ({ data }) => {
  try {
    await axios.post('customer/remove/', { data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
export const editCustomer = async (data) => {
  try {
    const response = await axios.put('customer/', { data });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
export const addCustomer = async (data) => {
  try {
    const response = await axios.post('customer/', { data });
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject();
  }
};
