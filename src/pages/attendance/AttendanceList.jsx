import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid2 as Grid,
  Button,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableHead,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useNavigation } from 'react-router-dom';
import { connect } from 'react-redux';
import plusFill from '@iconify/icons-eva/plus-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
import starFill from '@iconify/icons-eva/star-fill';
import checkmarkCircleFill from '@iconify/icons-eva/checkmark-circle-fill';
import { useSnackbar } from 'notistack';
import { capitalCase } from 'change-case';
import { Icon } from '@iconify/react';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ListToolbar from '../../components/common/ListToolbar';
import SearchNotFound from '../../components/common/SearchNotFound';
import MoreMenu from '../../components/common/MoreMenu';
import useQuery from '../../utils/RouteQuery';
import axios from '../../utils/axios';
import ListSkeleton from '../../components/skeleton/ListSkeleton';
import Avatar from '../../components/common/Avatar';
import Label from '../../components/common/Label';
import AttendanceForm from '../../components/pages/attendance/AttendanceForm';
import TextMaxLine from '../../components/common/TextMaxLine';
import { fTime } from '../../utils/formatTime';
import Iconify from '../../components/common/Iconify';

const sortList = [
  {
    name: 'Created (oldest first)',
    value: 'created_at',
  },
  {
    name: 'Created (newest first)',
    value: '-created_at',
  },
  {
    name: 'Updated (oldest first)',
    value: 'updated_at',
  },
  {
    name: 'Updated (newest first)',
    value: '-updated_at',
  },
  {
    name: 'Customer A–Z',
    value: 'customer__name',
  },
  {
    name: 'Customer Z–A',
    value: '-customer__name',
  },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Employee', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'check_in', label: 'Check In', alignRight: false },
  { id: 'check_out', label: 'Check Out', alignRight: false },
  { id: 'worked_hours', label: 'Worked Hours', alignRight: false },
  { id: 'remark', label: 'Remark', alignRight: false },
  { id: '' },
];

const statusTypes = [
  {
    label: 'All',
    value: '',
    color: 'primary',
  },
  {
    label: 'Present',
    value: 'Present',
    color: 'success',
  },
  {
    label: 'Absent',
    value: 'Absent',
    color: 'error',
  },
  {
    label: 'Leave',
    value: 'Leave',
    color: 'warning',
  },
  {
    label: 'Half-Day',
    value: 'Half-Day',
    color: 'warning',
  },
  {
    label: 'Off-Day',
    value: 'Off-Day',
    color: 'info',
  },
  {
    label: 'Late',
    value: 'Late',
    color: 'warning',
  },
];

