import { Icon } from '@iconify/react';
import cubeFill from '@iconify/icons-eva/cube-fill';
import homeFill from '@iconify/icons-eva/home-fill';
import inboxFill from '@iconify/icons-eva/inbox-fill';
import settingsFill from '@iconify/icons-eva/settings-fill';
import gridFill from '@iconify/icons-eva/grid-fill';
import peopleOutline from '@iconify/icons-eva/people-outline';
import { PATH_DASHBOARD } from '../../../router/paths';
import Iconify from '../../../components/common/Iconify';
import { checkRole } from '../../../utils/role';
import store from '../../../redux/store';

const sidebarConfig = [
  {
    subheader: 'Overview',
    show: () => true,

    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.home,
        icon: <Iconify icon={'solar:widget-6-bold-duotone'} />,
        show: () => true,
      },
    ],
  },
  {
    subheader: 'Sales Flow Management',
    show: (user) => checkRole('Order', 'read', user),
    items: [
      {
        title: 'Orders',
        path: 'order',
        icon: <Iconify icon={'solar:cart-3-bold-duotone'} />,
        show: (user) => checkRole('Order', 'read', user),
      },
      {
        title: 'Products',
        path: 'product',
        icon: <Iconify icon={'solar:box-bold-duotone'} />,
        show: (user) => checkRole('Product', 'read', user),
      },
    ],
  },
  {
    subheader: 'Employee Management',
    show: (user) => true,
    items: [
      {
        title: 'User',
        path: 'user',
        icon: <Iconify icon={'solar:user-bold-duotone'} />,
        show: (user) => checkRole('User', 'read', user),
      },
      {
        title: 'Employee',
        path: 'employee',
        icon: <Iconify icon={'solar:user-id-bold-duotone'} />,
        show: (user) => checkRole('Employee', 'read', user),
      },
      {
        title: 'Attendance',
        path: 'attendance',
        icon: <Iconify icon={'solar:user-check-bold-duotone'} />,
        show: (user) => true,

        children: [
          {
            title: 'List',
            path: PATH_DASHBOARD.attendance.list,
            show: (user) => checkRole('Attendance', 'read', user),
          },
          {
            title: 'Sheet',
            path: PATH_DASHBOARD.attendance.sheet,
            show: (user) => checkRole('Attendance', 'read', user),
          },
          {
            title: 'Settings',
            path: PATH_DASHBOARD.attendance.settings,
            show: (user) => checkRole('Attendance', 'update', user),
          },
        ],
      },
      {
        title: 'Payroll',
        path: 'payroll',
        icon: <Iconify icon={'solar:dollar-bold-duotone'} />,
        show: (user) => checkRole('Payroll', 'read', user),

        children: [
          {
            title: 'List',
            path: PATH_DASHBOARD.payroll.list,
            show: (user) => checkRole('Payroll', 'read', user),
          },
          {
            title: 'Adjustment',
            path: PATH_DASHBOARD.payroll.adjustment,
            show: (user) => checkRole('Payroll', 'update', user),
          },
        ],
      },

      {
        title: 'Calendar',
        path: 'calendar/',
        icon: <Iconify icon={'solar:calendar-bold-duotone'} />,
        show: (user) => checkRole('Calendar', 'read', user),
      },
      {
        title: 'Finance',
        path: 'finance/',
        icon: <Iconify icon={'solar:chart-square-bold'} />,
        show: (user) => checkRole('Finance', 'read', user),
      },
    ],
  },

  {
    subheader: 'Settings',
    show: () => true,

    items: [
      {
        title: 'General',
        path: 'settings/general/',
        icon: <Iconify icon={'solar:settings-bold-duotone'} />,
        show: (user) => checkRole('General Setting', 'read', user),
      },
      {
        title: 'My Account',
        path: 'settings/my-account/',
        icon: <Iconify icon={'solar:user-bold-duotone'} />,
        show: () => true,
      },
    ],
  },
];

export default sidebarConfig;
