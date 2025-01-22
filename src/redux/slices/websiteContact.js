import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { dispatch } from '../store';

const websiteContactSlice = createSlice({
  name: 'websiteContact',
  initialState: [],
  reducers: {
    getWebsiteContactSuccess: (state, action) => {
      return action.payload;
    },
  },
});

export const { getWebsiteContactSuccess } = websiteContactSlice.actions;
export default websiteContactSlice.reducer;

export const getWebsiteContacts = async () => {
  const url = 'store/contact/list/';
  axios.get(url).then(({ data }) => {
    dispatch(getWebsiteContactSuccess(data));
  });
};
export const updateWebsiteContact = async (data) => {
  try {
    await axios.put('store/contact/', { data });
    getWebsiteContacts();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const addWebsiteContact = async (data) => {
  try {
    await axios.post('store/contact/', { data });
    getWebsiteContacts();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
export const deleteWebsiteContact = async (id) => {
  try {
    await axios.delete(`store/contact/?id=${id}`);
    getWebsiteContacts();
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
