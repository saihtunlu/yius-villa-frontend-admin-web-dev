// ----------------------------------------------------------------------

import cssStyles from '../../utils/cssStyles';

export default function Popover(theme) {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dropdown,
          borderRadius: Number(theme.shape.borderRadius) * 1.5,
          ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.72 }),
          backgroundImage: `url(/assets/img/cyan-blur.png), url(/assets/img/red-blur.png)`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: '50%, 50%',
          transition: ' box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundPosition: 'right top, left bottom',
          '&>span': {
            display: 'none !important',
          },
        },
      },
    },
  };
}
