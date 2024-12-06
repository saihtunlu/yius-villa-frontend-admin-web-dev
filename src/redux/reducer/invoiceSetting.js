import { GET_INVOICE_SETTING_SUCCESS } from '../actions/type';

const initialState = null;
const invoiceSetting = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_INVOICE_SETTING_SUCCESS:
      return payload;
    default:
      return state;
  }
};
export default invoiceSetting;
