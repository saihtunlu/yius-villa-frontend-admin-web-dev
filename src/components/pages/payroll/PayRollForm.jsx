import { Icon } from '@iconify/react';
import {
  Card,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  Grid2 as Grid,
  Switch,
  Paper,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  useTheme,
  Box,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';

import Media from '../../common/Media';
import Iconify from '../../common/Iconify';
import EmployeeDetail from './EmployeeDetail';
import PayrollItem from './PayrollItem';
import { fCurrency } from '../../../utils/formatNumber';

const status = ['Draft', 'Pending', 'Paid'];
const currentDate = moment();
const firstDate = currentDate.startOf('month').format('YYYY-MM-DD');
const lastDate = currentDate.endOf('month').format('YYYY-MM-DD');

const PayRollForm = (props) => {
  const { initialData, onSubmit, loading, edit } = props;
  const theme = useTheme();
  const [data, setData] = useState(initialData);
  const [gettingAdjustments, setGettingAdjustments] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = data.items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = 0;
      }
      acc[item.type] += parseInt(item.amount, 10);
      return acc;
    }, {});
    const total = result.Allowance - (result.Deduction || 0);
    onSubmit({ ...data, total });
  };

  // effects
  useEffect(() => {
    if (!edit) {
      setData({ ...initialData, pay_period_start: firstDate, pay_period_end: lastDate });
    } else {
      setData(initialData);
    }
    return () => {};
  }, [initialData]);

  const getPayrollAdjustments = (id) => {
    const date1 = moment(new Date(data.pay_period_start)).format('YYYY-MM-DD');
    const date2 = moment(new Date(data.pay_period_end)).format('YYYY-MM-DD');

    setGettingAdjustments(true);
    var url = `employee/payroll/adjustments/?eid=${id}&from_date=${date1}&to_date=${date2}`;
    axios.get(url).then((res) => {
      setData((preState) => {
        var newState = JSON.parse(JSON.stringify(preState));
        const items = [
          ...newState.items,
          ...res.data.map((val) => ({
            description: val.description,
            amount: val.amount,
            type: val.type,
          })),
        ];

        newState.items = items;
        return newState;
      });
      setGettingAdjustments(false);
    });
  };

  // actions
  const getTotalAdjustments = () => {
    const result = data.items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = 0;
      }
      acc[item.type] += parseInt(item.amount, 10);
      return acc;
    }, {});

    return result || { Allowance: 0, Deduction: 0 };
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <Card sx={{ pb: 2.5 }}>
          <EmployeeDetail
            initialData={data}
            onUpdate={(val) => {
              setData((preState) => {
                var newState = JSON.parse(JSON.stringify(preState));
                newState.employee = val;

                const items = [
                  {
                    description: 'Basic Salary',
                    amount: val.basic_salary,
                    type: 'Allowance',
                  },
                  ...val.employee_allowance.map((item) => ({
                    description: item.description,
                    amount: item.amount,
                    type: 'Allowance',
                  })),
                ];
                newState.items = items;
                return newState;
              });
              getPayrollAdjustments(val.id);
            }}
          />

          <Stack
            spacing={2.5}
            width={'100%'}
            direction={'row'}
            sx={{
              background: theme.palette.background.neutral,
              padding: theme.spacing(2.5),
            }}
          >
            <DatePicker
              sx={{ width: '100%' }}
              format={'DD-MM-YYYY'}
              slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
              value={data.pay_period_start ? moment(data.pay_period_start) : null}
              label="Start Date"
              onChange={(newValue) => {
                setData((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.pay_period_start = moment(newValue).format('YYYY-MM-DD');
                  return { ...newState };
                });
              }}
            />
            <DatePicker
              sx={{ width: '100%' }}
              format={'DD-MM-YYYY'}
              label="End Date"
              slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
              value={data.pay_period_end ? moment(data.pay_period_end) : null}
              onChange={(newValue) => {
                setData((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.pay_period_end = moment(newValue).format('YYYY-MM-DD');
                  return { ...newState };
                });
              }}
            />
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="status-filter">Status</InputLabel>
              <Select
                labelId="status-filter"
                id="status-filter-sel"
                value={data.status}
                label="Status"
                onChange={(event) => {
                  setData((preState) => {
                    return { ...preState, status: event.target.value, page: 0 };
                  });
                }}
              >
                {status.map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            style={{
              position: 'relative',
              padding: theme.spacing(2.5),
            }}
          >
            <Stack sx={{}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Payroll Items
              </Typography>
              <Button
                startIcon={<Iconify icon="mynaui:plus-solid" />}
                onClick={() => {
                  setData((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.items = [
                      ...newState.items,
                      {
                        description: '',
                        amount: 0,
                        type: '',
                      },
                    ];
                    return { ...newState };
                  });
                }}
                color={'success'}
                sx={{}}
                aria-label="delete"
              >
                Add Item
              </Button>
            </Stack>
            {data.items.map((item, index) => {
              return (
                <PayrollItem
                  key={index + 'payroll-item'}
                  initialData={item}
                  onUpdateAmount={(val) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.items[index].amount = val;
                      return { ...newState };
                    });
                  }}
                  onUpdateDescription={(val) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.items[index].description = val;
                      return { ...newState };
                    });
                  }}
                  onUpdateType={(val) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.items[index].type = val;
                      return { ...newState };
                    });
                  }}
                  onRemove={() => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.items.splice(index, 1);
                      return newState;
                    });
                  }}
                />
              );
            })}
          </Stack>
          <Stack alignItems={'flex-end'} direction={'row'} justifyContent={'space-between'}>
            <Box />
            <Stack sx={{ width: '30%', pr: 2.5 }} spacing={2.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Allowance
                </Typography>
                <Typography maxWidth={'70%'} textAlign={'right'} color="success" variant="subtitle3">
                  {fCurrency(getTotalAdjustments().Allowance)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Total Deduction
                </Typography>
                <Typography maxWidth={'70%'} textAlign={'right'} color="error" variant="subtitle3">
                  {fCurrency(getTotalAdjustments().Deduction)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                  Total
                </Typography>
                <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle1">
                  {fCurrency(getTotalAdjustments().Allowance - (getTotalAdjustments().Deduction || 0))}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack alignItems={'flex-end'} mt={2.5} px={2.5}>
            <LoadingButton
              loading={loading}
              size="large"
              type="submit"
              color="black"
              sx={{ minWidth: '120px' }}
              variant="contained"
            >
              Confirm
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </form>
  );
};

export default PayRollForm;
