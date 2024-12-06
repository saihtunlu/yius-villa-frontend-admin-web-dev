import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Stack, Grid2 as Grid, Card, Box, IconButton, InputAdornment, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';

import { changePassword } from '../../../redux/actions';
import { PATH_AUTH } from '../../../router/paths';

function ChangePasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [passwords, setPasswords] = useState({
    old_password: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  const handleShowPassword = (index) => {
    if (index === 1) {
      setShowPassword1((show) => !show);
    } else if (index === 2) {
      setShowPassword2((show) => !show);
    } else if (index === 3) {
      setShowPassword3((show) => !show);
    }
  };

  // handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    changePassword(passwords)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Change password success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <Card sx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                sx={{ width: '100%' }}
                autoComplete="current-password"
                type={showPassword1 ? 'text' : 'password'}
                label="Old Password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleShowPassword(1)} edge="end">
                          {showPassword1 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                value={passwords.old_password}
                onChange={(event) => {
                  setPasswords((preState) => {
                    return { ...preState, old_password: event.target.value };
                  });
                }}
              />

              <TextField
                fullWidth
                sx={{ width: '100%' }}
                autoComplete="current-password"
                type={showPassword2 ? 'text' : 'password'}
                label="New Password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleShowPassword(2)} edge="end">
                          {showPassword2 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                value={passwords.password}
                onChange={(event) => {
                  setPasswords((preState) => {
                    return { ...preState, password: event.target.value };
                  });
                }}
              />
              <TextField
                fullWidth
                sx={{ width: '100%' }}
                autoComplete="current-password"
                type={showPassword3 ? 'text' : 'password'}
                label="New Password Confirmation"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handleShowPassword(3)} edge="end">
                          {showPassword3 ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                value={passwords.password_confirm}
                onChange={(event) => {
                  setPasswords((preState) => {
                    return {
                      ...preState,
                      password_confirm: event.target.value,
                    };
                  });
                }}
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  to={PATH_AUTH.forgotPassword}
                  variant="text"
                  size="large"
                  color="black"
                  component={RouterLink}
                  sx={{ mr: 2 }}
                >
                  Forgot password?
                </Button>
                <LoadingButton type="submit" size="large" color="black" variant="contained" loading={loading}>
                  Save Changes
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}

export default ChangePasswordForm;
