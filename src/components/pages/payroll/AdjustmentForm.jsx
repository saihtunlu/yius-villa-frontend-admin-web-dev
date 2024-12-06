import { AnimatePresence, m } from 'framer-motion';
import { useState, useEffect } from 'react';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Stack,
  Divider,
  Grid2 as Grid,
  Backdrop,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  InputAdornment,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { connect } from 'react-redux';
import moment from 'moment';

//
import Iconify from '../../common/Iconify';
import { varFade } from '../../animate';
import cssStyles from '../../../utils/cssStyles';
import { NAVBAR } from '../../../config';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

function AdjustmentForm({ store, onClose, onUpdate, data, loading = false, type = 'Edit', open = false }) {
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
          {type} Adjustment
        </DialogTitle>

        <DialogContent sx={{}}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <RemoteAutocomplete
              value={value.employee?.name}
              onChange={(value, data) => {
                setValue((preState) => {
                  return { ...preState, employee: data };
                });
              }}
              required
              remote="employee/search/"
              label={'Employee'}
            />

            <TextField
              multiline
              fullWidth
              rows={3}
              label={'Description'}
              placeholder="..."
              value={value.description || ''}
              onChange={(event) => {
                setValue((preState) => {
                  return {
                    ...preState,
                    description: event.target.value,
                  };
                });
              }}
            />
            <Stack spacing={2.5} direction={'row'}>
              <DatePicker
                sx={{ width: '50%' }}
                label="Date"
                format={'DD-MM-YYYY'}
                required
                value={value.date ? moment(value.date) : null}
                onChange={(newValue) => {
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.date = moment(newValue).format('YYYY-MM-DD');
                    return { ...newState };
                  });
                }}
              />

              <FormControl sx={{ width: '50%' }}>
                <InputLabel id="status-filter">Type</InputLabel>
                <Select
                  labelId="status-filter"
                  id="status-filter-sel"
                  value={value.type}
                  label="Status"
                  onChange={(event) => {
                    setValue((preState) => {
                      return {
                        ...preState,
                        type: event.target.value,
                      };
                    });
                  }}
                >
                  {['Deduction', 'Allowance'].map((val) => (
                    <MenuItem value={val} key={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              placeholder="Enter Amount"
              label="Amount"
              value={value.amount}
              required
              onChange={(event) =>
                setValue((preState) => {
                  return {
                    ...preState,
                    amount: event.target.value,
                  };
                })
              }
              slotProps={{
                input: {
                  ...(store.settings.suffix_currency
                    ? {
                        endAdornment: (
                          <InputAdornment position="start">{store.settings.suffix_currency}</InputAdornment>
                        ),
                      }
                    : {
                        startAdornment: (
                          <InputAdornment position="start">{store.settings.prefix_currency}</InputAdornment>
                        ),
                      }),
                  type: 'number',
                  inputMode: 'numeric',
                  inputProps: { min: 0 },
                },
              }}
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

const mapStateToProps = (state) => {
  return { store: state.auth.user.store };
};

export default connect(mapStateToProps)(AdjustmentForm);
