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

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function ShippingAddressDetail({ initialOrder, onSave }) {
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
          title="Shipping Address Detail"
          action={
            <Button size="small" type="button" onClick={handleClickOpen} startIcon={<Icon icon={edit2Fill} />}>
              Edit
            </Button>
          }
        />

        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Name
              </Typography>
              <Typography variant="subtitle2">{initialOrder.shipping_address.name || '-'}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Phone number
              </Typography>
              <Typography variant="subtitle2">{initialOrder.shipping_address.phone || '-'}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                State
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle2">
                {initialOrder.shipping_address.state.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                City
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle2">
                {initialOrder.shipping_address.city.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Street Address
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle2">
                {initialOrder.shipping_address.address || '-'}
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
        aria-labelledby="discount-dialog"
        aria-describedby="discount-dialog-description"
      >
        <DialogTitle id="discount-dialog">Shipping Address Detail</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2.5 }}>
            <TextField
              value={order.shipping_address.name}
              onChange={(event) =>
                setOrder((preState) => {
                  return { ...preState, shipping_address: { ...preState.shipping_address, name: event.target.value } };
                })
              }
              fullWidth
              label="Name"
            />

            <TextField
              value={order.phone}
              onChange={(event) =>
                setOrder((preState) => {
                  return { ...preState, shipping_address: { ...preState.shipping_address, phone: event.target.value } };
                })
              }
              fullWidth
              required
              label="Phone number"
              type={'number'}
            />

            <AddressPicker
              initialAddress={order.shipping_address}
              onChangeState={(state) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    shipping_address: { ...preState.shipping_address, state },
                  };
                });
              }}
              onChangeCity={(city) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    shipping_address: { ...preState.shipping_address, city },
                  };
                });
              }}
              onChangeStreetAddress={(address) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    shipping_address: {
                      ...preState.shipping_address,
                      address,
                    },
                  };
                });
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant={'contained'}
            onClick={() => {
              onSave(order);
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
