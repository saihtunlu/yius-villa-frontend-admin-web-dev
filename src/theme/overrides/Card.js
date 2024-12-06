// ----------------------------------------------------------------------

export default function Card(theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          boxShadow: theme.customShadows.card,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'subtitle1' },
        subheaderTypographyProps: { variant: 'body2', marginTop: theme.spacing(0.5) },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(2.5, 2.5, 0),
          '& .MuiCardHeader-action': {
            margin: '0px !important',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2.5),
        },
      },
    },
  };
}
