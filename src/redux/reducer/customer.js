import { GET_CUSTOMER_SUCCESS } from '../actions/type';

const initialState = null;
const customer = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_CUSTOMER_SUCCESS:
      return payload;
    default:
      return state;
  }
};
export default customer;
