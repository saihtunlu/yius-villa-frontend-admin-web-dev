// ----------------------------------------------------------------------

export default function Dialog(theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dialog,
          '&.MuiPaper-rounded': {
            borderRadius: Number(theme.shape.borderRadius) * 2,
          },
          '&.MuiDialog-paperFullScreen': {
            borderRadius: 0,
          },
          '&.MuiDialog-paper .MuiDialogActions-root': {
            padding: theme.spacing(2.5),
          },
          '@media (max-width: 600px)': {
            margin: theme.spacing(2),
          },
          '@media (max-width: 663.95px)': {
            '&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody': {
              maxWidth: '100%',
            },
          },
        },
        paperFullWidth: {
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(2.5, 2.5, 0),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(2.5),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5),
          },

          '& .MuiButtonBase-root': {
            minWidth: '100px',
          },
          // paddingTop: '0px !important',
        },
      },
    },
  };
}
