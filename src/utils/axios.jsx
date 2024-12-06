import axios from 'axios';
import { Typography, IconButton } from '@mui/material';
import { capitalCase } from 'change-case';
import CloseIcon from '@mui/icons-material/Close';
import NProgress from 'nprogress';
import { API_URL } from '../config';

axios.defaults.baseURL = API_URL;

export const errorHandler = (enqueueSnackbar, closeSnackbar) => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // eslint-disable-next-line
      var text = '';
      if (error.response) {
        if (error.response.data.detail) {
          enqueueSnackbar(error.response.data.detail, {
            variant: 'error',
            action: (key) => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <CloseIcon />
              </IconButton>
            ),
          });
        } else if (typeof error.response.data === 'object') {
          // eslint-disable-next-line
          for (var key in error.response.data) {
            text =
              typeof error.response.data[key] === 'string' ? (
                // eslint-disable-next-line
                error.response.data[key] + '\n'
              ) : (
                <>
                  {' '}
                  <Typography fontWeight={'bold'}>{capitalCase(key)}</Typography> : {error.response.data[key][0]}{' '}
                </>
              );
            enqueueSnackbar(text, {
              variant: 'error',
              action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                  <CloseIcon />
                </IconButton>
              ),
            });
          }
        } else {
          enqueueSnackbar(error.response.statusText, {
            variant: 'error',
            action: (key) => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <CloseIcon />
              </IconButton>
            ),
          });
        }
      }

      return Promise.reject(error);
    }
  );
};

export const loadProgressBar = (instance = axios) => {
  let requestsCounter = 0;

  // Improved percentage calculation function
  const calculatePercentage = (loaded, total) => {
    return total > 0 ? Math.floor((loaded / total) * 100) : 0; // Fixes percentage calculation
  };

  // Start progress bar when a request is made
  const setupStartProgress = () => {
    instance.interceptors.request.use((config) => {
      requestsCounter += 1;
      NProgress.start();
      return config;
    });
  };

  // Update progress bar on download/upload progress
  const setupUpdateProgress = () => {
    const update = (e) => {
      if (e.total) {
        NProgress.set(calculatePercentage(e.loaded, e.total) / 100); // Update progress bar with percentage
      }
    };
    instance.defaults.onDownloadProgress = update;
    instance.defaults.onUploadProgress = update;
  };

  // Stop progress bar after the request is completed
  const setupStopProgress = () => {
    const responseFunc = (response) => {
      /* eslint-disable no-plusplus */
      if (--requestsCounter === 0) {
        NProgress.done();
      }
      return response;
    };

    const errorFunc = (error) => {
      /* eslint-disable no-plusplus */
      if (--requestsCounter === 0) {
        NProgress.done();
      }
      return Promise.reject(error);
    };

    instance.interceptors.response.use(responseFunc, errorFunc);
  };

  // Initialize all interceptors
  setupStartProgress();
  setupUpdateProgress();
  setupStopProgress();
};
export default axios;
