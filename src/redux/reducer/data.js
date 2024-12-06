import { GET_ISREADY_SUCCESS, SET_ISREADY_SUCCESS } from '../actions/type';

const initialState = {
  isReady: false,
};
const data = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_ISREADY_SUCCESS:
      return state.isReady;
    case SET_ISREADY_SUCCESS:
      state.isReady = payload;
      return state;
    default:
      return state;
  }
};
export default data;
