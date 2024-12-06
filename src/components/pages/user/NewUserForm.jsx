import { Icon } from '@iconify/react';
import {
  Card,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Grid2 as Grid,
  Switch,
  Paper,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../router/paths';

import Media from '../../common/Media';

export const INITIAL_USER = {
  first_name: '',
  type: 'Employee',
  status: '',
  last_name: '',
  email: '',
  avatar: '/assets/img/default.png',
  username: '',
  role: { name: '' },
  password: '',
  password_confirm: '',
  is_staff: true,
  is_active: true,
  is_superuser: false,
};

const NewUserForm = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState(INITIAL_USER);
  const [rolesData, setRolesData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('user/', { data })
      .then((resData) => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.user.edit(resData.data.id));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // effects
  useEffect(() => {
    getRoles();
    return () => {};
  }, []);

  // actions
  const getRoles = () => {
    var url = `roles/`;
    axios.get(url).then(({ data }) => {
      setRolesData(data);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <Stack spacing={2.5}>
            <Card>
              <Stack spacing={2.5} sx={{ px: 2.5, pt: 6.5, pb: 8.5 }} alignItems={'center'}>
                <Media
                  initialSelected={[{ image: data.avatar }]}
                  single
                  profile
                  caption="Profile Picture"
                  onChange={(data) => {
                    setData((preState) => {
                      return { ...preState, avatar: data[0]?.full_url };
                    });
                  }}
                />
                <Typography
                  variant="caption"
                  maxWidth={'80%'}
                  sx={{ pt: 1 }}
                  textAlign={'center'}
                  color="textSecondary"
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 8 }}>
          <Stack spacing={2.5}>
            <Card sx={{ px: 2.5, pb: 2.5 }}>
              <CardHeader title={'User Detail'} sx={{ mb: 2.5, px: 0 }} />

              <Stack
                spacing={2.5}
                sx={{ my: 2.5 }}
                direction={{
                  lg: 'row',
                  md: 'row',
                  sm: 'column',
                  xs: 'column',
                }}
              >
                <TextField
                  sx={{ width: '100%' }}
                  label={'First name'}
                  value={data.first_name}
                  required
                  onChange={(event) => {
                    setData((preState) => {
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
                  value={data.last_name}
                  onChange={(event) => {
                    setData((preState) => {
                      return {
                        ...preState,
                        last_name: event.target.value,
                        username: `${preState.first_name.replace(/\s+/g, '_').toLowerCase()}_${event.target.value.replace(/\s+/g, '_').toLowerCase()}`,
                      };
                    });
                  }}
                />
              </Stack>

              <Stack
                spacing={2.5}
                sx={{ my: 2.5 }}
                direction={{
                  lg: 'row',
                  md: 'row',
                  sm: 'column',
                  xs: 'column',
                }}
              >
                <TextField
                  sx={{ width: '100%', mb: 2.5 }}
                  label={'Email address'}
                  value={data.email}
                  required
                  type={'email'}
                  onChange={(event) => {
                    setData((preState) => {
                      return { ...preState, email: event.target.value };
                    });
                  }}
                />

                <FormControl fullWidth sx={{ mt: 5 }}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label-id"
                    id="role-select-id"
                    value={data.role.name || ''}
                    label={'Role'}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.role.name = event.target.value;
                        return newState;
                      });
                    }}
                  >
                    {rolesData.map((val, index) => (
                      <MenuItem key={`${index}-state`} value={val.name}>
                        {val.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
              <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                <TextField
                  fullWidth
                  sx={{ width: '100%' }}
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  required
                  value={data.password}
                  onChange={(event) => {
                    setData((preState) => {
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
                  value={data.password_confirm}
                  required
                  onChange={(event) => {
                    setData((preState) => {
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
              </Stack>

              <Stack alignItems={'flex-end'} mt={2.5}>
                <LoadingButton
                  loading={loading}
                  size="large"
                  type="submit"
                  color="black"
                  sx={{ minWidth: '120px' }}
                  variant="contained"
                >
                  Confirm
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default NewUserForm;
