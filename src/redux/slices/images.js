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
  isGettingimagesList: false,
};

export const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setimagesList: (state, action) => {
      var data = action.payload;
      state.list = {
        ...data,
        results: [...state.list.results, ...data.results],
      };
    },
    setIsGettingList: (state, action) => {
      var data = action.payload;
      state.isGettingimagesList = data;
    },
    clearList: (state) => {
      var newState = {
        next: 1,
        previous: null,
        current_page: 1,
        count: 1,
        total_pages: 1,
        results: [],
      };
      state.list = newState;
    },
    removeImage: (state, action) => {
      const data = action.payload;

      // Filter out images whose `id` is included in `data`
      state.list.results = state.list.results.filter((image) => !data.includes(image.id));
    },
    addImage: (state, action) => {
      var payload = action.payload;

      state.list.results = [...payload, ...state.list.results];
    },
  },
});

export const { setimagesList, clearList, setIsGettingList, removeImage, addImage } = imagesSlice.actions;

export default imagesSlice.reducer;

export const handleClearimagesList = () => {
  dispatch(clearList());
};

export const handleGettingImagesList = async (page) => {
  if (page) {
    dispatch(setIsGettingList(true));

    try {
      var link = `file/list/?page=${page}&page_size=8`;
      const res = await axios.get(link);
      if (res.status === 200) {
        if (parseInt(page, 10) === 1) {
          dispatch(clearList());
        }
        const data = res.data;
        dispatch(setimagesList(data));
        dispatch(setIsGettingList(false));
      }
      return Promise.resolve();
    } catch (err) {
      dispatch(setIsGettingList(false));
      return Promise.reject(err);
    }
  }
};

export const handleUploadImages = async (files) => {
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
    dispatch(addImage(response.data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};

export const handleRemoveImage = async (data) => {
  try {
    await axios.post('files/remove/', { data });
    dispatch(removeImage(data));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject();
  }
};
