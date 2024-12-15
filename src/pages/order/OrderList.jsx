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
import { connect, useSelector } from 'react-redux';
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

const status = [
  {
    name: 'All',
    value: '',
  },
  {
    name: 'Active',
    value: 'Active',
  },
  {
    name: 'Completed',
    value: 'Completed',
  },
  {
    name: 'Cancelled',
    value: 'Cancelled',
  },
  {
    name: 'Unfulfilled',
    value: 'Unfulfilled',
  },
  {
    name: 'Unpaid',
    value: 'Unpaid',
  },
  {
    name: 'Archived',
    value: 'Archived',
  },
];

const pendingStatusData = [
  {
    name: 'All',
    value: '',
    color: '',
  },
  {
    name: 'Adding Payment',
    value: 'Pending the addition of the payment.',
    color: 'error',
  },
  {
    name: 'Verifying Payment',
    value: 'Pending verification of whether the payment has been received.',
    color: 'error',
  },
  {
    name: 'Checking and Packaging Products',
    value: 'Pending the inspection of products and preparation for delivery.',
    color: 'error',
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
  { id: 'id', label: 'Order', alignRight: false },
  { id: 'ordered_date', label: 'Date', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'note', label: 'Note', alignRight: false },
  { id: 'customer', label: 'Customer', alignRight: false },

  { id: 'seller', label: 'Seller', alignRight: false },

  { id: 'total_price', label: 'Total', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];
// const ACTIONS = [
//   {
//     label: 'Archive orders',
//     value: 'Archived',
//     icon: <Iconify icon={'solar:archive-bold-duotone'} />,
//     color: 'warning',
//   },
//   {
//     label: 'Set as Active',
//     value: 'Active',
//     icon: <Iconify icon={'solar:star-bold'} />,
//     color: 'success',
//   },
//   {
//     label: 'Set as Completed',
//     value: 'Completed',
//     icon: <Iconify icon={'solar:check-circle-bold'} />,
//     color: 'info',
//   },
//   {
//     label: 'Set as Canceled',
//     value: 'Canceled',
//     icon: <Iconify icon={'solar:bag-cross-bold'} />,
//     color: 'error',
//   },
// ];

const pageOptions = Array.from({ length: 20 }, (_, index) => index * 10);
const OrderList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 10;
  const fromDateParam = query.get('from_date') || '';
  const toDateParam = query.get('to_date') || '';
  const orderByParam = query.get('order_by') || '-created_at';
  const pendingStatusParam = query.get('pending_status') || '';
  const pageParam = query.get('page') || 0;

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    dates: [fromDateParam, toDateParam],
    pendingStatus: pendingStatusParam,
    page: pageParam,
  });
  const [pendingData, setPendingData] = useState(pendingStatusData);
  const [selected, setSelected] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // const [openFilter, setOpenFilter] = useState(false);
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
    getOrders();
    getBadges();
    return () => {};
  }, [query]);

  useEffect(() => {
    var params = '';

    if (filters.dates[0] && filters.dates[1]) {
      params = `?pending_status=${filters.pendingStatus}&status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&page=${filters.page}&order_by=${filters.order_by}`;
    } else {
      params = `?pending_status=${filters.pendingStatus}&status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=&to_date=&page=${filters.page}&order_by=${filters.order_by}`;
    }
    navigate(PATH_DASHBOARD.order.list + params);
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
      .put('sales-status/', {
        status,
        ids: data,
        text: `has changed Order Status to "${status}" at`,
      })
      .then(() => {
        getOrders();
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

  const getBadges = () => {
    var url = `sale/badge/`;
    axios.get(url).then(({ data }) => {
      var data1 = [];
      pendingStatusData.forEach((val1) => {
        var data2 = {};
        const filteredData = data.filter((val2) => val2.pending_task === val1.value);
        if (filteredData.length > 0) {
          data2 = { ...val1, ...filteredData[0] };
        } else {
          data2 = val1;
        }
        data1.push(data2);
      });

      setPendingData(data1);
    });
  };

  const getOrders = () => {
    var fromDate = '';
    var toDate = '';
    if (filters.dates[0] && filters.dates[1]) {
      fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
      toDate = moment(filters.dates[1]).format('YYYY-MM-DD');
    } else {
      fromDate = '';
      toDate = '';
    }

    var url = `sales/?pending_status=${filters.pendingStatus}&page=${parseInt(filters.page, 10) + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&status=${filters.status}&delivery=&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setOrders(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Order List Page'} roleBased role={{ name: 'Order', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="Order List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Orders',
                href: PATH_DASHBOARD.order.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mynaui:plus-solid" />}
                color={'text'}
                component={RouterLink}
                to={PATH_DASHBOARD.order.create}
              >
                New order
              </Button>
            }
          />

          {isReady ? (
            <Card>
              <Stack
                sx={{ borderBottom: 1, pt: 2.5, px: 2.5, borderColor: 'divider' }}
                direction={'row'}
                justifyContent={'space-between'}
              >
                <Tabs
                  value={filters.pendingStatus}
                  scrollButtons="auto"
                  variant="scrollable"
                  allowScrollButtonsMobile
                  onChange={(event, value) => {
                    setFilters((preState) => {
                      return { ...preState, pendingStatus: value, page: 0 };
                    });
                  }}
                  aria-label="tab actions"
                >
                  {pendingData.map((item, index) => {
                    return (
                      <Tab
                        disableRipple
                        key={index}
                        label={
                          <Stack direction={'row'}>
                            <Typography sx={{ mr: '5px' }} variant="subtitle3">
                              {item.value === '' ? 'All' : item.name}
                            </Typography>
                            {item.count && item.color && (
                              <Label
                                color={item.color}
                                sx={{
                                  borderRadius: '100%',
                                }}
                                variant="filled"
                              >
                                {item.count}
                              </Label>
                            )}
                          </Stack>
                        }
                        value={item.value}
                      />
                    );
                  })}
                </Tabs>
              </Stack>

              <ListToolbar
                input={
                  <Stack spacing={2.5} direction={'row'} alignItems={'center'}>
                    <FormControl sx={{ width: '180px' }}>
                      <InputLabel id="status-filter">Status</InputLabel>
                      <Select
                        labelId="status-filter"
                        sx={{ width: '180px' }}
                        id="status-filter-sel"
                        value={filters.status}
                        label="Status"
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, status: event.target.value, page: 0 };
                          });
                        }}
                      >
                        {status.map((val) => (
                          <MenuItem key={val.value} value={val.value}>
                            {val.name}
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
                        {orders.results.map((row, index) => {
                          return (
                            <TableRow hover key={`${row.id}`}>
                              <TableCell
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(PATH_DASHBOARD.order.edit(row.id))}
                                align="left"
                              >
                                <Typography variant="subtitle3">#{row.id}</Typography>
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fDate(row.created_at || '')}
                              </TableCell>
                              <TableCell align="left">
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={row.type === 'In-store Sale' ? 'success' : 'warning'}
                                >
                                  {row.type}
                                </Label>
                              </TableCell>
                              <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                                <TextMaxLine line={1} variant="body2">
                                  {row.note || '-'}
                                </TextMaxLine>
                              </TableCell>

                              <TableCell align="left" sx={{ maxWidth: 180, minWidth: 100 }}>
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar
                                    sx={{ width: 25, height: 25, mr: '5px' }}
                                    user={{
                                      first_name: row.customer?.name,
                                    }}
                                  />
                                  <TextMaxLine variant="body2" line={1}>
                                    {row.customer?.name || '-'}
                                  </TextMaxLine>
                                </Stack>
                              </TableCell>
                              <TableCell align="left" sx={{ minWidth: 120 }}>
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar
                                    sx={{ width: 25, height: 25, mr: '5px' }}
                                    user={{
                                      first_name: row.exported_by,
                                    }}
                                  />
                                  <Typography variant="body2">{row.exported_by || '-'}</Typography>
                                </Stack>
                              </TableCell>

                              <TableCell align="left">{fCurrency(row.total)}</TableCell>
                              <TableCell align="left">
                                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={
                                      (row.payment_status === 'Unpaid' && 'error') ||
                                      (row.payment_status === 'Partially Paid' && 'warning') ||
                                      'success'
                                    }
                                  >
                                    {sentenceCase(row.payment_status)}
                                  </Label>

                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={'primary'}
                                  >
                                    {row.status}
                                  </Label>

                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={(!row.is_fulfilled && 'warning') || 'success'}
                                  >
                                    {row.is_fulfilled ? 'Fulfilled' : 'Not Fulfilled'}
                                  </Label>
                                </Stack>
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
                                          navigate(PATH_DASHBOARD.order.edit(row.id));
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
                rowsPerPageOptions={pageOptions}
                component="div"
                count={orders.total_pages * parseInt(filters.pageSize, 10)}
                rowsPerPage={parseInt(filters.pageSize, 10)}
                page={parseInt(filters.page, 10)}
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
export default connect(mapStateToProps)(OrderList);
