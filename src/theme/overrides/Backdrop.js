import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Backdrop(theme) {
  const varLow = alpha(theme.palette.grey[900], 0.48);
  const varHigh = alpha(theme.palette.grey[900], 1);

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: `blur(4px)`,
          WebkitBackdropFilter: `blur(4px)`,
          '&.MuiBackdrop-invisible': {
            background: 'transparent',
            backdropFilter: `none`,
            WebkitBackdropFilter: `none`,
          },
        },
      },
    },
  };
}
