import { GET_IMAGES_SUCCESS, ADD_IMAGES_SUCCESS, GET_IMAGES_FAIL, REMOVE_IMAGES_SUCCESS } from '../actions/type';

const initialState = {
  count: 0,
  current_page: 1,
  next: 1,
  previous: null,
  total_pages: 1,
  results: [],
};
const images = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_IMAGES_SUCCESS: {
      var data = {
        count: payload.count,
        current_page: payload.current_page,
        next: payload.next,
        previous: payload.previous,
        total_pages: payload.total_pages,
        results: [...state.results, ...payload.results],
      };
      return data;
    }

    case ADD_IMAGES_SUCCESS:
      return {
        ...state,
        results: [...payload, ...state.results],
      };
    case REMOVE_IMAGES_SUCCESS: {
      const newState = state.results.filter((image) => !payload.includes(image.id));
      return { ...state, results: newState };
    }
    case GET_IMAGES_FAIL:
      return state;
    default:
      return state;
  }
};
export default images;
