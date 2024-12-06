// ----------------------------------------------------------------------

export default function Menu(theme) {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          marginLeft: '6px',
          marginRight: '6px',
          marginBottom: '6px',
          borderRadius: '6px',
          '&:last-child': {
            marginBottom: '0px !important',
          },
          '&:first-of-type': {
            marginTop: '0px !important',
          },
        },
      },
    },
  };
}
