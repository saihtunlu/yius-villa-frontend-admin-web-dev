import { googleAnalyticsConfig } from '../config';

// ----------------------------------------------------------------------

const setup = (
  targetId,
  config
) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  if (!window.gtag) {
    return;
  }
  window.gtag('config', targetId, config);
};

const setupEvent = (
  targetId,
  config
) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  if (!window.gtag) {
    return;
  }
  window.gtag('event', targetId, config);
};

const track = {
  pageview: (props) => {
    setup(googleAnalyticsConfig || '', props);
  },
  event: (type, props) => {
    setupEvent(type, props);
  }
};

export default track;
