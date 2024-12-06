import { TextField, InputAdornment, IconButton, Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function UserRegisterForm({ onSubmitUser, initialUser }) {
  const [user, setUser] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_staff: true,
    password: '',
    password_confirm: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitUser(user);
  };

  useEffect(() => {
    setUser(initialUser);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Stack
          spacing={3}
          direction={{
            lg: 'row',
            md: 'row',
            sm: 'row',
            xs: 'column',
          }}
        >
          <TextField
            sx={{ width: '100%' }}
            label={'First name'}
            value={user.first_name}
            required
            onChange={(event) => {
              setUser((preState) => {
                return {
                  ...preState,
                  first_name: event.target.value,
                  username: `${event.target.value.replace(/\s+/g, '_').toLowerCase()}_${preState.last_name.replace(/\s+/g, '_').toLowerCase()}`,
                };
              });
            }}
          />
          <TextField
            sx={{ width: '100%' }}
            label={'Last name'}
            required
            value={user.last_name}
            onChange={(event) => {
              setUser((preState) => {
                return {
                  ...preState,
                  last_name: event.target.value,
                  username: `${preState.first_name.replace(/\s+/g, '_').toLowerCase()}_${event.target.value.replace(/\s+/g, '_').toLowerCase()}`,
                };
              });
            }}
          />
        </Stack>
        <TextField
          sx={{ width: '100%' }}
          label={'Email address'}
          value={user.email}
          required
          type={'email'}
          onChange={(event) => {
            setUser((preState) => {
              return { ...preState, email: event.target.value };
            });
          }}
        />
        <TextField
          fullWidth
          sx={{ width: '100%' }}
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={user.password}
          onChange={(event) => {
            setUser((preState) => {
              return { ...preState, password: event.target.value };
            });
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          sx={{ width: '100%' }}
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password Confirmation"
          value={user.password_confirm}
          onChange={(event) => {
            setUser((preState) => {
              return { ...preState, password_confirm: event.target.value };
            });
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button fullWidth size="large" type="submit" variant="contained">
          Continue
        </Button>
      </Stack>
    </form>
  );
}

export default UserRegisterForm;
