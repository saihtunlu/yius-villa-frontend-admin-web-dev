import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import Page from '../../components/common/Page';
import { PATH_AUTH } from '../../router/paths';
import ResetPasswordForm from '../../components/pages/authentication/ResetPasswordForm';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  return (
    <RootStyle title="Reset Password | Yiu's Villa">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Typography variant="h3">Reset password</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>Please enter the new password.</Typography>

          <ResetPasswordForm />
          <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 3 }}>
            Back
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
