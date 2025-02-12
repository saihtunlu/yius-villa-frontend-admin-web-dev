import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

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
  createFilterOptions,
  useTheme,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

import AddressPicker from '../../common/AddressPicker';

import Media from '../../common/Media';
import { PATH_DASHBOARD } from '../../../router/paths';
import Iconify from '../../common/Iconify';
import { INITIAL_STORE } from '../../../redux/slices/store';

export const INITIAL_EMPLOYEE = {
  name: '',
  started_date: null,
  quit_date: null,
  status: 'Active',
  basic_salary: '',
  position: {
    name: '',
  },
  phone: '',
  emergency_phone: '',
  note: '',
  dob: null,
  nrc_no: '',
  gender: '',
  photo: '/assets/img/default.png',
  department: {
    name: '',
  },
  employee_address: {
    state: '',
    city: '',
    address: '',
  },
  employee_allowance: [
    {
      description: '',
      amount: '',
    },
  ],
};

const filter = createFilterOptions();

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const NewEmployeeForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState(INITIAL_EMPLOYEE);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);

  // effects
  useEffect(() => {
    getDepartments();
    return () => {};
  }, []);

  // actions
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post('employee/', { data })
      .then((res) => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.employee.edit(res.data.id));
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getDepartments = () => {
    var url = `employee/departments/`;
    axios.get(url).then(({ data }) => {
      setDepartmentData(data);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <Stack spacing={2.5}>
            <Card>
              <Stack spacing={2.5} sx={{ px: 2.5, py: 4 }} alignItems={'center'}>
                <Media
                  initialSelected={[{ image: data.photo }]}
                  single
                  profile
                  onChange={(data) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.photo = data[0]?.full_url;
                      return newState;
                    });
                  }}
                />
                <Typography
                  variant="caption"
                  maxWidth={'50%'}
                  sx={{ pb: 4 }}
                  textAlign={'center'}
                  color="textSecondary"
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3 Mb
                </Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 8 }}>
          <Stack spacing={2.5}>
            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">General Information</Typography>
                <TextField
                  sx={{ width: '100%' }}
                  label={'Full Name'}
                  value={data.name}
                  required
                  onChange={(event) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.name = event.target.value;
                      return newState;
                    });
                  }}
                />

                <Stack
                  spacing={2.5}
                  direction={{
                    lg: 'row',
                    md: 'row',
                    sm: 'column',
                    xs: 'column',
                  }}
                >
                  <TextField
                    sx={{ width: '100%' }}
                    label={'NRC No.'}
                    required
                    value={data.nrc_no}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.nrc_no = event.target.value;
                        return newState;
                      });
                    }}
                  />
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Date of Birth"
                    format={'DD-MM-YYYY'}
                    slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                    required
                    value={data.dob ? moment(data.dob) : null}
                    onChange={(newValue) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.dob = moment(newValue).format('YYYY-MM-DD');
                        return { ...newState };
                      });
                    }}
                  />
                </Stack>

                <div>
                  <LabelStyle>Gender</LabelStyle>
                  <RadioGroup
                    aria-label="gender"
                    value={data.gender}
                    name="gender-radio-buttons-group"
                    onChange={(event) =>
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.gender = event.target.value;
                        return newState;
                      })
                    }
                    row
                  >
                    <Stack spacing={1} direction="row">
                      {['Female', 'Male', 'Other'].map((status) => (
                        <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                      ))}
                    </Stack>
                  </RadioGroup>
                </div>
              </Stack>
            </Card>
            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Contact Information</Typography>

                <Stack
                  spacing={2.5}
                  direction={{
                    lg: 'row',
                    md: 'row',
                    sm: 'column',
                    xs: 'column',
                  }}
                >
                  <TextField
                    sx={{ width: '100%' }}
                    label={'Phone Number'}
                    required
                    type="number"
                    value={data.phone}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.phone = event.target.value;
                        return newState;
                      });
                    }}
                  />

                  <TextField
                    sx={{ width: '100%' }}
                    label={'Emergency Contact Phone Number'}
                    required
                    type="number"
                    value={data.emergency_phone}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.emergency_phone = event.target.value;
                        return newState;
                      });
                    }}
                  />
                </Stack>

                <AddressPicker
                  initialAddress={data.employee_address}
                  onChangeState={(state) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.employee_address.state = state;
                      return newState;
                    });
                  }}
                  onChangeCity={(city) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.employee_address.city = city;
                      return newState;
                    });
                  }}
                  onChangeStreetAddress={(address) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.employee_address.address = address;
                      return newState;
                    });
                  }}
                />
              </Stack>
            </Card>
            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Employment Record</Typography>

                <Stack
                  spacing={2.5}
                  direction={{
                    lg: 'row',
                    md: 'row',
                    sm: 'column',
                    xs: 'column',
                  }}
                >
                  <DatePicker
                    sx={{ width: '100%' }}
                    label="Started Date"
                    format={'DD-MM-YYYY'}
                    slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                    required
                    value={data.started_date ? moment(data.started_date) : null}
                    onChange={(newValue) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.started_date = moment(newValue).format('YYYY-MM-DD');
                        return { ...newState };
                      });
                    }}
                  />

                  <TextField
                    sx={{ width: '100%' }}
                    label={'Basic Salary'}
                    type="number"
                    required
                    value={data.basic_salary}
                    onChange={(event) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.basic_salary = event.target.value;
                        return newState;
                      });
                    }}
                  />
                </Stack>

                <Stack
                  spacing={2.5}
                  direction={{
                    lg: 'row',
                    md: 'row',
                    sm: 'column',
                    xs: 'column',
                  }}
                >
                  <Autocomplete
                    fullWidth
                    options={departmentData.map((data) => data.name)}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                    value={data.department.name || ''}
                    onChange={(_, value) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.department.name = value;
                        newState.position.name = '';
                        return { ...newState };
                      });
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option);
                      if (inputValue !== '' && !isExisting) {
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                  />

                  <Autocomplete
                    fullWidth
                    options={
                      departmentData
                        .filter((val) => val.name === data.department.name)[0]
                        ?.department_positions.map((data) => data.name) || []
                    }
                    renderInput={(params) => <TextField {...params} label="Position" />}
                    value={data.position.name || ''}
                    onChange={(_, value) => {
                      setData((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.position.name = value;
                        return { ...newState };
                      });
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option);
                      if (inputValue !== '' && !isExisting) {
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                  />
                </Stack>
              </Stack>
            </Card>

            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Stack sx={{}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                  <Typography variant="subtitle1">Allowance</Typography>
                  <Tooltip title="Add Allowance">
                    <IconButton
                      sx={{}}
                      aria-label="Add"
                      onClick={() => {
                        setData((preState) => {
                          var newState = JSON.parse(JSON.stringify(preState));
                          newState.employee_allowance = [
                            ...newState.employee_allowance,
                            {
                              description: '',
                              amount: 0,
                            },
                          ];
                          return newState;
                        });
                      }}
                    >
                      <Iconify icon="mynaui:plus-solid" />
                    </IconButton>
                  </Tooltip>
                </Stack>

                {data.employee_allowance.map((val, index) => {
                  return (
                    <Stack
                      key={index + 'allowance'}
                      spacing={2.5}
                      direction={{
                        sm: 'column',
                        md: 'row',
                        lg: 'row',
                      }}
                      sx={{}}
                      alignItems={'center'}
                    >
                      <Autocomplete
                        options={['Workday Bonus', 'Overtime']}
                        sx={{ width: 'calc(70% - 30px)' }}
                        renderInput={(params) => <TextField {...params} label="Description" />}
                        value={val.description}
                        onChange={(_, value) => {
                          setData((preState) => {
                            var newState = JSON.parse(JSON.stringify(preState));
                            newState.employee_allowance[index].description = value;
                            return { ...newState };
                          });
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);
                          const { inputValue } = params;
                          // Suggest the creation of a new value
                          const isExisting = options.some((option) => inputValue === option);
                          if (inputValue !== '' && !isExisting) {
                            filtered.push(inputValue);
                          }
                          return filtered;
                        }}
                      />

                      <TextField
                        sx={{ width: 'calc(30% - 30px)' }}
                        label="Amount"
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">Ks</InputAdornment>,
                            type: 'number',
                            inputMode: 'numeric',
                            inputProps: { min: 0 },
                          },
                        }}
                        value={val.amount}
                        onChange={(event) => {
                          setData((preState) => {
                            var newState = JSON.parse(JSON.stringify(preState));
                            newState.employee_allowance[index].amount = event.target.value;
                            return { ...newState };
                          });
                        }}
                      />
                      <Tooltip title="Remove">
                        <IconButton
                          onClick={() => {
                            setData((preState) => {
                              var newState = JSON.parse(JSON.stringify(preState));
                              newState.employee_allowance.splice(index, 1);
                              return { ...newState };
                            });
                          }}
                          sx={{ width: '45px', height: '45px' }}
                        >
                          <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>

            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Note Record</Typography>

                <TextField
                  multiline
                  fullWidth
                  rows={6}
                  label={'Note'}
                  placeholder="..."
                  value={data.note || ''}
                  onChange={(event) => {
                    setData((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.note = event.target.value;
                      return { ...newState };
                    });
                  }}
                />
              </Stack>

              <Stack alignItems={'flex-end'} mt={2.5}>
                <LoadingButton color="black" size="large" type="submit" variant="contained" loading={loading}>
                  Create Employee
                </LoadingButton>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    store: state.auth?.user?.store || INITIAL_STORE,
  };
};

export default connect(mapStateToProps)(NewEmployeeForm);
