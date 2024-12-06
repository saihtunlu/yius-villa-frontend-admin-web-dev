// ----------------------------------------------------------------------

export default function Input(theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: theme.palette.text.disabled },
          },
          borderRadius: Number(theme.shape.borderRadius) * 1.2 + 'px !important',
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
          // height: '50px !important',
          // padding: '0px 15px !important',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.grey[500_12],
          '&:hover': {
            backgroundColor: theme.palette.grey[500_16],
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.action.focus,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: theme.palette.grey[500_56],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.grey[500_32],
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.action.disabledBackground,
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            // borderColor: '#000 !important',
          },
        },
      },
    },
  };
}
