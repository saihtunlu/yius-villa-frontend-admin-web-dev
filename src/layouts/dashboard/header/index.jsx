// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Tooltip, IconButton } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';

// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { HEADER, NAVBAR } from '../../../config';
// components

//
// import Searchbar from "./Searchbar";
import AccountPopover from './AccountPopover';
import { IconButtonAnimate } from '../../../components/animate';
import Iconify from '../../../components/common/Iconify';
import LetterLogo from '../../../components/common/LetterLogo';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import AttendForm from '../../../components/pages/attendance/AttendForm';

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.default, opacity: 0.72 }),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  paddingRight: '0px !important',
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const store = useSelector((state) => state.auth?.user?.store);
  const isDesktop = useResponsive('up', 'lg');

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        {isDesktop && verticalLayout && <LetterLogo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}
        <Tooltip title={'Reload page'}>
          <IconButtonAnimate
            onClick={() => {
              window.location.reload();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.079 3v-.75zm-8.4 8.333h-.75zm0 1.667l-.527.532a.75.75 0 0 0 1.056 0zm2.209-1.134A.75.75 0 1 0 4.83 10.8zM2.528 10.8a.75.75 0 0 0-1.056 1.065zm16.088-3.408a.75.75 0 1 0 1.277-.786zM12.079 2.25c-5.047 0-9.15 4.061-9.15 9.083h1.5c0-4.182 3.42-7.583 7.65-7.583zm-9.15 9.083V13h1.5v-1.667zm1.28 2.2l1.679-1.667L4.83 10.8l-1.68 1.667zm0-1.065L2.528 10.8l-1.057 1.065l1.68 1.666zm15.684-5.86A9.16 9.16 0 0 0 12.08 2.25v1.5a7.66 7.66 0 0 1 6.537 3.643z"
              />
              <path
                fill="currentColor"
                d="M11.883 21v.75zm8.43-8.333h.75zm0-1.667l.528-.533a.75.75 0 0 0-1.055 0zM18.1 12.133a.75.75 0 1 0 1.055 1.067zm3.373 1.067a.75.75 0 1 0 1.054-1.067zM5.318 16.606a.75.75 0 1 0-1.277.788zm6.565 5.144c5.062 0 9.18-4.058 9.18-9.083h-1.5c0 4.18-3.43 7.583-7.68 7.583zm9.18-9.083V11h-1.5v1.667zm-1.277-2.2L18.1 12.133l1.055 1.067l1.686-1.667zm0 1.066l1.687 1.667l1.054-1.067l-1.686-1.666zm-15.745 5.86a9.2 9.2 0 0 0 7.842 4.357v-1.5a7.7 7.7 0 0 1-6.565-3.644z"
                opacity={0.5}
              />
            </svg>
          </IconButtonAnimate>
        </Tooltip>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {moment().isBefore(moment(store?.settings?.latest_check_in_time, 'HH:mm:ss')) && (
            <AttendForm type="Check-In" />
          )}

          {moment().isAfter(moment(store?.settings?.start_check_out_time, 'HH:mm:ss')) && (
            <AttendForm type="Check-Out" />
          )}

          {/* <LanguagePopover /> */}
          {/* <NotificationsPopover /> */}

          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
