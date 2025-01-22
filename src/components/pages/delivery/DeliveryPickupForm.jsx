import { useState, useEffect, useRef } from 'react';
import {
  Grid2 as Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  CardHeader,
  Typography,
  CardContent,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import onScan from 'onscan.js';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import Media from '../../common/Media';
import AddressPicker from '../../common/AddressPicker';
import EmptyContent from '../../common/EmptyContent';
import Scrollbar from '../../common/Scrollbar';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';
import Iconify from '../../common/Iconify';
import { fCurrency } from '../../../utils/formatNumber';
import { fDate } from '../../../utils/formatTime';
import Label from '../../common/Label';
import { handleAddDeliveryPickup, handleUpdateDeliveryPickup } from '../../../redux/slices/deliveryPickup';
import { PATH_DASHBOARD } from '../../../router/paths';

// ----------------------------------------------------------------------
const initialPickUpItem = {
  sale: null,
  cash_on_delivery_amount: 0,
  delivery_fee: 0,
  store: null,
};
export const initialDeliveryPickupData = {
  total_cash_on_delivery_amount: 0,
  total_delivery_fee: 0,
  total_remaining_balance: 0,
  note: '',
  delivery: {
    name: ' ',
  },
  pickup_items: [],
};
// ----------------------------------------------------------------------

function DeliveryPickupForm({ data, type = 'Update' }) {
  const [value, setValue] = useState(initialDeliveryPickupData);
  const [removed, setRemoved] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    const handlePaste = (event) => {
      const target = event.target;

      // Ignore paste if the target is an input or textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const pastedData = (event.clipboardData || window.clipboardData).getData('text');
      if (!Number.isNaN(pastedData)) {
        console.log('Pasted code:', pastedData);
        filterOrder(pastedData);
      } else {
        console.warn('Pasted data is not a number.');
      }
    };

    // Attach `onscan.js` to the scannerRef element
    if (scannerRef.current) {
      onScan.attachTo(scannerRef.current, {
        onScan: (scannedCode) => {
          console.log('Scanned code:', scannedCode);
          filterOrder(scannedCode);
        },
        reactToPaste: true, // Treat pasted text as a scan
        ignoreIfFocusOn: ['input', 'textarea'],
      });

      // Add paste event listener
      scannerRef.current.addEventListener('paste', handlePaste);
    }

    // Cleanup on component unmount
    return () => {
      if (scannerRef.current) {
        onScan.detachFrom(scannerRef.current);
        scannerRef.current.removeEventListener('paste', handlePaste);
      }
    };
  }, []);

  const filterOrder = (id) => {
    axios
      .get('sale/pickup-filter/?id=' + id)
      .then(({ data }) => {
        setValue((preState) => {
          // Check if data.sale already exists in pickup_items
          const saleExists = preState.pickup_items.some((item) => item.sale === data.sale);

          // Only add the new item if it doesn't exist
          if (!saleExists) {
            var newState = JSON.parse(JSON.stringify(preState));
            newState.pickup_items = [
              ...newState.pickup_items,
              {
                sale: data.sale,
                cash_on_delivery_amount: data.cash_on_delivery_amount,
                delivery_fee: 0,
              },
            ];

            const totalCOD = newState.pickup_items.reduce((sum, item) => sum + (item.cash_on_delivery_amount || 0), 0);

            newState.total_cash_on_delivery_amount = totalCOD;

            enqueueSnackbar(`Order - "${data.sale}" has been added`, {
              variant: 'success',
            });

            return newState;
          }

          // If it already exists, return the state unchanged
          return preState;
        });
      })
      .catch((e) => {
        console.log('🚀 ~ axios.get ~ e:', e);
      });
  };

  useEffect(() => {
    if (data) {
      setValue(data);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = type === 'Update';
    const axiosFetch = isEdit ? handleUpdateDeliveryPickup : handleAddDeliveryPickup;

    axiosFetch({ data: value, removed })
      .then((data) => {
        console.log('🚀 ~ .then ~ data:', data);
        setLoading(false);
        enqueueSnackbar(' success', {
          variant: 'success',
        });
        if (!isEdit) {
          navigate(PATH_DASHBOARD.delivery.editPickup(data.id));
        }
      })
      .catch((e) => {
        console.log('🚀 ~ handleSubmit ~ e:', e);
        setLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit} ref={scannerRef}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2.5}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Item
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({value.pickup_items.length} item)
                    </Typography>
                  </Typography>
                }
                action={
                  <Label variant="ghost" color={'info'}>
                    {fDate(value.created_at)}
                  </Label>
                }
                sx={{ mb: 2.5 }}
              />

              {value.pickup_items.length !== 0 ? (
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 720 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>Order ID</TableCell>
                          <TableCell>COD Amount</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {value.pickup_items.map((item, index) => {
                          return (
                            <TableRow key={`${index}`}>
                              <TableCell>No.{index + 1}</TableCell>
                              <TableCell>{item.sale}</TableCell>

                              <TableCell>{fCurrency(item.cash_on_delivery_amount)}</TableCell>

                              <TableCell align="right">
                                <Tooltip title="Remove item">
                                  <IconButton
                                    onClick={() => {
                                      setRemoved((preState) => [...preState, item]);
                                      setValue((preState) => {
                                        var newState = JSON.parse(JSON.stringify(preState));
                                        newState.pickup_items.splice(index, 1);
                                        return newState;
                                      });
                                    }}
                                  >
                                    <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              ) : (
                <EmptyContent
                  title="Empty"
                  description="Look like you have no items in your pickup."
                  img={'/assets/illustrations/illustration_empty_cart.svg'}
                />
              )}
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2.5}>
            <Card>
              <CardHeader title="Delivery Detail" />

              <CardContent>
                <Stack spacing={2.5}>
                  <RemoteAutocomplete
                    value={value.delivery?.name || '-'}
                    onChange={(value, data) => {
                      if (data) {
                        setValue((preState) => {
                          var newState = JSON.parse(JSON.stringify(preState));
                          newState.delivery = data;
                          return newState;
                        });
                      }
                    }}
                    required
                    remote="delivery/search/"
                    label={'Delivery Company'}
                  />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Office Phone Number
                    </Typography>

                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="subtitle3">{value.delivery.telephone || '-'}</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Main Contact Phone Number
                    </Typography>

                    <Stack direction={'row'} alignItems={'center'}>
                      <Typography variant="subtitle3">{value.delivery.contact_person || '-'}</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Office Address
                    </Typography>

                    <Stack
                      direction={'row'}
                      sx={{
                        maxWidth: '70%',
                      }}
                      alignItems={'center'}
                    >
                      <Typography variant="subtitle3" textAlign={'right'}>
                        {value.delivery?.delivery_address?.address || '-'},{' '}
                        {value.delivery?.delivery_address?.city?.split('_').join(' ') || '-'},{' '}
                        {value.delivery?.delivery_address?.state?.split('_').join(' ') || '-'}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Summary" />

              <CardContent>
                <Stack spacing={2.5}>
                  <TextField
                    value={value.total_cash_on_delivery_amount}
                    type="number"
                    onChange={(event) =>
                      setValue((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.total_cash_on_delivery_amount = event.target.value;
                        return newState;
                      })
                    }
                    fullWidth
                    required
                    label="Total COD Amount"
                  />

                  <TextField
                    value={value.total_delivery_fee}
                    type="number"
                    onChange={(event) =>
                      setValue((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.total_delivery_fee = event.target.value;
                        newState.total_remaining_balance =
                          parseInt(newState.total_cash_on_delivery_amount, 10) - event.target.value;

                        return newState;
                      })
                    }
                    fullWidth
                    required
                    label="Total Deli Fee"
                  />

                  <TextField
                    value={value.total_remaining_balance}
                    type="number"
                    onChange={(event) =>
                      setValue((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.total_remaining_balance = event.target.value;
                        return newState;
                      })
                    }
                    fullWidth
                    required
                    label="Total Remaining Balance"
                  />

                  <TextField
                    value={value.note}
                    onChange={(event) =>
                      setValue((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.note = event.target.value;
                        return newState;
                      })
                    }
                    rows={4}
                    fullWidth
                    multiline
                    label="Note"
                  />
                </Stack>
              </CardContent>
            </Card>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              {type} Delivery Pickup
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default DeliveryPickupForm;
