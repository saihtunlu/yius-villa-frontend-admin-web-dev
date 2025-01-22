import { useState, useEffect } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { MobileDateTimePicker } from '@mui/x-date-pickers';

import Media from '../../common/Media';
import AddressPicker from '../../common/AddressPicker';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function DeliveryForm({ onClose, onUpdate, data, loading = false, type = 'Edit', open = false }) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(value);
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={'sm'}
      id="filter-dialog"
      onClose={onClose}
      aria-labelledby="filter"
      aria-describedby="filter"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle variant="subtitle1" id="discount-dialog">
          {type} Coupon
        </DialogTitle>

        <DialogContent sx={{}}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <TextField
              fullWidth
              label="CODE"
              value={value.code}
              onChange={(event) =>
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.code = event.target.value;
                  return newState;
                })
              }
            />
            <Stack direction={'row'} spacing={1.5} justifyContent={'space-between'}>
              <FormControl fullWidth>
                <InputLabel id="discount-type-select-label">Discount Typ</InputLabel>
                <Select
                  labelId="discount-type-select-label-id"
                  id="discount-type-select-id"
                  value={value.discount_type}
                  label="Discount Type"
                  onChange={(event) => {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.discount_type = event.target.value;
                      return newState;
                    });
                  }}
                >
                  {['Amount', 'Percentage'].map((val, index) => (
                    <MenuItem key={`${index}-state`} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Discount Value"
                type={'number'}
                value={value.discount_value}
                onChange={(event) =>
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.discount_value = event.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack direction={'row'} spacing={1.5} justifyContent={'space-between'}>
              <TextField
                fullWidth
                label="Max Discount Value"
                type={'number'}
                value={value.max_discount_value}
                onChange={(event) =>
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.max_discount_value = event.target.value;
                    return newState;
                  })
                }
              />

              <TextField
                fullWidth
                label="Min Order Amount"
                type={'number'}
                value={value.min_order_value}
                onChange={(event) =>
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.min_order_value = event.target.value;
                    return newState;
                  })
                }
              />
            </Stack>

            <Stack spacing={2.5} width={'100%'} direction={'row'} sx={{}}>
              <MobileDateTimePicker
                sx={{ width: '100%' }}
                required
                value={value.start_date ? moment(value.start_date) : null}
                label="Start Date"
                onChange={(newValue) => {
                  if (newValue) {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.start_date = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
                      return { ...newState };
                    });
                  }
                }}
              />
              <MobileDateTimePicker
                required
                sx={{ width: '100%' }}
                label="End Date"
                value={value.end_date ? moment(value.end_date) : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.end_date = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
                      return { ...newState };
                    });
                  }
                }}
              />
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={value.is_active}
                  onChange={() => {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.is_active = !newState.is_active;
                      return { ...newState };
                    });
                  }}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="black" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={loading} variant={'contained'} color={'black'} type="submit">
            Confirm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DeliveryForm;
