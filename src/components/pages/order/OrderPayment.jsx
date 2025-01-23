import { useState } from 'react';
import { Icon } from '@iconify/react';
// material
import {
  Card,
  Button,
  Typography,
  Stack,
  Paper,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  useTheme,
  Box,
  styled,
  List,
  FormControlLabel,
  RadioGroup,
  ListItem,
  ListItemButton,
  Radio,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { fDateTimeSuffix } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';
import Label from '../../common/Label';
import Media from '../../common/Media';
import Img from '../../common/Img';
import Iconify from '../../common/Iconify';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const INITIAL_PAYMENT = {
  amount: '',
  date: new Date(),
  payment_method: {
    name: '',
  },
  image: '/assets/img/default.png',
};

export const addOrderPayment = async (payment) => {
  try {
    const { data } = await axios.post('sale/payment/', { data: payment });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
export const removeOrderPayment = async (id) => {
  try {
    const { data } = await axios.delete(`sale/payment/?id=${id}`);
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export default function OrderPayment({ initialOrder, onRemovePayment, onChange }) {
  const payments = useSelector((state) => state.paymentMethod);
  const [open, setOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [checkingIndex, setCheckingIndex] = useState(0);

  const [addingPayment, setAddingPayment] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const theme = useTheme();
  const [payment, setPayment] = useState(INITIAL_PAYMENT);
  const handleClickOpen = () => {
    setPayment((pre) => ({ ...pre, amount: initialOrder.due_amount }));
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCheckPayment = (id, checked) => {
    setCheckingPayment(true);
    const payload = {
      sid: initialOrder.id,
      id,
      checked,
    };
    axios
      .put('sale/payment/', { data: payload })
      .then(({ data }) => {
        setCheckingPayment(false);
        onChange(data);
      })
      .catch(() => {
        setCheckingPayment(false);
      });
  };

  const handleAddPayment = (e) => {
    e.preventDefault();

    setAddingPayment(true);
    const payload = {
      ...payment,
      sale_id: initialOrder.id,
    };
    addOrderPayment(payload)
      .then((data) => {
        setOpen(false);
        setAddingPayment(false);
        onChange(data);
        setPayment(INITIAL_PAYMENT);
      })
      .catch(() => {
        setOpen(false);
        setAddingPayment(false);
      });
  };

  const handleRemovePayment = (id, index) => {
    if (id) {
      removeOrderPayment(id).then((data) => {
        onChange(data);
      });
    }
  };
  return (
    <>
      <Card>
        <Stack sx={{ p: 2.5, pb: 0 }} direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
          <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
            <Typography variant="subtitle1">Payments</Typography>
            <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'}>
              Paid amount : {fCurrency(initialOrder.paid_amount)}
            </Label>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (initialOrder.payment_status === 'Unpaid' && 'error') ||
                (initialOrder.payment_status === 'Partially Paid' && 'warning') ||
                'success'
              }
            >
              Due amount : {fCurrency(initialOrder.due_amount)}
            </Label>
          </Stack>

          {(initialOrder.payment_status === 'Unpaid' ||
            initialOrder.payment_status === 'Partially Paid' ||
            initialOrder.due_amount !== 0) && (
            <Button
              size="small"
              onClick={handleClickOpen}
              startIcon={<Iconify width={20} height={20} icon="mynaui:plus-solid" />}
            >
              Add new payment
            </Button>
          )}
        </Stack>
        <CardContent sx={{ p: 2.5 }}>
          {initialOrder.payments.length > 0 ? (
            <Stack spacing={1.5} alignItems="flex-start">
              {initialOrder.payments.map((payment, index) => (
                <Paper
                  key={`${index}-order-payment-${initialOrder.id}`}
                  sx={{
                    p: 2,
                    width: 1,
                    bgcolor: 'background.neutral',
                    borderRadius: theme.shape.borderRadius + 'px',
                  }}
                >
                  <Stack direction={'row'} spacing={1.5} justifyContent={'space-between'}>
                    <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
                      <Img
                        alt="product image"
                        lightbox
                        src={payment.image || '/assets/img/default.png'}
                        sx={{
                          width: 55,
                          height: 55,
                          mb: 2,
                          objectFit: 'cover',
                          marginRight: (theme) => theme.spacing(2),
                          borderRadius: (theme) => theme.shape.borderRadius + 'px',
                        }}
                      />
                      <Box>
                        <Stack direction={'row'} alignItems={'center'}>
                          <Img
                            alt="payment method"
                            src={payment.payment_method?.image}
                            sx={{
                              width: 25,
                              height: 25,

                              objectFit: 'cover',
                              marginRight: (theme) => theme.spacing(1),
                              borderRadius: '100%',
                            }}
                          />
                          <Typography variant="subtitle2">{payment.payment_method?.name}</Typography>
                        </Stack>

                        <Typography variant="body2" sx={{ mt: (theme) => theme.spacing(1) }}>
                          {fCurrency(payment.amount)}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack alignItems={'end'}>
                      <Typography variant="caption">{fDateTimeSuffix(payment.created_at)}</Typography>

                      <Stack
                        direction={'row'}
                        sx={{ mt: (theme) => theme.spacing(1) }}
                        spacing={1.5}
                        alignItems={'center'}
                      >
                        <LoadingButton
                          color={payment.checked ? 'success' : 'warning'}
                          size="small"
                          loading={checkingPayment && checkingIndex === index}
                          startIcon={<Icon icon={payment.checked ? 'line-md:check-all' : 'iconamoon:clock-bold'} />}
                          onClick={() => {
                            setCheckingIndex(index);
                            handleCheckPayment(payment.id, !payment.checked);
                          }}
                          sx={{ mr: 1 }}
                        >
                          {payment.checked ? 'Verified' : 'Verify'}
                        </LoadingButton>

                        <Button
                          color="error"
                          size="small"
                          startIcon={<Icon icon={'solar:trash-bin-minimalistic-bold-duotone'} />}
                          onClick={() => handleRemovePayment(payment.id, index)}
                          sx={{ mr: 1 }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Stack justifyContent={'center'} alignItems="center" p={3}>
              <Stack justifyContent={'center'} alignItems="center">
                <Typography variant="h5" gutterBottom>
                  No payment
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Look like you have to add payment for this order.
                </Typography>
              </Stack>
            </Stack>
          )}
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
        <DialogTitle id="discount-dialog" sx={{ px: 2.5, pt: 2.5 }}>
          <Stack direction={'row'} spacing={1.5} alignItems={'center'}>
            <Typography variant="subtitle1">Add Payment</Typography>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (initialOrder.payment_status === 'Unpaid' && 'error') ||
                (initialOrder.payment_status === 'Partially Paid' && 'warning') ||
                'success'
              }
            >
              Due amount : {fCurrency(initialOrder.due_amount)}
            </Label>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pb: 0, px: 2.5 }}>
          <Stack spacing={2.5} sx={{ mt: 2.5, mb: 2.5 }} direction={{ xs: 'column', sm: 'row' }}>
            <ListWrapperStyle>
              <List
                component={RadioGroup}
                value={JSON.stringify(payment.payment_method)}
                subheader={
                  <ListSubheader component="div" id="payment-methods" sx={{ display: 'flex', pb: 1.5, pt: 2 }}>
                    <Typography variant="subtitle2" id="demo-simple-select-label">
                      Payment Methods
                    </Typography>
                  </ListSubheader>
                }
                onChange={(event) => {
                  setPayment((preState) => {
                    return { ...preState, payment_method: JSON.parse(event.target.value) };
                  });
                }}
                sx={{
                  width: '100%',
                  bgcolor: 'background.paper',
                }}
              >
                {payments.map((method, index) => {
                  const labelId = `payment-method-${index}`;

                  return (
                    <ListItem
                      key={labelId}
                      secondaryAction={<FormControlLabel value={JSON.stringify(method)} control={<Radio />} />}
                      disablePadding
                    >
                      <ListItemButton
                        sx={{ p: 1.5 }}
                        role={undefined}
                        onClick={() => {
                          setPayment((preState) => {
                            return { ...preState, payment_method: method };
                          });
                        }}
                        dense
                      >
                        <ListItemAvatar>
                          <Img
                            alt={method.image}
                            src={method.image}
                            sx={{
                              borderRadius: (theme) => theme.shape.borderRadiusSm + 'px',
                              width: '55px',
                              height: '55px',
                              objectFit: 'cover',
                            }}
                          />
                        </ListItemAvatar>

                        <ListItemText
                          id={labelId}
                          primary={<Typography variant="body2">{method.name}</Typography>}
                          secondary={
                            method.account_number &&
                            method.account_holder_name && (
                              <Typography variant="caption">
                                {method.name !== 'COD' && `${method.account_number} (${method.account_holder_name})`}
                              </Typography>
                            )
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </ListWrapperStyle>
          </Stack>
          <TextField
            value={payment.amount}
            onChange={(event) =>
              setPayment((preState) => {
                return { ...preState, amount: event.target.value };
              })
            }
            fullWidth
            required
            sx={{ mb: 2.5 }}
            label="Amount"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">KS</InputAdornment>,
                type: 'number',
                inputMode: 'numeric',
                inputProps: { min: 0 },
              },
            }}
          />

          <div>
            <LabelStyle>Screenshot</LabelStyle>
            <Media
              single
              initialSelected={[{ image: payment.image || '/assets/img/default.png' }]}
              onChange={(images) => {
                setPayment((preState) => {
                  return { ...preState, image: images[0].full_url };
                });
              }}
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ px: 2.5 }}>
          <Button onClick={handleClose} variant={'outlined'} color="black">
            Cancel
          </Button>
          <LoadingButton
            variant={'contained'}
            color="black"
            onClick={handleAddPayment}
            autoFocus
            loading={addingPayment}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
