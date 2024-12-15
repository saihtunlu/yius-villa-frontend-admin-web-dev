import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Fab, Tooltip } from '@mui/material';
import { m, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import moment from 'moment';

import { useSelector } from 'react-redux';
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import {
  getImages,
  getLocations,
  getInvoiceSetting,
  getPaymentMethods,
  getPackingSlipSetting,
  getCategory,
} from '../../redux/actions';
import { FabButtonAnimate, varFade, varZoom } from '../../components/animate';
import AttendForm from '../../components/pages/attendance/AttendForm';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 14,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();

  const store = useSelector((state) => state.auth.user?.store);

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const [showScrollToTopBtn, setShowScrollToTopBtn] = useState(false);

  const verticalLayout = themeLayout === 'vertical';

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    getImages(1);
    // getCategory();
    getPaymentMethods();
    // getInvoiceSetting();
    // getPackingSlipSetting()

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleScroll = (e) => {
    setShowScrollToTopBtn(e.target.scrollingElement.scrollTop > 600);
  };
  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 3.5, md: 2.5, sm: 2, xs: 1.5 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
        </Box>
        <AnimatePresence>
          {showScrollToTopBtn && (
            <Fab
              component={m.div}
              {...varZoom({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).in}
              sx={{
                position: 'fixed',
                right: '25px',
                bottom: '25px',
                zIndex: '1000000000 !important',
              }}
              variant="primary"
              size="medium"
              onClick={scrollToTop}
            >
              <Icon icon={arrowIosUpwardFill} width={24} height={24} />
            </Fab>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle
        sx={{
          px: { lg: 5, md: 2.5, sm: 2, xs: 1.5 },
        }}
        collapseClick={collapseClick}
      >
        <Outlet />
      </MainStyle>

      {/* <Zoom
        in={showScrollToTopBtn}
        timeout={transitionDuration}
        style={{
          transitionDelay: `0ms`,
        }}
      > */}
      <AnimatePresence>
        {showScrollToTopBtn && (
          <Tooltip title="Scroll To Top" placement="left">
            <Fab
              component={m.div}
              {...varZoom({
                distance: 120,
                durationIn: 0.32,
                durationOut: 0.24,
                easeIn: 'easeInOut',
              }).in}
              sx={{
                position: 'fixed',
                right: '25px',
                bottom: '25px',
                zIndex: '1000000000 !important',
              }}
              variant="primary"
              size="medium"
              onClick={scrollToTop}
            >
              <Icon icon={arrowIosUpwardFill} width={24} height={24} />
            </Fab>
          </Tooltip>
        )}
      </AnimatePresence>

      {/* </Zoom> */}
    </Box>
  );
}
