import { GET_PACKING_SLIP_SETTING_SUCCESS } from '../actions/type';

const initialState = null;
const packingSlipSetting = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_PACKING_SLIP_SETTING_SUCCESS:
      return payload;
    default:
      return state;
  }
};
export default packingSlipSetting;
