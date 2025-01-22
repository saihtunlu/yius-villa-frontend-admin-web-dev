import {
  TextField,
  Stack,
  Grid2 as Grid,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  CardHeader,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';

import LoadingButton from '@mui/lab/LoadingButton';

import Iconify from '../../common/Iconify';
import { updateStore, INITIAL_STORE } from '../../../redux/slices/store';

export const STORE_TYPES = [
  'Beauty',
  'Clothing',
  'Electronics',
  'Furniture',
  'Handcrafts',
  'Jewelry',
  'Painting',
  'Photography',
  'Restaurants',
  'Groceries',
  'Other food & drink',
  'Sports',
  'Toys',
  'Services',
  'Virtual services',
  'Other',
  "I havn't decided yet",
];

function AttendanceSettingForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { initialStore } = props;
  const [store, setStore] = useState(INITIAL_STORE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStore(initialStore);
    return () => {};
  }, [initialStore]);

  // handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateStore(store)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Update success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const data = {
    late_deduction: 0,
    half_day_deduction: 0,
    latest_late_time: null,
    latest_check_in_time: null,
    start_check_out_time: null,
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <Card sx={{ p: 2.5 }}>
            <Typography variant="subtitle1">Deductions</Typography>

            <Stack spacing={2.5} sx={{ pt: 2.5 }}>
              <Stack
                spacing={2.5}
                direction={{
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                }}
                sx={{}}
                alignItems={'center'}
              >
                <TextField
                  sx={{ width: '50%' }}
                  label={'Absent Deduction'}
                  required
                  helperText="Percentage of Daily Salary"
                  placeholder="In Percentage"
                  type={'number'}
                  value={store.settings.absent_deduction || ''}
                  onChange={(event) => {
                    setStore((preState) => {
                      return { ...preState, settings: { ...preState.settings, absent_deduction: event.target.value } };
                    });
                  }}
                />

                <TextField
                  sx={{ width: '50%' }}
                  label={'Late Deduction'}
                  required
                  placeholder="Amount"
                  type={'number'}
                  value={store.settings.late_deduction || ''}
                  onChange={(event) => {
                    setStore((preState) => {
                      return { ...preState, settings: { ...preState.settings, late_deduction: event.target.value } };
                    });
                  }}
                  helperText="Any Amount for Late Deduction"
                />
              </Stack>

              <Stack
                spacing={2.5}
                direction={{
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                }}
                sx={{}}
                alignItems={'center'}
              >
                <TextField
                  sx={{ width: '50%' }}
                  label={'Unpaid Leave Deduction'}
                  required
                  type={'number'}
                  placeholder="In Percentage"
                  helperText="Percentage of Daily Salary"
                  value={store.settings.unpaid_leave_deduction || ''}
                  onChange={(event) => {
                    setStore((preState) => {
                      return {
                        ...preState,
                        settings: { ...preState.settings, unpaid_leave_deduction: event.target.value },
                      };
                    });
                  }}
                />

                <TextField
                  sx={{ width: '50%' }}
                  label={'Half Day Deduction'}
                  required
                  placeholder="In Percentage"
                  type={'number'}
                  helperText="Percentage of Daily Salary"
                  value={store.settings.half_day_deduction || ''}
                  onChange={(event) => {
                    setStore((preState) => {
                      return {
                        ...preState,
                        settings: { ...preState.settings, half_day_deduction: event.target.value },
                      };
                    });
                  }}
                />
              </Stack>
            </Stack>
          </Card>

          <Card sx={{ p: 2.5, mt: 2.5 }}>
            <Stack spacing={2.5}>
              <Typography variant="overline">Attendance Times</Typography>
              <Stack
                spacing={2.5}
                direction={{
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                }}
                sx={{}}
                alignItems={'center'}
              >
                <TimePicker
                  sx={{ width: '100%' }}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:clock-circle-bold-duotone" /> }}
                  value={
                    store.settings.latest_check_in_time ? moment(store.settings.latest_check_in_time, 'HH:mm:ss') : null
                  }
                  label="Maximum Check In Time"
                  onChange={(newValue) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.settings.latest_check_in_time = moment(newValue).format('HH:mm:ss');
                      return { ...newState };
                    });
                  }}
                />

                <TimePicker
                  sx={{ width: '100%' }}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:clock-circle-bold-duotone" /> }}
                  value={
                    store.settings.start_check_out_time ? moment(store.settings.start_check_out_time, 'HH:mm:ss') : null
                  }
                  label="Minimum Check Out Time"
                  onChange={(newValue) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.settings.start_check_out_time = moment(newValue).format('HH:mm:ss');
                      return { ...newState };
                    });
                  }}
                />
              </Stack>

              <Stack
                spacing={2.5}
                direction={{
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                }}
                sx={{}}
                alignItems={'center'}
              >
                <TimePicker
                  sx={{ width: '100%' }}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:clock-circle-bold-duotone" /> }}
                  value={store.settings.late_time ? moment(store.settings.late_time, 'HH:mm:ss') : null}
                  label="Start Time (Late Status)"
                  onChange={(newValue) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.settings.late_time = moment(newValue).format('HH:mm:ss');
                      return { ...newState };
                    });
                  }}
                />

                <TimePicker
                  sx={{ width: '100%' }}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:clock-circle-bold-duotone" /> }}
                  value={store.settings.latest_late_time ? moment(store.settings.latest_late_time, 'HH:mm:ss') : null}
                  label="End Time (Late Status)"
                  onChange={(newValue) => {
                    setStore((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.settings.latest_late_time = moment(newValue).format('HH:mm:ss');
                      return { ...newState };
                    });
                  }}
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton color="black" type="submit" size="large" variant="contained" loading={loading}>
                  Save Changes
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
const mapStateToProps = (state) => ({
  initialStore: state.auth?.user?.store || INITIAL_STORE,
});
export default connect(mapStateToProps)(AttendanceSettingForm);
