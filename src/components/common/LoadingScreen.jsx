import { m } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled } from '@mui/material/styles';
import { Box, LinearProgress } from '@mui/material';
import Logo from './Logo';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  minHeight: `calc(100vh - ${theme.spacing(25)})`,
}));

// ----------------------------------------------------------------------
export default function LoadingScreen({ mainLoading = false, ...other }) {
  return (
    <RootStyle {...other}>
      {mainLoading ? (
        <RootStyle {...other}>
          <m.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeatDelay: 1,
              repeat: Infinity,
            }}
          >
            <Logo
              disabledLink
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
              }}
            />
          </m.div>

          <Box
            component={m.div}
            animate={{
              scale: [1.2, 1, 1, 1.2, 1.2],
              rotate: [270, 0, 0, 270, 270],
              opacity: [0.25, 1, 1, 1, 0.25],
              borderRadius: ['25%', '25%', '50%', '50%', '25%'],
            }}
            transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '25%',
              position: 'absolute',
              border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
            }}
          />

          <Box
            component={m.div}
            animate={{
              scale: [1, 1.2, 1.2, 1, 1],
              rotate: [0, 270, 270, 0, 0],
              opacity: [1, 0.25, 0.25, 0.25, 1],
              borderRadius: ['25%', '25%', '50%', '50%', '25%'],
            }}
            transition={{
              ease: 'linear',
              duration: 3.2,
              repeat: Infinity,
            }}
            sx={{
              width: 100,
              height: 100,
              borderRadius: '25%',
              position: 'absolute',
              border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
            }}
          />
        </RootStyle>
      ) : (
        <CircularProgress />
      )}
    </RootStyle>
  );
}
