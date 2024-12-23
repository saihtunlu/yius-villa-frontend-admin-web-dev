import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid2 as Grid,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableHead,
  useTheme,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ListToolbar from '../../components/common/ListToolbar';
import SearchNotFound from '../../components/common/SearchNotFound';
import useQuery from '../../utils/RouteQuery';
import axios from '../../utils/axios';
import ListSkeleton from '../../components/skeleton/ListSkeleton';
import Avatar from '../../components/common/Avatar';
import TextMaxLine from '../../components/common/TextMaxLine';
import Iconify from '../../components/common/Iconify';
import AttIcon from '../../components/pages/attendance/AttIcon';

const statusTypes = [
  {
    value: 'Present',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:user-check-rounded-bold-duotone'}
        color={'rgb(84, 214, 44)'}
        bgColor={'rgba(84, 214, 44,0.2)'}
      />
    ),
  },
  {
    value: 'Half-Day',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:clock-circle-bold-duotone'}
        color={'rgb(255, 193, 7)'}
        bgColor={'rgba(255, 193, 7,0.2)'}
      />
    ),
  },
  {
    value: 'Absent',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:user-cross-rounded-bold-duotone'}
        color={'rgb(255, 72, 66)'}
        bgColor={'rgba(255, 72, 66,0.2)'}
      />
    ),
  },
  {
    value: 'Leave',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:user-minus-rounded-bold-duotone'}
        color={'rgb(255, 72, 66)'}
        bgColor={'rgba(255, 72, 66,0.2)'}
      />
    ),
  },
  {
    value: 'Off-Day',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:shield-user-bold-duotone'}
        color={'rgb(24, 144, 255)'}
        bgColor={'rgb(24, 144, 255,0.2)'}
      />
    ),
  },
  {
    value: 'Late',
    icon: (data, user) => (
      <AttIcon
        data={data}
        user={user}
        icon={'solar:shield-user-bold-duotone'}
        color={'rgb(253, 169, 45)'}
        bgColor={'rgb(253, 169, 45,0.2)'}
      />
    ),
  },
];

const currentDate = moment();
const firstDate = currentDate.startOf('month').format('YYYY-MM-DD');
const lastDate = currentDate.endOf('month').format('YYYY-MM-DD');

const AttendanceSheet = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 10;
  const fromDateParam = query.get('from_date') || firstDate;
  const toDateParam = query.get('to_date') || lastDate;

  const [filters, setFilters] = useState({
    query: queryParam,
    pageSize: pageSizeParam,
    dates: [fromDateParam, toDateParam],
    page: 0,
  });
  const [selected, setSelected] = useState([]);
  const [tableHead, setTableHead] = useState([{ id: 'id', label: 'Employee', date: '', alignLeft: true }]);

  const [editingData, setEditingData] = useState({});

  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingIndex, setEditingIndex] = useState(1);

  const [updatingData, setUpdatingData] = useState(false);
  const [attendances, setAttendances] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isSelected = (id) => selected.indexOf(id) !== -1;
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

    params = `?query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}`;

    navigate(PATH_DASHBOARD.attendance.sheet + params);
  };

  const generateWithDateRange = (startDate, endDate) => {
    const dateRange = [];
    // Loop over the date range to generate the date headers
    while (startDate <= endDate) {
      const formattedDate = startDate.format('YYYY-MM-DD'); // Format date as 'YYYY-MM-DD'
      const dayOfMonth = startDate.format('D'); // Get day of the month (1, 2, 3, etc.)
      const dayOfWeek = startDate.format('ddd');
      // Push the header object into the array
      dateRange.push({
        id: formattedDate,
        date: dayOfWeek,
        label: dayOfMonth, // Use the day of the month as the label
      });

      // Move to the next day
      startDate.add(1, 'days');
    }

    return dateRange;
  };

  const getAttendances = () => {
    var fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
    var toDate = moment(filters.dates[1]).format('YYYY-MM-DD');

    var url = `employee/attendance/report/?page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&from_date=${fromDate}&to_date=${toDate}`;
    axios.get(url).then(({ data }) => {
      setTableHead([
        { id: 'id', label: 'Employee', alignRight: false },
        ...generateWithDateRange(moment(filters.dates[0]), moment(filters.dates[1])),
      ]);
      setAttendances(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Attendance Sheet Page'} roleBased role={{ name: 'Attendance', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Attendance Sheet"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Attendance',
                href: PATH_DASHBOARD.attendance.list,
              },
              { name: 'Sheet' },
            ]}
          />

          {isReady ? (
            <Card>
              <ListToolbar
                input={
                  <Stack spacing={2.5} direction={'row'}>
                    <DatePicker
                      sx={{ width: '180px' }}
                      format={'DD-MM-YYYY'}
                      value={filters.dates[0] ? moment(filters.dates[0]) : null}
                      label="From Date"
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
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
                      format={'DD-MM-YYYY'}
                      label="To Date"
                      value={filters.dates[1] ? moment(filters.dates[1]) : null}
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
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
                filterName={filters.query}
                onFilterName={(value) => {
                  setFilters((preState) => {
                    return { ...preState, query: value, page: 0 };
                  });
                }}
              />
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {tableHead.map((headCell) => (
                          <TableCell key={headCell.id} align={headCell.date ? 'center' : 'left'}>
                            {headCell.label} <br />
                            <Typography variant="caption" sx={{ fontWeight: '600' }}>
                              {headCell.date}
                            </Typography>
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
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow hover aria-checked={isItemSelected} key={`${row.id}+${index}`}>
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
                                      {row.employee.position__name || '-'}
                                    </TextMaxLine>
                                  </Stack>
                                </Stack>
                              </TableCell>

                              {row.attendances.map((attendance, index) => {
                                return (
                                  <TableCell key={index + 'attendance' + row.employee.name}>
                                    {statusTypes.filter((data) => data.value === attendance.status)[0] ? (
                                      statusTypes
                                        .filter((data) => data.value === attendance.status)[0]
                                        .icon(attendance, row.employee)
                                    ) : (
                                      <AttIcon data={attendance} user={row.employee} icon={'humbleicons:exclamation'} />
                                    )}

                                    {/* <Typography>
                                      {attendance.status} + {attendance.date}
                                    </Typography> */}
                                  </TableCell>
                                );
                              })}
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
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(AttendanceSheet);
