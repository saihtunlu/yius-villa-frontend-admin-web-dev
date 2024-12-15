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
  CardHeader,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { Link as RouterLink, createSearchParams, useNavigate, useNavigation } from 'react-router-dom';
import { connect } from 'react-redux';
import plusFill from '@iconify/icons-eva/plus-fill';
import archiveFill from '@iconify/icons-eva/archive-fill';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import starFill from '@iconify/icons-eva/star-fill';
import checkmarkCircleFill from '@iconify/icons-eva/checkmark-circle-fill';
import { useSnackbar } from 'notistack';
import { capitalCase, sentenceCase } from 'change-case';
import moment from 'moment';
import { DatePicker } from '@mui/x-date-pickers';
import { Icon } from '@iconify/react';
// import { AnimatePresence, m } from 'framer-motion';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ListToolbar from '../../components/common/ListToolbar';
import SearchNotFound from '../../components/common/SearchNotFound';
// import TabActions from '../../components/common/TabActions';
import MoreMenu from '../../components/common/MoreMenu';
import Label from '../../components/common/Label';
import { fCurrency } from '../../utils/formatNumber';
import { fDate } from '../../utils/formatTime';
import useQuery from '../../utils/RouteQuery';
import axios from '../../utils/axios';
import ListSkeleton from '../../components/skeleton/ListSkeleton';
import Avatar from '../../components/common/Avatar';
import TextMaxLine from '../../components/common/TextMaxLine';
import Iconify from '../../components/common/Iconify';
// import Iconify from '../../components/common/Iconify';

const statusType = [
  {
    label: 'All',
    value: '',
    color: 'primary',
  },
  {
    label: 'Pending',
    value: 'Pending',
    color: 'warning',
  },
  {
    label: 'Paid',
    value: 'Paid',
    color: 'success',
  },
  {
    label: 'Reject',
    value: 'Reject',
    color: 'error',
  },
  {
    label: 'Draft',
    value: 'Draft',
    color: 'info',
  },
  {
    label: 'Archived',
    value: 'Archived',
    color: 'secondary',
  },
];

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
];

