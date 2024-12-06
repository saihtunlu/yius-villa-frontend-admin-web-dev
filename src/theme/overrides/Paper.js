// ----------------------------------------------------------------------

import cssStyles from '../../utils/cssStyles';

export default function Paper(theme) {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: theme.palette.grey[500_12],
          },
        },
      ],

      styleOverrides: {
        root: {
          backgroundImage: 'none',
          '&.MuiPaper-outlined': {
            borderRadius: theme.shape.borderRadiusMd,
            border: '2px dashed ' + theme.palette.grey[500_12],
          },
        },
      },
    },
  };
}
