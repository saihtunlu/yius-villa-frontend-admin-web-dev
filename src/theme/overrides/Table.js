// ----------------------------------------------------------------------

export default function Table(theme) {
  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '&:last-of-type .MuiTableCell-body': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          padding: theme.spacing(2),
        },
        head: {
          color: theme.palette.text.secondary,

          backgroundColor: theme.palette.background.neutral,
          '&:first-of-type': {
            paddingLeft: theme.spacing(2.5),
            // borderTopLeftRadius: theme.shape.borderRadius,
            // borderBottomLeftRadius: theme.shape.borderRadius,
            // boxShadow: `inset 8px 0 0 ${theme.palette.background.paper}`,
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(0),
            // borderTopRightRadius: theme.shape.borderRadius,
            // borderBottomRightRadius: theme.shape.borderRadius,
            // boxShadow: `inset -8px 0 0 ${theme.palette.background.paper}`,
          },
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
        body: {
          borderBottom: `0.1rem dashed ${theme.palette.divider} `,
          '&:first-of-type': {
            paddingLeft: theme.spacing(2.5),
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(2.5),
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `0.1rem dashed ${theme.palette.divider} `,
        },
        toolbar: {
          height: 64,
        },
        select: {
          '&:focus': {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: -4,
        },
      },
    },
  };
}
