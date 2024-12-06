import {
  TextField,
  Stack,
  Grid2 as Grid,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  CardHeader,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';

import LoadingButton from '@mui/lab/LoadingButton';
import Media from '../../common/Media';
import { updateStore } from '../../../redux/actions';
import { INITIAL_STORE } from '../../../redux/reducer/store';
import AddressPicker from '../../common/AddressPicker';
import SettingSkeleton from '../../skeleton/SettingSkeleton';

export const STORE_TYPES = [
  'Beauty',
  'Clothing',
  'Electronics',
  'Furniture',
  'Handcrafts',
  'Jewelry',
  'Painting',
  'Photography',
  'Restaurants',
  'Groceries',
  'Other food & drink',
  'Sports',
  'Toys',
  'Services',
  'Virtual services',
  'Other',
  "I havn't decided yet",
];

function StoreGeneralForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { initialStore } = props;
  const [store, setStore] = useState(INITIAL_STORE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStore(initialStore);
    return () => {};
  }, [initialStore]);

  // handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateStore(store)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Update success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      {store.id ? (
        <Grid container spacing={2.5}>
          <Grid size={4}>
            <Stack spacing={2.5}>
              <Card
                sx={{
                  px: 2.5,
                  py: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Media
                  initialSelected={[{ image: store.logo }]}
                  single
                  caption="Store Logo"
                  onChange={(data) => {
                    setStore((preState) => {
                      return { ...preState, logo: data[0]?.full_url };
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
              </Card>
            </Stack>
          </Grid>

          <Grid size={8}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle1">General Information</Typography>

              <Stack spacing={2.5} sx={{ pt: 2.5 }}>
                <Stack
                  spacing={2.5}
                  direction={{
                    sm: 'column',
                    md: 'row',
                    lg: 'row',
                  }}
                  sx={{}}
                  alignItems={'center'}
                >
                  <TextField
                    sx={{ width: '50%' }}
                    label={'Name'}
                    value={store.name}
                    required
                    onChange={(event) => {
                      setStore((preState) => {
                        return {
                          ...preState,
                          name: event.target.value,
                        };
                      });
                    }}
                  />
                  <TextField
                    sx={{ width: '50%' }}
                    label={'Phone number'}
                    required
                    type={'number'}
                    value={store.phone}
                    onChange={(event) => {
                      setStore((preState) => {
                        return { ...preState, phone: event.target.value };
                      });
                    }}
                  />
                </Stack>

                <Stack
                  spacing={2.5}
                  direction={{
                    sm: 'column',
                    md: 'row',
                    lg: 'row',
                  }}
                  sx={{}}
                  alignItems={'center'}
                >
                  <TextField
                    sx={{ width: '100%' }}
                    label={'Email address'}
                    value={store.email}
                    required
                    type={'email'}
                    onChange={(event) => {
                      setStore((preState) => {
                        return { ...preState, email: event.target.value };
                      });
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="store-type-label">Type</InputLabel>
                    <Select
                      labelId="store-type-label-id"
                      id="store-type-id"
                      value={store.type}
                      label="State"
                      onChange={(event) => {
                        setStore((preState) => {
                          return { ...preState, type: event.target.value };
                        });
                      }}
                    >
                      {STORE_TYPES.map((val, index) => (
                        <MenuItem key={`${index}-state`} value={val}>
                          {val}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack
                  spacing={2.5}
                  direction={{
                    sm: 'column',
                    md: 'row',
                    lg: 'row',
                  }}
                  sx={{}}
                  alignItems={'center'}
                >
                  <TextField
                    value={store.settings.prefix_currency || ''}
                    onChange={(event) =>
                      setStore((preState) => {
                        return {
                          ...preState,
                          settings: {
                            ...preState.settings,
                            prefix_currency: event.target.value,
                          },
                        };
                      })
                    }
                    fullWidth
                    label="Prefix Currency"
                  />
                  <TextField
                    value={store.settings.suffix_currency}
                    onChange={(event) =>
                      setStore((preState) => {
                        return {
                          ...preState,
                          settings: {
                            ...preState.settings,
                            suffix_currency: event.target.value,
                          },
                        };
                      })
                    }
                    fullWidth
                    label="Suffix Currency"
                  />
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 2.5, mt: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Contact Information</Typography>
                <AddressPicker
                  initialAddress={store.store_address}
                  onChangeState={(state) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.store_address.state = state;
                      return newState;
                    });
                  }}
                  onChangeCity={(city) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.store_address.city = city;
                      return newState;
                    });
                  }}
                  onChangeStreetAddress={(address) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.store_address.address = address;
                      return newState;
                    });
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" color={'black'} variant="contained" loading={loading}>
                    Save Changes
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <SettingSkeleton />
      )}
    </form>
  );
}
const mapStateToProps = (state) => ({
  initialStore: state.auth?.user?.store || INITIAL_STORE,
});
export default connect(mapStateToProps)(StoreGeneralForm);
