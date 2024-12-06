import { SnackbarProvider, MaterialDesignContent } from 'notistack';
import { Icon } from '@iconify/react';
import infoFill from '@iconify/icons-eva/info-fill';
import alertCircleFill from '@iconify/icons-eva/alert-circle-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
import checkmarkCircle2Fill from '@iconify/icons-eva/checkmark-circle-2-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, GlobalStyles } from '@mui/material';

// ----------------------------------------------------------------------
function SnackbarStyles() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <GlobalStyles
      styles={{
        '#root': {
          '& .notistack-MuiContent': {
            width: '100%',
            padding: theme.spacing(1.5),
            margin: theme.spacing(0.25, 0),
            boxShadow: theme.shadows[10],
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 100 : 800],
            backgroundColor: theme.palette.grey[isLight ? 800 : 100],
            '&.notistack-MuiContent-success, &.notistack-MuiContent-error, &.notistack-MuiContent-warning, &.notistack-MuiContent-info':
              {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
          },
          '& .notistack-MuiContent-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .notistack-MuiContent-action': {
            marginRight: 0,
            color: theme.palette.action.active,
            '& svg': { width: 20, height: 20 },
          },
        },
      }}
    />
  );
}

function SnackbarIcon({ icon, color }) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}`,
        bgcolor: () => alpha(color, 0.16),
      }}
    >
      <Icon icon={icon} width={24} height={24} />
    </Box>
  );
}

const NotistackProvider = (props) => {
  const theme = useTheme();

  return (
    <>
      <SnackbarStyles />

      <SnackbarProvider
        dense
        maxSnack={5}
        // preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        iconVariant={{
          success: <SnackbarIcon icon={checkmarkCircle2Fill} color={theme.palette.success.main} />,
          error: <SnackbarIcon icon={infoFill} color={theme.palette.error.main} />,
          warning: <SnackbarIcon icon={alertTriangleFill} color={theme.palette.warning.main} />,
          info: <SnackbarIcon icon={alertCircleFill} color={theme.palette.info.main} />,
        }}
      >
        {props.children}
      </SnackbarProvider>
    </>
  );
};

export default NotistackProvider;
