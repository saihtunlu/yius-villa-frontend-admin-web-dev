import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useRoutes } from 'react-router-dom';
// layouts
import AppLayout from '../layouts/dashboard';
import AuthLayout from '../layouts/AuthLayout';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// components
import LoadingScreen from '../components/common/LoadingScreen';
import { PATH_DASHBOARD } from './paths';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ForgotPassword = Loadable(lazy(() => import('../pages/authentication/ForgotPassword')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));

// Order
const OrderList = Loadable(lazy(() => import('../pages/order/OrderList')));
const OrderItemList = Loadable(lazy(() => import('../pages/order/OrderItemList')));
const CreateOrder = Loadable(lazy(() => import('../pages/order/CreateOrder')));
const EditOrder = Loadable(lazy(() => import('../pages/order/EditOrder')));

//delivery
const DeliveryList = Loadable(lazy(() => import('../pages/delivery/DeliveryList')));
const DeliveryPickupList = Loadable(lazy(() => import('../pages/delivery/DeliveryPickupList')));
const EditPickup = Loadable(lazy(() => import('../pages/delivery/EditPickup')));
const CreatePickup = Loadable(lazy(() => import('../pages/delivery/CreatePickup')));

//coupon
const CouponList = Loadable(lazy(() => import('../pages/coupon/CouponList')));

//website order
const WebsiteOrderList = Loadable(lazy(() => import('../pages/website-order/WebsiteOrderList')));
const WebsiteOrderItemList = Loadable(lazy(() => import('../pages/website-order/WebsiteOrderItemList')));
const WebsiteEditOrder = Loadable(lazy(() => import('../pages/website-order/WebsiteEditOrder')));

// Product
const CreateProduct = Loadable(lazy(() => import('../pages/product/CreateProduct')));
const ProductList = Loadable(lazy(() => import('../pages/product/ProductList')));
const EditProduct = Loadable(lazy(() => import('../pages/product/EditProduct')));

//Employee
const EmployeeList = Loadable(lazy(() => import('../pages/employee/EmployeeList')));
const CreateEmployee = Loadable(lazy(() => import('../pages/employee/CreateEmployee')));
const EditEmployee = Loadable(lazy(() => import('../pages/employee/EditEmployee')));

const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const CreateUser = Loadable(lazy(() => import('../pages/user/CreateUser')));
const EditUser = Loadable(lazy(() => import('../pages/user/EditUser')));

const AttendanceList = Loadable(lazy(() => import('../pages/attendance/AttendanceList')));
const AttendanceSheet = Loadable(lazy(() => import('../pages/attendance/AttendanceSheet')));
const AttendanceSetting = Loadable(lazy(() => import('../pages/attendance/AttendanceSetting')));

const CreatePayroll = Loadable(lazy(() => import('../pages/payroll/CreatePayroll')));
const EditPayroll = Loadable(lazy(() => import('../pages/payroll/EditPayroll')));
const PayrollList = Loadable(lazy(() => import('../pages/payroll/PayrollList')));
const Adjustment = Loadable(lazy(() => import('../pages/payroll/Adjustment')));

const GeneralSettings = Loadable(lazy(() => import('../pages/settings/GeneralSettings')));
const MyAccount = Loadable(lazy(() => import('../pages/settings/MyAccount')));

const FinanceList = Loadable(lazy(() => import('../pages/finance/FinanceList')));
const Calendar = Loadable(lazy(() => import('../pages/calendar/Calendar')));

// Error
const Maintenance = Loadable(lazy(() => import('../pages/error/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/error/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/error/Page404')));

const routes = [
  // Authentication Routes
  {
    path: 'auth',
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  // Public Routes
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify', element: <VerifyCode /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },

  // Dashboard Routes
  {
    path: '',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { element: <Navigate to={'dashboard'} replace />, index: true },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'order',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <OrderList /> },
          { path: 'item/list', element: <OrderItemList /> },
          { path: 'create', element: <CreateOrder /> },
          { path: ':id/edit', element: <EditOrder /> },
        ],
      },
      {
        path: 'delivery',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <DeliveryList /> },
          { path: 'pickup-list', element: <DeliveryPickupList /> },
          { path: 'pickup/:id/edit', element: <EditPickup /> },
          { path: 'pickup/create', element: <CreatePickup /> },
        ],
      },
      {
        path: 'coupon',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <CouponList /> },
        ],
      },
      {
        path: 'website-order',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <WebsiteOrderList /> },
          { path: 'item/list', element: <WebsiteOrderItemList /> },
          { path: ':id/edit', element: <WebsiteEditOrder /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <ProductList /> },
          { path: 'create', element: <CreateProduct /> },
          { path: ':slug/edit', element: <EditProduct /> },
        ],
      },
      {
        path: 'employee',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <EmployeeList /> },
          { path: 'create', element: <CreateEmployee /> },
          { path: ':id/edit', element: <EditEmployee /> },
        ],
      },
      {
        path: 'user',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <UserList /> },
          { path: 'create', element: <CreateUser /> },
          { path: ':id/edit', element: <EditUser /> },
        ],
      },
      {
        path: 'attendance',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <AttendanceList /> },
          { path: 'sheet', element: <AttendanceSheet /> },
          { path: 'settings', element: <AttendanceSetting /> },
        ],
      },
      {
        path: 'payroll',
        children: [
          { element: <Navigate to="list" replace />, index: true },
          { path: 'list', element: <PayrollList /> },
          { path: 'create', element: <CreatePayroll /> },
          { path: ':id/edit', element: <EditPayroll /> },
          { path: 'adjustment', element: <Adjustment /> },
        ],
      },
      {
        path: 'finance',
        element: <FinanceList />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'settings',
        children: [
          { element: <Navigate to="general" replace />, index: true },
          { path: 'general', element: <GeneralSettings /> },
          { path: 'my-account', element: <MyAccount /> },
        ],
      },
    ],
  },
  // Errors Routes
  {
    path: '*',
    element: <LogoOnlyLayout />,
    children: [
      { path: 'maintenance', element: <Maintenance /> },
      { path: '500', element: <Page500 /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
];

const Router = createBrowserRouter(routes);

export default Router;
