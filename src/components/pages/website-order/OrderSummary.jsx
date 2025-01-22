import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  InputAdornment,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';

import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { fCurrency } from '../../../utils/formatNumber';
import Iconify from '../../common/Iconify';

export default function OrderSummary({ initialOrder }) {
  const user = useSelector((state) => state.auth.user);
  const theme = useTheme();
  return (
    <>
      <Card>
        <CardHeader title="Order Summary" />
        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {fCurrency(initialOrder.subtotal)}
              </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Product Discount
              </Typography>
              <Typography variant="body1" color={'error'} fontWeight={600}>
                {initialOrder.products_discount ? `-${fCurrency(initialOrder.products_discount)}` : '-'}
              </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Coupon Code
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {initialOrder.coupon_code || '-'}
              </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Coupon Type
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {initialOrder.coupon_discount_type + `(${initialOrder.coupon_discount_value})` || '-'}
              </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Coupon Discount
              </Typography>
              <Typography variant="body1" color={'error'} fontWeight={600}>
                {initialOrder.coupon_discount ? `-${fCurrency(initialOrder.coupon_discount)}` : '-'}
              </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" color="text.secondary">
                Total Discount
              </Typography>
              <Typography variant="body1" color={'error'} fontWeight={600}>
                {initialOrder.total_discount ? `-${fCurrency(initialOrder.total_discount)}` : '-'}
              </Typography>
            </Stack>

            {user?.role?.name === 'Owner' && (
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="body1" color="text.secondary">
                  Total Profit
                </Typography>
                <Typography variant="body1" color={'success'} fontWeight={600}>
                  {initialOrder.profit_amount ? fCurrency(initialOrder.profit_amount) : '-'}
                </Typography>
              </Stack>
            )}
            <Divider />

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="body1" fontWeight={700} color="text.secondary">
                Grand Total
              </Typography>
              <Typography variant="subtitle2" fontWeight={700} color={'primary'}>
                {initialOrder.total}Ks
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
