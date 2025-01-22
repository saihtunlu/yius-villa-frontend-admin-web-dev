import { TextField, Stack, Grid2 as Grid, Card, Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';

import Media from '../../common/Media';
import { INITIAL_USER, updateAuth } from '../../../redux/slices/auth';

function UserEditForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { initialUser } = props;
  const [user, setUser] = useState(INITIAL_USER);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(initialUser);
    return () => {};
  }, [initialUser]);

  // handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateAuth(user)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Update success', {
          variant: 'success',
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ sm: 12, md: 4 }}>
          <Stack spacing={2.5}>
            <Card
              sx={{
                px: 2.5,
                py: 6.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Media
                initialSelected={[{ image: user.avatar }]}
                single
                profile
                caption="Profile picture"
                onChange={(data) => {
                  setUser((preState) => {
                    return { ...preState, avatar: data[0]?.full_url };
                  });
                }}
              />

              <Typography variant="caption" maxWidth={'80%'} sx={{ pt: 1 }} textAlign={'center'} color="textSecondary">
                Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
              </Typography>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ sm: 12, md: 8 }}>
          <Card sx={{ p: 2.5 }}>
            <Stack spacing={2.5}>
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
                      username:
                        event.target.value.replace(/\s+/g, '_').toLowerCase() +
                        '_' +
                        preState.last_name.replace(/\s+/g, '_').toLowerCase(),
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
                      username:
                        preState.first_name.replace(/\s+/g, '_').toLowerCase() +
                        '_' +
                        event.target.value.replace(/\s+/g, '_').toLowerCase(),
                    };
                  });
                }}
              />
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
              <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" color="black" size={'large'} variant="contained" loading={loading}>
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
export default UserEditForm;
