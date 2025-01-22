// ----------------------------------------------------------------------

function path(root, subLink) {
  return `${root}${subLink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  forgotPassword: path(ROOTS_AUTH, '/forgot-password'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  home: path(ROOTS_DASHBOARD, 'dashboard'),
  product: {
    list: path(ROOTS_DASHBOARD, 'product/list'),
    create: path(ROOTS_DASHBOARD, 'product/create'),
    edit: (slug) => path(ROOTS_DASHBOARD, `product/${slug}/edit`),
  },
  employee: {
    list: path(ROOTS_DASHBOARD, 'employee/list'),
    create: path(ROOTS_DASHBOARD, 'employee/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `employee/${id}/edit`),
  },
  attendance: {
    list: path(ROOTS_DASHBOARD, 'attendance/list'),
    sheet: path(ROOTS_DASHBOARD, 'attendance/sheet'),
    settings: path(ROOTS_DASHBOARD, 'attendance/settings'),
  },
  payroll: {
    list: path(ROOTS_DASHBOARD, 'payroll/list'),
    create: path(ROOTS_DASHBOARD, 'payroll/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `payroll/${id}/edit`),
    adjustment: path(ROOTS_DASHBOARD, `payroll/adjustment`),
  },

  finance: path(ROOTS_DASHBOARD, 'finance'),
  calendar: path(ROOTS_DASHBOARD, 'calendar'),
  user: {
    list: path(ROOTS_DASHBOARD, 'user/list'),
    create: path(ROOTS_DASHBOARD, 'user/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `user/${id}/edit`),
  },
  customer: {
    list: path(ROOTS_DASHBOARD, 'customer/list'),
    create: path(ROOTS_DASHBOARD, 'customer/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `customer/${id}/edit`),
  },
  order: {
    list: path(ROOTS_DASHBOARD, 'order/list'),
    itemList: path(ROOTS_DASHBOARD, 'order/item/list'),
    create: path(ROOTS_DASHBOARD, 'order/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `order/${id}/edit`),
  },
  delivery: {
    list: path(ROOTS_DASHBOARD, 'delivery/list'),
    pickupList: path(ROOTS_DASHBOARD, 'delivery/pickup-list'),
    editPickup: (id) => path(ROOTS_DASHBOARD, `delivery/pickup/${id}/edit`),
    createPickup: path(ROOTS_DASHBOARD, 'delivery/pickup/create'),
  },
  coupon: {
    list: path(ROOTS_DASHBOARD, 'coupon/list'),
  },
  websiteOrder: {
    list: path(ROOTS_DASHBOARD, 'website-order/list'),
    itemList: path(ROOTS_DASHBOARD, 'website-order/item/list'),
    create: path(ROOTS_DASHBOARD, 'website-order/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `website-order/${id}/edit`),
  },
  settings: {
    general: path(ROOTS_DASHBOARD, 'settings/general'),
    account: path(ROOTS_DASHBOARD, 'settings/my-account'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
