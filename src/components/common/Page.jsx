import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { forwardRef, useEffect, useCallback, ReactNode } from 'react';
// material
import { Alert, AlertTitle, Box, BoxProps, Container } from '@mui/material';
import { useSelector } from 'react-redux';

// utils
import track from '../../utils/analytics';
import store from '../../redux/store';
import { checkRole } from '../../utils/role';

const Page = forwardRef(({ children, role, roleBased = false, title = '', ...other }, ref) => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);
  const sendPageViewEvent = useCallback(() => {
    track.pageview({
      page_path: pathname,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sendPageViewEvent();
  }, [sendPageViewEvent]);

  if (roleBased) {
    if (!checkRole(role.name, role.type, user)) {
      return (
        <Container>
          <Alert severity="error">
            <AlertTitle>Permission Denied</AlertTitle>
            You do not have permission to access this page
          </Alert>
        </Container>
      );
    }

    return (
      <Box ref={ref} {...other}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {children}
      </Box>
    );
  }
  return (
    <Box ref={ref} {...other}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  );
});

export default Page;
