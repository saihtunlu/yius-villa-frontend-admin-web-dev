import ReactDOM from 'react-dom/client';
// router
import { BrowserRouter } from 'react-router-dom';
// helmet
import { HelmetProvider } from 'react-helmet-async';

// material ui - date picker
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

// redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

import App from './App';
import './assets/style/index.css';

// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill-new/dist/quill.snow.css';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// notistack
import NotistackProvider from './components/common/NotistackProvider';

// custom MUI theme
import ThemeProvider from './theme';

// Google analytics
import GoogleAnalytics from './components/common/GoogleAnalytics';

// report web vitals
import reportWebVitals from './reportWebVitals';

import ProgressBarStyle from './components/common/ProgressBarStyle';

import { BaseOptionChartStyle } from './components/common/charts/BaseOptionChart';

import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

import { SettingsProvider } from './contexts/SettingsContext';

import ThemeSettings from './components/settings';

import { MotionLazyContainer } from './components/animate';
import { registerFBSW } from './firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('Service Worker registration failed: ', registrationError);
      });

    registerFBSW();
  });
}

root.render(
  <HelmetProvider>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SettingsProvider>
          <CollapseDrawerProvider>
            <MotionLazyContainer>
              <ThemeProvider>
                <ThemeSettings>
                  <NotistackProvider>
                    <GoogleAnalytics />
                    <ProgressBarStyle />
                    <BaseOptionChartStyle />

                    <App />
                  </NotistackProvider>
                </ThemeSettings>
              </ThemeProvider>
            </MotionLazyContainer>
          </CollapseDrawerProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </Provider>
  </HelmetProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
