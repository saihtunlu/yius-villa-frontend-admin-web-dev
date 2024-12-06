import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
import VerifyCodeForm from '../../components/pages/authentication/VerifyCodeForm';
import Page from '../../components/common/Page';
import { PATH_AUTH } from '../../router/paths';
import hideEmail from '../../utils/hideEmail';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  const [email, setEmail] = useState('');

  return (
    <RootStyle title="Verify | Yiu's Villa">
      <LogoOnlyLayout />

      <Container>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Typography variant="h3">Please check your email!</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            We have emailed a 6-digit confirmation code to {hideEmail(email)}, please enter the code in below box to
            verify your email.
          </Typography>

          <Box sx={{ mt: 5, mb: 3 }}>
            <VerifyCodeForm onGetEmail={(email) => setEmail(email)} />
            <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.forgotPassword} sx={{ mt: 3 }}>
              Back
            </Button>
          </Box>
        </Box>
      </Container>
    </RootStyle>
  );
}
