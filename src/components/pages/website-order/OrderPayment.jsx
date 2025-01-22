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
  Divider,
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

export default function OrderPayment({ initialOrder, onChange }) {
  const [checkingIndex, setCheckingIndex] = useState(0);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const theme = useTheme();

  const handleCheckPayment = (id, checked) => {
    setCheckingPayment(true);
    const payload = {
      sale_id: initialOrder.id,
      id,
      checked,
    };
    axios
      .put('order/payment/', { data: payload })
      .then(({ data }) => {
        setCheckingPayment(false);
        onChange(data);
      })
      .catch(() => {
        setCheckingPayment(false);
      });
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
        </Stack>
        <CardContent sx={{ p: 2.5 }}>
          {initialOrder.payments.length > 0 ? (
            <Stack spacing={1.5} alignItems="flex-start">
              {initialOrder.payments.map((payment, index) => (
                <Paper
                  key={`${index}-order-payment-${payment.id}`}
                  sx={{
                    p: 1.5,
                    width: 1,
                    bgcolor: 'background.neutral',
                    borderRadius: theme.shape.borderRadius + 'px',
                  }}
                >
                  <Stack>
                    <Typography variant="body1" color="text.secondary">
                      Screenshots
                    </Typography>
                    <Stack direction={'row'} sx={{ mt: 0.5 }} spacing={1}>
                      {payment.screenshots.map((img) => {
                        return (
                          <Img
                            alt="product image"
                            key={img.image}
                            lightbox
                            src={img.image || '/assets/img/default.png'}
                            sx={{
                              width: 55,
                              height: 55,
                              mb: 2,
                              objectFit: 'cover',
                              marginRight: (theme) => theme.spacing(2),
                              borderRadius: (theme) => theme.shape.borderRadius + 'px',
                            }}
                          />
                        );
                      })}
                    </Stack>
                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Payment Method
                      </Typography>
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
                        <Typography variant="body1">{payment.payment_method?.name}</Typography>
                      </Stack>
                    </Stack>
                    <Divider />

                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Amount
                      </Typography>
                      <Typography variant="body2" sx={{}}>
                        {payment.amount}Ks
                      </Typography>
                    </Stack>
                    <Divider />

                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Status
                      </Typography>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                        color={payment.checked ? 'success' : 'warning'}
                      >
                        {payment.checked ? 'Verified' : 'Pending To Verify'}
                      </Label>
                    </Stack>
                    <Divider />

                    <Stack
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      sx={{
                        py: 1.5,
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Added Time
                      </Typography>
                      <Typography variant="body2" sx={{}}>
                        {fDateTimeSuffix(payment.created_at)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack alignItems={'end'} sx={{ mt: 1.5 }}>
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
                      {payment.checked ? 'Verified' : 'Not Verify yet'}
                    </LoadingButton>
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
    </>
  );
}
