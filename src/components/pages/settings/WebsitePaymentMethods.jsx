import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import {
  Box,
  Card,
  Button,
  Typography,
  CardProps,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// @types
import { connect, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { isInteger } from 'lodash';
import { LoadingButton } from '@mui/lab';

import {
  updateWebsitePaymentMethod,
  addWebsitePaymentMethod,
  deleteWebsitePaymentMethod,
  getWebsitePaymentMethods,
} from '../../../redux/slices/websitePaymentMethod';
import Img from '../../common/Img';
import Media from '../../common/Media';
import Iconify from '../../common/Iconify';
import { ColorSinglePicker } from '../../common/color-utils';
import { allCities } from '../../../assets/constants/address';
import { fCurrency } from '../../../utils/formatNumber';

const INITIAL_PAYMENT_METHOD = {
  name: '',
  description: '',
  account_number: '',
  account_holder_name: '',
  image: '/assets/img/default.png',
  color: 'primary',
  allow_all_cities: false,
  allowed_cities: [],
  min_order_amount: 0,
  max_order_amount: 0,
};

function WebsitePaymentMethods() {
  const paymentMethods = useSelector((state) => state.websitePaymentMethod);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const theme = useTheme();

  const COLOR_OPTIONS = [
    {
      name: 'primary',
      value: theme.palette.primary.main,
    },
    {
      name: 'secondary',
      value: theme.palette.secondary.main,
    },
    {
      name: 'success',
      value: theme.palette.success.main,
    },
    {
      name: 'info',
      value: theme.palette.info.main,
    },
    {
      name: 'warning',
      value: theme.palette.warning.main,
    },
    {
      name: 'error',
      value: theme.palette.error.main,
    },
  ];

  const [type, setType] = useState('edit');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(INITIAL_PAYMENT_METHOD);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getWebsitePaymentMethods();
  }, []);
  const handleClickOpen = (type, index) => {
    setType(type);

    if (type === 'edit' && isInteger(index)) {
      setSelectedPaymentMethod(paymentMethods[index || 0]);
    } else {
      setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);
    setOpen(false);
  };
  const handleDeletePayment = (id) => {
    deleteWebsitePaymentMethod(id).then(() => {
      enqueueSnackbar('Delete success', { variant: 'success' });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (type === 'edit') {
      updateWebsitePaymentMethod(selectedPaymentMethod)
        .then(() => {
          setLoading(false);
          enqueueSnackbar('Update success', { variant: 'success' });
          handleClose();
          setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);
        })
        .catch(() => {
          setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);

          setLoading(false);
        });
    } else {
      addWebsitePaymentMethod(selectedPaymentMethod)
        .then(() => {
          setLoading(false);
          enqueueSnackbar('Add success', { variant: 'success' });
          handleClose();
          setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);
        })
        .catch(() => {
          setLoading(false);
          setSelectedPaymentMethod(INITIAL_PAYMENT_METHOD);
        });
      setLoading(false);
    }
  };
  return (
    <>
      <Card>
        <Stack spacing={2.5} sx={{ p: 2.5 }} alignItems="flex-start">
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Payment Methods
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              },

              width: '100%',
            }}
          >
            {paymentMethods.map((paymentMethod, index) => (
              <Stack
                key={`${index}-payment-method`}
                sx={{
                  p: 2,
                  width: '100%',
                  // margin: '10px',
                  bgcolor: 'background.neutral',
                  borderRadius: theme.shape.borderRadius + 'px',
                }}
                spacing={2}
              >
                <Img
                  src={paymentMethod.image}
                  sx={{ width: '100px', height: '100px', borderRadius: theme.shape.borderRadiusSm + 'px' }}
                />
                <Stack spacing={1.5}>
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Payment Name
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {paymentMethod.name}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Account Holder Name
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {paymentMethod.account_holder_name || '-'}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Account Number
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {paymentMethod.account_number || '-'}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Limited Amount
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                      {parseInt(paymentMethod.min_order_amount, 10) !== 0 ||
                      parseInt(paymentMethod.max_order_amount, 10) !== 0
                        ? `${fCurrency(paymentMethod.min_order_amount)} - ${fCurrency(paymentMethod.max_order_amount)}`
                        : '-'}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Allow All Cities
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                      {paymentMethod.allow_all_cities ? 'Yes' : 'No'}
                    </Typography>
                  </Stack>
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" sx={{ width: '30%' }} color={'text.secondary'} gutterBottom>
                      Allowed Cities
                    </Typography>

                    <Stack direction={'row'} justifyContent={'flex-end'} flexWrap={'wrap'}>
                      {paymentMethod.allowed_cities.map((val, index) => (
                        <Chip
                          key={val}
                          size="small"
                          sx={{
                            borderRadius: '8px ',
                            m: 0.5,
                          }}
                          label={val}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />}
                      onClick={() => {
                        handleDeletePayment(paymentMethod.id || '');
                      }}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Iconify icon={'solar:pen-new-round-bold-duotone'} />}
                      onClick={() => handleClickOpen('edit', index)}
                    >
                      Edit
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Box>

          <Button size="small" onClick={() => handleClickOpen('add')} startIcon={<Iconify icon="mynaui:plus-solid" />}>
            Add new payment method
          </Button>
        </Stack>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="store-payment-method-dialog"
        aria-describedby="store-payment-method-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="store-payment-method-dialog">
          {type === 'edit' ? selectedPaymentMethod.name : 'New Payment Method'}
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5} sx={{ mt: 2.5 }}>
              <Media
                initialSelected={[{ image: selectedPaymentMethod.image }]}
                single
                onChange={(data) => {
                  setSelectedPaymentMethod((preState) => {
                    return { ...preState, image: data[0]?.full_url };
                  });
                }}
              />

              <FormControl>
                <FormLabel id="color-Picker">Color</FormLabel>
                <ColorSinglePicker
                  required
                  value={COLOR_OPTIONS.filter((col) => col.name === selectedPaymentMethod.color)[0]?.value || ''}
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return {
                        ...preState,
                        color: COLOR_OPTIONS.filter((col) => col.value === event.target.value)[0]?.name,
                      };
                    });
                  }}
                  colors={COLOR_OPTIONS.map((col) => col.value)}
                />
              </FormControl>

              <Stack spacing={2.5} direction={'row'}>
                <TextField
                  sx={{ width: '100%' }}
                  label={'Name'}
                  value={selectedPaymentMethod.name}
                  required
                  placeholder="KPay"
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return { ...preState, name: event.target.value };
                    });
                  }}
                />

                <TextField
                  sx={{ width: '100%' }}
                  label={'Description'}
                  value={selectedPaymentMethod.description}
                  placeholder="..."
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return { ...preState, description: event.target.value };
                    });
                  }}
                />
              </Stack>
              <Stack spacing={2.5} direction={'row'}>
                <TextField
                  sx={{ width: '100%' }}
                  label={'Account Holder Name'}
                  value={selectedPaymentMethod.account_holder_name}
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return {
                        ...preState,
                        account_holder_name: event.target.value,
                      };
                    });
                  }}
                />

                <TextField
                  sx={{ width: '100%' }}
                  label={'Account Number'}
                  type={'number'}
                  value={selectedPaymentMethod.account_number}
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return { ...preState, account_number: event.target.value };
                    });
                  }}
                />
              </Stack>
              <Stack spacing={2.5} direction={'row'}>
                <TextField
                  sx={{ width: '100%' }}
                  label={'Minimum Order Amount'}
                  type="number"
                  value={selectedPaymentMethod.min_order_amount}
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return {
                        ...preState,
                        min_order_amount: event.target.value,
                      };
                    });
                  }}
                />

                <TextField
                  sx={{ width: '100%' }}
                  label={'Maximum Order Amount'}
                  type={'number'}
                  value={selectedPaymentMethod.max_order_amount}
                  onChange={(event) => {
                    setSelectedPaymentMethod((preState) => {
                      return { ...preState, max_order_amount: event.target.value };
                    });
                  }}
                />
              </Stack>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedPaymentMethod.allow_all_cities}
                    onChange={(event) => {
                      setSelectedPaymentMethod((preState) => {
                        return { ...preState, allow_all_cities: !selectedPaymentMethod.allow_all_cities };
                      });
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Allow All Cities"
              />

              <Autocomplete
                multiple
                value={selectedPaymentMethod.allowed_cities}
                onChange={(event, value) => {
                  setSelectedPaymentMethod((preState) => {
                    return { ...preState, allowed_cities: value };
                  });
                }}
                options={allCities}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      size="small"
                      sx={{
                        borderRadius: '8px ',
                      }}
                      label={option}
                    />
                  ))
                }
                renderInput={(params) => <TextField label="Tags" {...params} />}
              />
            </Stack>
            <input hidden type={'submit'} ref={inputRef} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color={'black'} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant={'contained'}
            color={'black'}
            onClick={() => {
              inputRef.current?.click();
            }}
            autoFocus
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WebsitePaymentMethods;
