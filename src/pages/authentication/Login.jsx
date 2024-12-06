import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography } from '@mui/material';

// components

import { PATH_AUTH } from '../../router/paths';
import LoginForm from '../../components/pages/authentication/LoginForm';
import Page from '../../components/common/Page';
import AuthHeader from '../../components/pages/authentication/AuthHeader';
import useResponsive from '../../hooks/useResponsive';
import { PREFIX_URL } from '../../config';
import Img from '../../components/common/Img';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');

  return (
    <RootStyle title="Login | Yiu's Villa">
      <AuthHeader />
      {/* Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
          Get started
        </Link> */}
      {/* </AuthHeader> */}

      {mdUp && (
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <Img fullLink src={`/assets/illustrations/illustration_login.png`} alt="login" />
        </SectionStyle>
      )}

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Sign in to Yiu's Villa
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Box>
          </Stack>

          <LoginForm />

          {!smUp && (
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Get started
              </Link>
            </Typography>
          )}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