const TABLE_HEAD = [
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'pay_period_start', label: 'Pay Period Start', alignRight: false },
  { id: 'ordered_date', label: 'Pay Period End', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
  { id: 'note', label: 'Note', alignRight: false },
  { id: 'created_at', label: 'Created Date', alignRight: false },
  { id: '' },
];
const ACTIONS = [
  {
    label: 'Set as Reject',
    value: 'Reject',
    icon: <Iconify icon={'solar:bill-cross-bold'} />,
    color: 'error',
  },
  {
    label: 'Set as Archived',
    value: 'Archived',
    icon: <Iconify icon={'solar:archive-bold-duotone'} />,
    color: 'error',
  },
  {
    label: 'Set as Draft',
    value: 'Draft',
    icon: <Iconify icon={'solar:pen-new-round-bold-duotone'} />,
    color: 'info',
  },
  {
    label: 'Set as Paid',
    value: 'Paid',
    icon: <Iconify icon={'solar:check-circle-bold'} />,
    color: 'success',
  },
  {
    label: 'Set as Pending',
    value: 'Pending',
    icon: <Iconify icon={'solar:clock-circle-bold'} />,
    color: 'warning',
  },
];
const PayrollList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 5;
  const fromDateParam = query.get('from_date') || '';
  const toDateParam = query.get('to_date') || '';
  const orderByParam = query.get('order_by') || '-created_at';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    dates: [fromDateParam, toDateParam],
    page: 0,
  });
  const [selected, setSelected] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [orders, setOrders] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isProductNotFound = orders.results.length === 0;

  // effects
  useEffect(() => {
    getPayrolls();
    return () => {};
  }, [query]);

  useEffect(() => {
    var params = '';
    if (filters.dates[0] && filters.dates[1]) {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&page=${filters.page}&order_by=${filters.order_by}`;
    } else {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=&to_date=&page=${filters.page}&order_by=${filters.order_by}`;
    }
    navigate(PATH_DASHBOARD.payroll.list + params);
    return () => {};
  }, [filters]);

  // handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = orders.results.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    var newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };
  const handleUpdateStatus = (status, id) => {
    setUpdatingStatus(true);

    var data = [];
    if (id) {
      data = [id];
    } else {
      selected.forEach((id) => {
        data.push(id);
      });
    }

    axios
      .put('employee/payroll/status/', {
        status,
        ids: data,
      })
      .then(() => {
        getPayrolls();
        setUpdatingStatus(false);
        enqueueSnackbar(capitalCase(status) + ' success', {
          variant: 'success',
        });
        setSelected([]);
      })
      .catch(() => {
        setUpdatingStatus(false);
      });
  };

  // actions

  const getPayrolls = () => {
    var fromDate = '';
    var toDate = '';
    if (filters.dates[0] && filters.dates[1]) {
      fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
      toDate = moment(filters.dates[1]).format('YYYY-MM-DD');
    } else {
      fromDate = '';
      toDate = '';
    }

    var url = `employee/payroll/list/?page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&status=${filters.status}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setOrders(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Payroll List Page'} roleBased role={{ name: 'Payroll', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="Payroll List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Payroll',
                href: PATH_DASHBOARD.payroll.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                color={'text'}
                component={RouterLink}
                to={PATH_DASHBOARD.payroll.create}
                startIcon={<Iconify icon="mynaui:plus-solid" />}
              >
                New Payroll
              </Button>
            }
          />

          {isReady ? (
            <Card>
              <ListToolbar
                input={
                  <Stack spacing={2.5} direction={'row'}>
                    <FormControl sx={{ width: '180px' }}>
                      <InputLabel id="status-filter">Status</InputLabel>
                      <Select
                        labelId="status-filter"
                        id="status-filter-sel"
                        value={filters.status}
                        label="Status"
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, status: event.target.value, page: 0 };
                          });
                        }}
                      >
                        {statusType.map((val) => (
                          <MenuItem value={val.value} key={val.value}>
                            {val.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                      slotProps={{ field: { clearable: true } }}
                      format={'DD-MM-YYYY'}
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
                numSelected={selected.length}
                filterName={filters.query}
                sortList={sortList}
                selectedSorting={filters.order_by}
                onSelectSorting={(value) => {
                  setFilters((preState) => {
                    return { ...preState, order_by: value, page: 0 };
                  });
                }}
                onFilterName={(value) => {
                  setFilters((preState) => {
                    return { ...preState, query: value, page: 0 };
                  });
                }}
                actions={ACTIONS.map((action, index) => (
                  <Tooltip title={action.label}>
                    <IconButton disabled={updatingStatus} onClick={() => handleUpdateStatus(action.value)}>
                      {action.icon}
                    </IconButton>
                  </Tooltip>
                ))}
              />
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < orders.results.length}
                            checked={orders.results.length > 0 && selected.length === orders.results.length}
                            onChange={handleSelectAllClick}
                            inputProps={{
                              'aria-label': 'select all desserts',
                            }}
                          />
                        </TableCell>
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
                        {orders.results.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={`${row.id}`}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox checked={isItemSelected} onClick={() => handleSelect(row.id)} />
                              </TableCell>

                              <TableCell
                                sx={{ cursor: 'pointer', minWidth: 220 }}
                                onClick={() => navigate(PATH_DASHBOARD.payroll.edit(row.id))}
                                align="left"
                              >
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
                                {moment(row.pay_period_start, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {moment(row.pay_period_end, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>
                              <TableCell align="left">
                                {statusType.filter((data) => data.value === row.status)[0] ? (
                                  <Label
                                    startIcon={statusType.filter((data) => data.value === row.status)[0].icon}
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={statusType.filter((data) => data.value === row.status)[0].color}
                                  >
                                    {statusType.filter((data) => data.value === row.status)[0].label}
                                  </Label>
                                ) : (
                                  '-'
                                )}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fCurrency(row.total)}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                <TextMaxLine line={1}>{row.note || '-'}</TextMaxLine>
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fDate(row.created_at)}
                              </TableCell>

                              <TableCell align="center">
                                <MoreMenu
                                  actions={[
                                    {
                                      icon: <Iconify icon={'solar:archive-bold-duotone'} />,
                                      text: 'Archive',
                                      props: {
                                        onClick: () => {
                                          handleUpdateStatus('Archived', row.id);
                                        },
                                        sx: { color: 'text.secondary' },
                                      },
                                    },
                                    {
                                      icon: <Iconify icon={'solar:pen-new-round-bold-duotone'} />,
                                      text: 'Edit',
                                      props: {
                                        onClick: () => {
                                          navigate(PATH_DASHBOARD.payroll.edit(row.id));
                                        },

                                        sx: { color: 'text.secondary' },
                                      },
                                    },
                                  ]}
                                />
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
                count={orders.total_pages * parseInt(filters.pageSize, 10)}
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
export default connect(mapStateToProps)(PayrollList);
