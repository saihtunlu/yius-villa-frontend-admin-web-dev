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
import Img from '../../components/common/Img';

// import Iconify from '../../components/common/Iconify';

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
    value: 'unfulfilled',
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
  { id: 'id', label: 'Item', alignRight: false },
  { id: 'ordered_date', label: 'Order ID', alignRight: false },

  { id: 'customer', label: 'Customer', alignRight: false },
  { id: 'quantity', label: 'Quantity', alignRight: false },

  { id: 'seller', label: 'Subtotal', alignRight: false },

  { id: 'total_price', label: 'Created Date ', alignRight: false },
];

const pageOptions = Array.from({ length: 10 }, (_, index) => (1 + index) * 15);
const OrderItemList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth?.user);

  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 15;
  const fromDateParam = query.get('from_date') || '';
  const toDateParam = query.get('to_date') || '';
  const orderByParam = query.get('order_by') || '-created_at';
  const pageParam = query.get('page') || 0;

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    dates: [fromDateParam, toDateParam],
    page: pageParam,
  });
  const [selected, setSelected] = useState([]);
  const [isReady, setIsReady] = useState(false);
  // const [openFilter, setOpenFilter] = useState(false);
  const [orders, setOrders] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isProductNotFound = orders.results.length === 0;

  // effects
  useEffect(() => {
    getOrders();
    return () => {};
  }, [query]);

  useEffect(() => {
    var params = '';

    if (filters.dates[0] && filters.dates[1]) {
      params = `?query=${filters.query}&page_size=${filters.pageSize}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&page=${filters.page}&order_by=${filters.order_by}`;
    } else {
      params = `?query=${filters.query}&page_size=${filters.pageSize}&from_date=&to_date=&page=${filters.page}&order_by=${filters.order_by}`;
    }
    navigate(PATH_DASHBOARD.websiteOrder.itemList + params);
    return () => {};
  }, [filters]);

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

    var url = `order/item/list/?page=${parseInt(filters.page, 10) + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setOrders(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Order Item List Page'} roleBased role={{ name: 'Order', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Order Item List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Orders',
                href: PATH_DASHBOARD.order.list,
              },
              { name: 'Item List' },
            ]}
          />

          {isReady ? (
            <Card>
              <ListToolbar
                input={
                  <Stack spacing={2.5} direction={'row'} alignItems={'center'}>
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
                              <TableCell sx={{ cursor: 'pointer' }} align="left">
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Img
                                    lightbox
                                    fullLink
                                    sx={{
                                      width: 55,
                                      height: 55,
                                      objectFit: 'cover',
                                      mr: 2,
                                      borderRadius: theme.shape.borderRadius + 'px',
                                    }}
                                    alt={row.name}
                                    src={row.image || '/assets/img/default.png'}
                                  />
                                  <Box>
                                    <Typography
                                      color="textPrimary"
                                      variant="subtitle3"
                                      sx={{ maxWidth: '160px', textDecoration: 'none' }}
                                      noWrap
                                    >
                                      {row.name}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                      {row.price}Ks
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.order}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.customer_name}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.quantity}
                              </TableCell>
                              <TableCell sx={{ minWidth: 120, color: theme.palette.primary.main }} align="left">
                                {row.subtotal}Ks
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fDate(row.created_at || '')}
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
export default connect(mapStateToProps)(OrderItemList);
