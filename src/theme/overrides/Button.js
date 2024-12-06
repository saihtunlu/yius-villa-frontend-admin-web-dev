// ----------------------------------------------------------------------

export default function Button(theme) {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeLarge: {
          height: 48,
        },
        sizeSmall: {
          '& .iconify': {
            width: '20px !important',
            hegiht: '20px !important',
          },
        },
        // contained
        containedInherit: {
          color: theme.palette.grey[800],
          boxShadow: theme.customShadows.z8,
          '&:hover': {
            backgroundColor: theme.palette.grey[400],
          },
        },
        containedPrimary: {
          boxShadow: theme.customShadows.primary,
        },
        containedSecondary: {
          boxShadow: theme.customShadows.secondary,
        },
        containedInfo: {
          boxShadow: theme.customShadows.info,
        },
        containedSuccess: {
          boxShadow: theme.customShadows.success,
        },
        containedWarning: {
          boxShadow: theme.customShadows.warning,
        },
        containedError: {
          boxShadow: theme.customShadows.error,
        },
        containedText: {
          boxShadow: theme.customShadows.z8,
          background: theme.palette.text.primary,
          color: theme.palette.background.paper,
        },
        // outlined
        outlinedInherit: {
          border: `1px solid ${theme.palette.grey[500_32]} !important`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        outlinedBlack: {
          border: `1px solid ${theme.palette.grey[500_32]}`,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          color: theme.palette.text.primary,
        },
        textInherit: {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
      },
    },
  };
}
