import { TextField, InputAdornment, Link, IconButton, Stack, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_AUTH } from '../../../router/paths';
import { handleLogin } from '../../../redux/slices/auth';

function LoginForm(_props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // const buf = Buffer.from(password);
    handleLogin({ email, password })
      .then((_res) => {
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
      setLoading(false);
    };
  }, []);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <TextField
          fullWidth
          required
          type={'email'}
          label={'Email address'}
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          fullWidth
          required
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.register}>
            Create new store?
          </Link>

          <Link component={RouterLink} variant="subtitle2" to={`${PATH_AUTH.forgotPassword}?email=${email}`}>
            Forgot password?
          </Link>
        </Stack> */}
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Login
        </LoadingButton>

        <Button
          variant="text"
          size="large"
          color="primary"
          onClick={() => {
            navigate(`${PATH_AUTH.forgotPassword}?email=${email}`);
          }}
        >
          Forgot password?
        </Button>
      </Stack>
    </form>
  );
}

export default LoginForm;
