import { Icon } from '@iconify/react';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
// material
import {
  Card,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material';
import { useEffect, useState } from 'react';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';
import AddressPicker from '../../common/AddressPicker';
import { INITIAL_ORDER } from './OrderNewForm';
import Avatar from '../../common/Avatar';
import Iconify from '../../common/Iconify';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function CustomerDetail({ initialOrder, onSaveCustomer }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(INITIAL_ORDER);

  const handleClickOpen = () => {
    setOrder(initialOrder);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOrder(initialOrder);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title="Customer Detail"
          action={
            <Button
              size="small"
              type="button"
              onClick={handleClickOpen}
              startIcon={<Iconify icon={'solar:pen-new-round-bold-duotone'} width={20} height={20} />}
            >
              Edit
            </Button>
          }
        />

        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Name
              </Typography>

              <Stack direction={'row'} alignItems={'center'}>
                <Avatar
                  sx={{ width: 25, height: 25, mr: '5px' }}
                  user={{
                    first_name: initialOrder.customer?.name,
                  }}
                />
                <Typography variant="subtitle3">{initialOrder.customer?.name || '-'}</Typography>
              </Stack>
            </Stack>
            {/* <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Email
              </Typography>
              <Typography variant="subtitle3">{initialOrder.email || '-'}</Typography>
            </Stack> */}
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Phone number
              </Typography>
              <Typography variant="subtitle3">{initialOrder.customer?.phone || '-'}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                State
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.address?.state?.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                City
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.address?.city?.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Street Address
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder?.address?.address || '-'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="customer-detail-dialog"
        aria-describedby="customer-detail-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="customer-detail-dialog">
          Customer Detail
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <RemoteAutocomplete
              value={order.customer.name}
              onChange={(value, data) => {
                if (data) {
                  setOrder((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.customer = data;
                    newState.address = data.address;
                    return newState;
                  });
                } else {
                  setOrder((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.customer.name = value;

                    return newState;
                  });
                }
              }}
              required
              remote="customer/search/"
              label={'Name'}
            />
            <div>
              <LabelStyle>Gender</LabelStyle>
              <RadioGroup
                aria-label="gender"
                value={order.customer.gender}
                name="gender-radio-buttons-group"
                onChange={(event) =>
                  setOrder((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.customer.gender = event.target.value;
                    return newState;
                  })
                }
                row
              >
                <Stack spacing={1} direction="row">
                  {['Female', 'Male', 'Other'].map((status) => (
                    <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                  ))}
                </Stack>
              </RadioGroup>
            </div>

            <TextField
              value={order.customer.phone}
              onChange={(event) =>
                setOrder((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.customer.phone = event.target.value;
                  return newState;
                })
              }
              fullWidth
              required
              label="Phone number"
            />
            {/* <TextField
              value={order.email}
              type={'email'}
              onChange={(event) =>
                setOrder((preState) => {
                  return { ...preState, email: event.target.value };
                })
              }
              fullWidth
              label="Email address"
            /> */}

            <AddressPicker
              initialAddress={order.address}
              onChangeState={(state) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    address: { ...preState.address, state },
                  };
                });
              }}
              onChangeCity={(city) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    address: { ...preState.address, city },
                  };
                });
              }}
              onChangeStreetAddress={(address) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    address: {
                      ...preState.address,
                      address,
                    },
                  };
                });
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="black" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={'contained'}
            color="black"
            onClick={() => {
              onSaveCustomer(order);
              setOpen(false);
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
