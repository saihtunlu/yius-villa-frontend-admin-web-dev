const isDev = process.env.NODE_ENV === 'development';

export const googleAnalyticsConfig = 'G-W4TB8DG09R';

export const APP_URL = window.location.origin;

// export const API_URL = process.env.REACT_APP_API_URL || '/api/';
// export const MEDIA_URL = '';

// export const API_URL = 'http://localhost:8000/api/';
export const API_URL = 'https://backend.yiusvilla.com/api/';
export const MEDIA_URL = '';

export const HEADER = {
  MOBILE_HEIGHT: 68,
  MAIN_DESKTOP_HEIGHT: 68,
  DASHBOARD_DESKTOP_HEIGHT: 98,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 78,
};

export const PREFIX_URL = '';

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 45,
  DASHBOARD_ITEM_SUB_HEIGHT: 38,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeColorPresets: 'default',
  themeLayout: 'horizontal',
  themeStretch: false,
  open: false,
};
