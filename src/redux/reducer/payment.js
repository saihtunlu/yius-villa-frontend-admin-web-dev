import { GET_PAYMENT_METHOD_SUCCESS } from '../actions/type';

const initialState = [];
const payment = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_PAYMENT_METHOD_SUCCESS:
      return payload;
    default:
      return state;
  }
};
export default payment;
