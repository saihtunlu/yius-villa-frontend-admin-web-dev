import { TOGGLE_SIDEBAR } from '../actions/type';

const sidebarMode = localStorage.getItem('sidebar');
const initialState = sidebarMode || 'expense';
const sidebar = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case TOGGLE_SIDEBAR:
      return payload;
    default:
      return state;
  }
};

export default sidebar;
