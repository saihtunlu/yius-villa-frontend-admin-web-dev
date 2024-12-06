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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { fCurrency } from '../../../utils/formatNumber';
import Iconify from '../../common/Iconify';

export default function OrderSummary({
  total,
  discount,
  subtotal,
  tax,
  taxIncluded,
  onAddedDiscount,
  onAddedExtraFees,
  OnRemoveExtraFee,
  extraFees,
}) {
  const [open, setOpen] = useState(false);
  const [openExtraFees, setOpenExtraFees] = useState(false);
  const [extraFee, setExtraFee] = useState({
    amount: '',
    label: '',
  });

  const [discountTemp, setDiscountTemp] = useState({
    discount: '',
    discountReason: '',
    discountPercentage: '',
    discountType: '',
  });
  useEffect(() => {
    setDiscountTemp(discount);
    return () => {};
  }, [discount]);

  const handleClickOpenExtraFees = () => {
    setOpenExtraFees(true);
  };
  const handleCloseExtraFees = () => {
    setOpenExtraFees(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddDiscount = () => {
    onAddedDiscount(discountTemp);
    setOpen(false);
  };

  const handleAddExtraFees = () => {
    onAddedExtraFees(extraFee);
    setOpenExtraFees(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Order Summary"
          action={
            <Button
              size="small"
              type="button"
              onClick={handleClickOpenExtraFees}
              startIcon={<Iconify width={20} height={20} icon="mynaui:plus-solid" />}
            >
              extra fees
            </Button>
          }
        />
        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sub Total
              </Typography>
              <Typography variant="subtitle3">{fCurrency(subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Tooltip title="Add discount">
                <Button variant="text" onClick={handleClickOpen} sx={{ p: 0, minWidth: 0 }} disableRipple>
                  <Typography variant="body2" sx={{ textDecoration: 'underline' }}>
                    Discount
                  </Typography>
                </Button>
              </Tooltip>

              <Typography variant="subtitle3">
                {discount.discount ? '-' + fCurrency(discount.discount) : '-'}
              </Typography>
            </Stack>

            {/* <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Tax({tax.rate}%)
              </Typography>
              <Typography variant="subtitle3">{fCurrency(tax.value)}</Typography>
            </Stack> */}

            {extraFees.map((fee, index) => {
              return (
                <Stack
                  direction="row"
                  key={`${index}-extra-fee`}
                  justifyContent="space-between"
                  sx={{
                    '&:hover .MuiIconButton-root': {
                      opacity: '1',
                    },
                  }}
                >
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {fee.label}
                    </Typography>
                    <IconButton
                      color={'error'}
                      sx={{ ml: 1, opacity: '0' }}
                      size="small"
                      onClick={() => OnRemoveExtraFee(index)}
                    >
                      <Icon icon={closeFill} />
                    </IconButton>
                  </Stack>
                  <Typography variant="subtitle3">{fCurrency(fee.amount)}</Typography>
                </Stack>
              );
            })}
            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2">Total</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                  {fCurrency(total)}
                </Typography>
                {/* {taxIncluded && (
                  <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                    (TAX included)
                  </Typography>
                )} */}
              </Box>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="discount-dialog"
        aria-describedby="discount-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="discount-dialog">
          Add discount
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <RadioGroup
              aria-label="status"
              value={discountTemp.discountType}
              name="discount-types"
              onChange={(event) =>
                setDiscountTemp((preState) => {
                  return { ...preState, discountType: event.target.value };
                })
              }
              row
            >
              <Stack spacing={1} direction="row">
                {['Percentage', 'Amount'].map((type) => (
                  <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
                ))}
              </Stack>
            </RadioGroup>
            <TextField
              fullWidth
              label="Value"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {discountTemp.discountType === 'Amount' ? 'MMK' : '%'}
                    </InputAdornment>
                  ),
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: { min: 0 },
                },
              }}
              value={discountTemp.discountType === 'Amount' ? discountTemp.discount : discountTemp.discountPercentage}
              onChange={(event) => {
                if (discountTemp.discountType === 'Amount') {
                  setDiscountTemp((preState) => {
                    return { ...preState, discount: event.target.value };
                  });
                } else {
                  setDiscountTemp((preState) => {
                    return {
                      ...preState,
                      discountPercentage: event.target.value,
                    };
                  });
                }
              }}
            />

            <TextField
              multiline
              fullWidth
              rows={3}
              label="Discount reason"
              placeholder="..."
              value={discountTemp.discountReason}
              onChange={(event) =>
                setDiscountTemp((preState) => {
                  return { ...preState, discountReason: event.target.value };
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="black" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="black" onClick={handleAddDiscount} variant={'contained'} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openExtraFees}
        onClose={handleCloseExtraFees}
        fullWidth
        maxWidth={'sm'}
        aria-labelledby="discount-dialog"
        aria-describedby="discount-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="discount-dialog">
          Add Extra Fees
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <TextField
              fullWidth
              label="Label"
              value={extraFee.label}
              onChange={(event) =>
                setExtraFee((preState) => {
                  return { ...preState, label: event.target.value };
                })
              }
            />

            <TextField
              fullWidth
              label="Amount"
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">MMK</InputAdornment>,
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: { min: 0 },
                },
              }}
              value={extraFee.amount}
              onChange={(event) => {
                setExtraFee((preState) => {
                  return { ...preState, amount: event.target.value };
                });
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="black" variant="outlined" onClick={handleCloseExtraFees}>
            Cancel
          </Button>
          <Button color="black" onClick={handleAddExtraFees} variant={'contained'} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
