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
} from '@mui/material';
import { useSnackbar } from 'notistack';

// @types
import { connect } from 'react-redux';
import { useState, useRef } from 'react';
import { isInteger } from 'lodash';
import { LoadingButton } from '@mui/lab';

import { updatePaymentMethod, addPaymentMethod, deletePaymentMethod } from '../../../redux/actions';
import Img from '../../common/Img';
import Media from '../../common/Media';
import Iconify from '../../common/Iconify';
import { ColorSinglePicker } from '../../common/color-utils';

const INITIAL_PAYMENT_METHOD = {
  name: '',
  description: '',
  account_number: '',
  account_holder_name: '',
  image: '/assets/img/default.png',
  color: 'primary',
};

function StorePaymentMethods({ paymentMethods }) {
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
    deletePaymentMethod(id).then(() => {
      enqueueSnackbar('Delete success', { variant: 'success' });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (type === 'edit') {
      updatePaymentMethod(selectedPaymentMethod)
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
      addPaymentMethod(selectedPaymentMethod)
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
                direction={'row'}
              >
                <Img
                  src={paymentMethod.image}
                  sx={{ width: '100px', height: '100px', borderRadius: theme.shape.borderRadiusSm + 'px' }}
                />
                <Stack>
                  <Typography variant="subtitle1" gutterBottom>
                    {paymentMethod.name}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    {paymentMethod.account_number || '-'}{' '}
                    {paymentMethod.account_holder_name && `(${paymentMethod.account_holder_name})`}
                  </Typography>

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

const mapStateToProps = (state) => ({
  paymentMethods: state.payment,
});

export default connect(mapStateToProps)(StorePaymentMethods);
