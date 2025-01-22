import { Icon } from '@iconify/react';
import { useState } from 'react';
import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography, Step, StepConnector, StepLabel, Stepper } from '@mui/material';

// components

import { PATH_AUTH } from '../../router/paths';
import UserRegisterForm from '../../components/pages/authentication/UserRegisterForm';
import Page from '../../components/common/Page';
import AuthHeader from '../../components/pages/authentication/AuthHeader';
import StoreRegisterForm from '../../components/pages/authentication/StoreRegisterForm';
import LocationRegisterForm from '../../components/pages/authentication/LocationRegisterForm';

import { fUsername } from '../../utils/formatString';
import useResponsive from '../../hooks/useResponsive';
import { PREFIX_URL } from '../../config';
import Img from '../../components/common/Img';
// ----------------------------------------------------------------------

const STEPS = ['User', 'Store', 'Location'];

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

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function QontoStepIcon({ active, completed }) {
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
      }}
    >
      {completed ? (
        <Box component={Icon} icon={checkmarkFill} sx={{ zIndex: 1, width: 20, height: 20, color: 'primary.main' }} />
      ) : (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
          }}
        />
      )}
    </Box>
  );
}

const register = () => {};
export default function Register() {
  const mdUp = useResponsive('up', 'md');
  const smUp = useResponsive('up', 'sm');

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: true,
    password: '',
    passwordConfirm: '',
    role: 'Owner',
  });

  const [store, setStore] = useState({
    name: '',
    subdomain_name: '',
    email: '',
    phone: '',
    type: '',
    settings: {
      currency: 'MMK',
      tax_type: 'Exclusive',
    },
  });

  const [location, setLocation] = useState({
    is_default: true,
    location_address: {
      state: '',
      city: '',
      address: '',
      map: '',
    },
    name: 'Default',
    phone: '',
  });

  const handleSubmitUser = (user) => {
    setStaff(user);
    if (store.email === '') {
      setStore((preState) => {
        return { ...preState, email: user.email };
      });
    }
    setActiveStep(1);
  };
  const handleSubmitStore = (store) => {
    setStore(store);
    setActiveStep(2);
  };
  const handleSubmitLocation = (location) => {
    location.phone = store.phone;
    setLocation(location);
    handleSubmitRegistration(location);
  };

  const handleSubmitRegistration = (location) => {
    setLoading(true);
    // eslint-disable-next-line
    var staffCopy = staff;
    const password = Buffer.from(staffCopy.password);
    staffCopy.password = password.toString('base64');
    const passwordConfirm = Buffer.from(staffCopy.passwordConfirm);
    staffCopy.passwordConfirm = passwordConfirm.toString('base64');
    staffCopy.username = fUsername(staffCopy.first_name, staffCopy.last_name);

    const payload = {
      store,
      staff: staffCopy,
      location,
    };
    register(payload)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_AUTH.login);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <RootStyle title="Register | Sales Point">
      <AuthHeader>
        Already have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
          Login
        </Link>
      </AuthHeader>

      {mdUp && (
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Manage the job more effectively with Sales Point
          </Typography>
          <Img fullLink alt="register" src={`${PREFIX_URL}/assets/illustrations/illustration_register.png`} />
        </SectionStyle>
      )}

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Get started absolutely free.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Free forever. No credit card needed.</Typography>
            </Box>
          </Stack>
          <Stepper alternativeLabel activeStep={activeStep} sx={{ mb: 3 }} connector={<QontoConnector />}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  sx={{
                    '& .MuiStepLabel-label': {
                      typography: 'subtitle2',
                      color: 'text.disabled',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && <UserRegisterForm initialUser={staff} onSubmitUser={handleSubmitUser} />}
          {activeStep === 1 && (
            <StoreRegisterForm
              initialStore={store}
              onSubmitStore={handleSubmitStore}
              onBack={(index) => setActiveStep(index)}
            />
          )}

          {activeStep === 2 && (
            <LocationRegisterForm
              loading={loading}
              initialLocation={location}
              onSubmitLocation={handleSubmitLocation}
              onBack={(index) => setActiveStep(index)}
            />
          )}

          {!smUp && (
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account? &nbsp;
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
                Login
              </Link>
            </Typography>
          )}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
