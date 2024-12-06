import { useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import Page from '../../components/common/Page';
import ForgotPasswordForm from '../../components/pages/authentication/ForgotPasswordForm';

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
  const navigate = useNavigate();

  return (
    <RootStyle title="Forgot Password Page">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Typography variant="h3">Forgot your password?</Typography>
          <Typography sx={{ color: 'text.secondary', mb: 5 }}>
            Please enter the email address associated with your account and We will email you a link to reset your
            password.
          </Typography>

          <ForgotPasswordForm />
          <Button fullWidth size="large" sx={{ mt: 2.5 }} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Container>
    </RootStyle>
  );
}
