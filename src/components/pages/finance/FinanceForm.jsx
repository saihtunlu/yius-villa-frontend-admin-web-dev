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

function FinanceForm({ store, onClose, onUpdate, data, loading = false, type = 'Edit', open = false }) {
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
          {type} Finance
        </DialogTitle>

        <DialogContent sx={{}}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <div>
              <LabelStyle>Type</LabelStyle>
              <RadioGroup
                aria-label="finance"
                value={value.type}
                name="finance-radio-buttons-group"
                onChange={(event) =>
                  setValue((preState) => {
                    return { ...preState, type: event.target.value };
                  })
                }
                row
              >
                <Stack spacing={1} direction="row">
                  {['Expense', 'Income'].map((val) => (
                    <FormControlLabel key={val} value={val} control={<Radio required />} label={val} />
                  ))}
                </Stack>
              </RadioGroup>
            </div>
            <Stack direction={'row'} spacing={2.5}>
              <RemoteAutocomplete
                value={value.label?.name}
                onChange={(value, data) => {
                  setValue((preState) => {
                    return { ...preState, label: { name: value } };
                  });
                }}
                required
                remote="finance/labels/"
                label={'Category'}
              />

              <DatePicker
                sx={{ width: '100%' }}
                label="Date"
                format={'DD-MM-YYYY'}
                required
                slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                value={value.date ? moment(value.date) : null}
                onChange={(newValue) => {
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.date = moment(newValue).format('YYYY-MM-DD');
                    return { ...newState };
                  });
                }}
              />
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

            <TextField
              multiline
              fullWidth
              rows={4}
              label={'Note'}
              placeholder="..."
              value={value.note || ''}
              onChange={(event) => {
                setValue((preState) => {
                  return {
                    ...preState,
                    note: event.target.value,
                  };
                });
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

export default connect(mapStateToProps)(FinanceForm);
