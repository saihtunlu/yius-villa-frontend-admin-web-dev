import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Button, useTheme } from '@mui/material';
import { RouterProvider } from 'react-router-dom';

import { connect } from 'react-redux';
import { setOldToken } from './redux/actions';
import LoadingScreen from './components/common/LoadingScreen';
import Router from './router';
import { errorHandler, loadProgressBar } from './utils/axios';
import { addScrollbarStyle } from './utils/scrollbarStyle';

const App = ({ isReady }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const theme = useTheme();

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

const mapStateToProps = (state) => ({
  isReady: state.auth.isReady,
});

export default connect(mapStateToProps)(App);
