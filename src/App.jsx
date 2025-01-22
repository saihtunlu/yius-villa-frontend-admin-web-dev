import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { onMessage } from 'firebase/messaging';

import LoadingScreen from './components/common/LoadingScreen';
import Router from './router';
import { errorHandler, loadProgressBar } from './utils/axios';
import { addScrollbarStyle } from './utils/scrollbarStyle';
import { setOldToken, storeFCMToken } from './redux/slices/auth';
import { requestNotificationPermission, messaging } from './firebase';
import { handleGetWebsiteOrderBadges } from './redux/slices/badge';

const App = () => {
  const isReady = useSelector((state) => state.auth.isReady);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      requestNotificationPermission()
        .then((token) => {
          if (token) {
            storeFCMToken(token);
          }
        })
        .catch((err) => console.log('Permission denied:', err));
    }
  }, [isLoggedIn]);

  onMessage(messaging, (payload) => {
    if (payload.data.type === 'Update Order') {
      handleGetWebsiteOrderBadges();
    }
    enqueueSnackbar(payload.notification.body);
  });

  // ----------------------------------------------------------------------
  useEffect(() => {
    errorHandler(enqueueSnackbar, closeSnackbar);
    return () => {};
  }, [enqueueSnackbar, closeSnackbar]);

  // ----------------------------------------------------------------------
  useEffect(() => {
    loadProgressBar();
    setOldToken();
    addScrollbarStyle(theme);
    return () => {};
  }, [theme]);

  return (
    <>
      {isReady ? (
        <RouterProvider router={Router} />
      ) : (
        <LoadingScreen
          mainLoading
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            position: 'fixed',
          }}
        />
      )}
    </>
  );
};

export default App;
