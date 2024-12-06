import { GET_AUTH_SUCCESS, GET_AUTH_FAIL } from '../actions/type';

const initialState = null;
const user = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_AUTH_SUCCESS:
      return payload;
    case GET_AUTH_FAIL:
      return null;
    default:
      return state;
  }
};
export default user;