const AttendanceList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 10;
  const orderByParam = query.get('order_by') || '-created_at';
  const fromDateParam = query.get('from_date') || '';
  const toDateParam = query.get('to_date') || '';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    dates: [fromDateParam, toDateParam],
    page: 0,
  });
  const [selected, setSelected] = useState([]);
  const [editingData, setEditingData] = useState({});

  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(1);

  const [updatingData, setUpdatingData] = useState(false);
  const [attendances, setAttendances] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isProductNotFound = attendances.results.length === 0;

  // effects
  useEffect(() => {
    getAttendances();
    return () => {};
  }, [query]);

  useEffect(() => {
    reload();
    return () => {};
  }, [filters]);

  const reload = () => {
    var params = '';

    if (filters.dates[0] && filters.dates[1]) {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&order_by=${filters.order_by}`;
    } else {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&from_date=&to_date=&order_by=${filters.order_by}`;
    }

    navigate(PATH_DASHBOARD.attendance.list + params);
  };

  const getAttendances = () => {
    var fromDate = '';
    var toDate = '';
    if (filters.dates[0] && filters.dates[1]) {
      fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
      toDate = moment(filters.dates[1]).format('YYYY-MM-DD');
    } else {
      fromDate = '';
      toDate = '';
    }

    var url = `employee/attendance/list/?status=${filters.status}&page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setAttendances(data);
      setIsReady(true);
    });
  };

  const handleUpdateData = (data) => {
    setUpdatingData(true);
    axios
      .put('employee/attendance/', {
        data,
      })
      .then((res) => {
        setOpen(false);
        setEditingData({});
        setAttendances((preState) => {
          var newState = JSON.parse(JSON.stringify(preState));
          newState.results[editingIndex] = res.data;
          return { ...newState };
        });
        setUpdatingData(false);
        enqueueSnackbar(' success', {
          variant: 'success',
        });
      })
      .catch(() => {
        setUpdatingData(false);
        setEditingData({});
      });
  };

  return (
    <Page title={'Employee List Page'} roleBased role={{ name: 'Attendance', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Attendance List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Attendance',
                href: PATH_DASHBOARD.attendance.list,
              },
              { name: 'List' },
            ]}
          />

          {isReady ? (
            <Card>
              <ListToolbar
                filterName={filters.query}
                onFilterName={(value) => {
                  setFilters((preState) => {
                    return { ...preState, query: value, page: 0 };
                  });
                }}
                input={
                  <Stack spacing={2.5} direction={'row'}>
                    <DatePicker
                      sx={{ width: '180px' }}
                      slotProps={{ field: { clearable: true } }}
                      format={'DD-MM-YYYY'}
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                      value={filters.dates[0] ? moment(filters.dates[0]) : null}
                      label="From Date"
                      onChange={(newValue) => {
                        if (newValue === null) {
                          setFilters((preState) => {
                            return { ...preState, dates: ['', ''], page: 0 };
                          });
                        } else {
                          setFilters((preState) => {
                            return { ...preState, dates: [newValue, preState.dates[1]], page: 0 };
                          });
                        }
                      }}
                    />
                    <DatePicker
                      sx={{ width: '180px' }}
                      slotProps={{ field: { clearable: true } }}
                      format={'DD-MM-YYYY'}
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                      label="To Date"
                      value={filters.dates[1] ? moment(filters.dates[1]) : null}
                      onChange={(newValue) => {
                        if (newValue === null) {
                          setFilters((preState) => {
                            return { ...preState, dates: ['', ''], page: 0 };
                          });
                        } else {
                          setFilters((preState) => {
                            return { ...preState, dates: [preState.dates[0], newValue], page: 0 };
                          });
                        }
                      }}
                    />
                  </Stack>
                }
              />
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
                            {headCell.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    {isProductNotFound ? (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={11}>
                            <Box sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filters.query} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      <TableBody>
                        {attendances.results.map((row, index) => {
                          return (
                            <TableRow hover tabIndex={-1} key={`${row.id}`}>
                              <TableCell sx={{ minWidth: 220 }} align="left">
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={row.employee.photo}
                                    user={{
                                      first_name: row.employee.name,
                                    }}
                                  />
                                  <Stack sx={{ ml: 1 }}>
                                    <Typography variant="subtitle3" line={1}>
                                      {row.employee.name || '-'}
                                    </Typography>
                                    <TextMaxLine variant="caption" color={'text.secondary'} line={1}>
                                      {row.employee.position?.name || '-'}
                                    </TextMaxLine>
                                  </Stack>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {statusTypes.filter((data) => data.value === row.status)[0] ? (
                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={statusTypes.filter((data) => data.value === row.status)[0].color}
                                  >
                                    {statusTypes.filter((data) => data.value === row.status)[0].label}
                                  </Label>
                                ) : (
                                  '-'
                                )}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {moment(row.date, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.check_in_time ? fTime(row.check_in_time) : '-'}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.check_out_time ? fTime(row.check_out_time) : '-'}
                              </TableCell>
                              <TableCell sx={{ minWidth: 150 }} align="left">
                                {row.worked_hours} Hours
                              </TableCell>
                              <TableCell align="left" sx={{ minWidth: 200 }}>
                                <TextMaxLine line={1} variant="body2">
                                  {row.remarks || '-'}
                                </TextMaxLine>
                              </TableCell>

                              <TableCell align="center">
                                <IconButton
                                  aria-label="edit-attendance"
                                  onClick={() => {
                                    setEditingData(row);
                                    setEditingIndex(index);

                                    setOpen(!open);
                                  }}
                                >
                                  <Iconify icon={'solar:pen-new-round-bold-duotone'} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Box>

              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 30]}
                component="div"
                count={attendances.total_pages * parseInt(filters.pageSize, 10)}
                rowsPerPage={parseInt(filters.pageSize, 10)}
                page={filters.page}
                onPageChange={(event, value) => {
                  setFilters((preState) => {
                    return { ...preState, page: value };
                  });
                }}
                onRowsPerPageChange={(event) => {
                  setFilters((preState) => {
                    return {
                      ...preState,
                      pageSize: parseInt(event.target.value, 10),
                      page: 0,
                    };
                  });
                }}
              />
            </Card>
          ) : (
            <ListSkeleton />
          )}

          <AttendanceForm
            loading={updatingData}
            data={editingData}
            open={open}
            onClose={() => {
              setOpen(false);
              setEditingData({});
            }}
            onUpdate={(data) => handleUpdateData(data)}
          />
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(AttendanceList);
