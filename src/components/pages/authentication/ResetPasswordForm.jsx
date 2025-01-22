import { TextField, Stack, IconButton, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import useQuery from '../../../utils/RouteQuery';
import { PATH_AUTH } from '../../../router/paths';
import { resetPassword } from '../../../redux/slices/auth';

function ResetPasswordForm(props) {
  const query = useQuery();
  const uidQuery = query.get('uid') || '';
  const tokenQuery = query.get('token') || '';
  const bufUid = Buffer.from(uidQuery, 'base64');
  const bufToken = Buffer.from(tokenQuery, 'base64');
  const uidParam = bufUid.toString('ascii');
  const tokenParam = bufToken.toString('ascii');
  const [payload, setPayload] = useState({
    uid: uidParam,
    token: tokenParam,
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const buf = Buffer.from(payload.password);
    const newPayload = {
      ...payload,
      password: payload.password,
    };
    resetPassword(newPayload)
      .then((data) => {
        setLoading(false);
        enqueueSnackbar(data.detail, { variant: 'success' });
        navigate(PATH_AUTH.login);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!query.has('uid') || !query.has('token')) {
      navigate(PATH_AUTH.forgotPassword);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          sx={{ width: '100%' }}
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={payload.password}
          onChange={(event) => {
            setPayload((preState) => {
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

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Reset Password
        </LoadingButton>
      </Stack>
    </form>
  );
}

export default ResetPasswordForm;
