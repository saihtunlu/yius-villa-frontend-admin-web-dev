// ----------------------------------------------------------------------

export default function Switch(theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '60px',
          height: '46px',
        },
        thumb: {
          boxShadow: theme.customShadows.z1,
          width: '16px',
          height: '16px',
          backgroundColor: '#fff',
        },
        track: {
          opacity: 1,
          backgroundColor: theme.palette.grey[500],
          borderRadius: '50px',
        },

        switchBase: {
          left: '6px',
          top: '6px',
          right: 'auto',
          '&:not(:.Mui-checked)': {
            color: theme.palette.grey[isLight ? 100 : 300],
          },
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.grey[isLight ? 400 : 600],
          },
          '&.Mui-disabled+.MuiSwitch-track': {
            opacity: 1,
            backgroundColor: `${theme.palette.action.disabledBackground} !important`,
          },
          '&.Mui-checked': {
            transform: 'translateX(14px) !important',
          },

          '&.Mui-checked+.MuiSwitch-track': {
            opacity: 1,
          },
        },
      },
    },
  };
}
