import { TOGGLE_THEME } from '../actions/type';

const theme = localStorage.getItem('theme');
const initialState = theme || 'light';
const themeMode = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case TOGGLE_THEME:
      return payload;
    default:
      return state;
  }
};

export default themeMode;
