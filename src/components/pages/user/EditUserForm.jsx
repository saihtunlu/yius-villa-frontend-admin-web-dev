import {
  Card,
  Stack,
  TextField,
  CardHeader,
  Grid2 as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Checkbox,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

import Media from '../../common/Media';

const EditUserDetail = ({ user }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState({});
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .put('employee/user/', { data })
      .then(({ data }) => {
        setData(data);
        setLoading(false);
        enqueueSnackbar('Update success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  // effects

  useEffect(() => {
    setData(user);
    return () => {};
  }, [user]);

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
              <Stack spacing={2.5} sx={{ mt: 5, p: 2.5 }} alignItems={'center'}>
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

                <Stack direction={'row'} sx={{ width: '100%' }} justifyContent={'space-between'} alignItems={'center'}>
                  <Stack>
                    <Typography variant="subtitle2">Banned</Typography>
                    <Typography color="text.secondary" variant="caption">
                      Apply disable account
                    </Typography>
                  </Stack>

                  <Switch
                    color="primary"
                    checked={!data.is_active}
                    onChange={(event) => {
                      setData((preState) => {
                        return { ...preState, is_active: !event.target.checked };
                      });
                    }}
                  />
                </Stack>
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
                  value={data.first_name || ''}
                  required
                  onChange={(event) => {
                    setData((preState) => {
                      return {
                        ...preState,
                        first_name: event.target.value,
                      };
                    });
                  }}
                />
                <TextField
                  sx={{ width: '100%' }}
                  label={'Last name'}
                  required
                  value={data.last_name || ''}
                  onChange={(event) => {
                    setData((preState) => {
                      return {
                        ...preState,
                        last_name: event.target.value,
                      };
                    });
                  }}
                />
              </Stack>

              <Stack
                spacing={2.5}
                sx={{ mt: 2.5 }}
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
                  value={data.email || ''}
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
                    value={data.role?.name || ''}
                    label={'Role'}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.role = rolesData.filter((role) => role.name === event.target.value)[0];
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
            </Card>

            <Card sx={{ px: 2.5, pb: 2.5 }}>
              <CardHeader title={'Permissions'} sx={{ mb: 2.5, px: 0 }} />
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Create</TableCell>
                        <TableCell>Read</TableCell>
                        <TableCell>Update</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.role?.permissions.map((row, index) => {
                        return (
                          <TableRow hover key={`${row.id}`}>
                            <TableCell align="left">{row.name || '-'}</TableCell>

                            <TableCell align="left">
                              <Checkbox checked={row.create} />
                            </TableCell>
                            <TableCell align="left">
                              <Checkbox checked={row.read} />
                            </TableCell>
                            <TableCell align="left">
                              <Checkbox checked={row.update} />
                            </TableCell>
                            <TableCell align="left">
                              <Checkbox checked={row.delete} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Stack alignItems={'flex-end'} mt={2.5}>
                <LoadingButton size="large" color={'black'} type="submit" variant="contained" loading={loading}>
                  Update User
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditUserDetail;
