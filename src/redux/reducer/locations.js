import { UPDATE_LOCATION_SUCCESS, GET_LOCATIONS_SUCCESS } from '../actions/type';

const initialState = [];
const locations = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case GET_LOCATIONS_SUCCESS:
      return payload;
    case UPDATE_LOCATION_SUCCESS:
      state[payload.index] = payload.data;
      return state;
    default:
      return state;
  }
};
export default locations;
