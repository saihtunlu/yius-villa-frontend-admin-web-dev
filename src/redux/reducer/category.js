import { GET_CATEGORY_SUCCESS } from '../actions/type';

const initialState = null;
const category = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_CATEGORY_SUCCESS:
      return payload;
    default:
      return state;
  }
};
export default category;
