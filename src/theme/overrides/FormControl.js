// ----------------------------------------------------------------------

export default function MuiFormControl(theme) {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root.Mui-focused': {
            // color: 'red !important',
          },
        },
      },
    },
  };
}
