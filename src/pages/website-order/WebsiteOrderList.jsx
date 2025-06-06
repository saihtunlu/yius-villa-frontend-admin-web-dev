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
import { useSnackbar } from 'notistack';
import { sentenceCase } from 'change-case';
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
import { handleGetWebsiteOrderBadges } from '../../redux/slices/badge';

// import Iconify from '../../components/common/Iconify';

const status = [
  {
    name: 'All',
    value: '',
  },
  {
    name: 'To Pay',
    value: 'To Pay',
  },
  {
    name: 'To Verify',
    value: 'To Verify',
  },
  {
    name: 'To Pack',
    value: 'To Pack',
  },
  {
    name: 'To Delivery',
    value: 'To Delivery',
  },
  {
    name: 'Delivery Picked Up',
    value: 'Delivery Picked Up',
  },
  {
    name: 'Cancelled',
    value: 'Cancelled',
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
    value: 'customer__first_name',
  },
  {
    name: 'Customer Z–A',
    value: '-customer__first_name',
  },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Order', alignRight: false },
  { id: 'ordered_date', label: 'Date', alignRight: false },
  { id: 'customer', label: 'Customer', alignRight: false },
  { id: 'Phone', label: 'Phone', alignRight: false },
  { id: 'Address', label: 'Address', alignRight: false },
  { id: 'total_price', label: 'Total', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'note', label: 'Note', alignRight: false },
];

const pageOptions = Array.from({ length: 10 }, (_, index) => (1 + index) * 15);
const WebsiteOrderList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state.auth?.user);
  const badge = useSelector((state) => state.badge.websiteOrderBadge);

  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || '';
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
    status: statusParam,
    dates: [fromDateParam, toDateParam],
    page: pageParam,
  });
  const [selected, setSelected] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [orders, setOrders] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isProductNotFound = orders.results.length === 0;

  // effects
  useEffect(() => {
    handleGetWebsiteOrderBadges();
    return () => {};
  }, [query]);

  useEffect(() => {
    getOrders();
    return () => {};
  }, [badge]);

  useEffect(() => {
    var params = '';

    if (filters.dates[0] && filters.dates[1]) {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&page=${filters.page}&order_by=${filters.order_by}`;
    } else {
      params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&from_date=&to_date=&page=${filters.page}&order_by=${filters.order_by}`;
    }
    navigate(PATH_DASHBOARD.websiteOrder.list + params);
    return () => {};
  }, [filters]);

  // actions

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

    var url = `order/list/?type=website-sale&page=${parseInt(filters.page, 10) + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&status=${filters.status}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setOrders(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Website Order List Page'} roleBased role={{ name: 'Order', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Website Order List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Website Orders',
                href: PATH_DASHBOARD.websiteOrder.list,
              },
              { name: 'List' },
            ]}
            action={
              <Stack spacing={2} direction={'row'}>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="material-symbols:list-rounded" />}
                  color={'text'}
                  component={RouterLink}
                  to={PATH_DASHBOARD.websiteOrder.itemList}
                >
                  Item List
                </Button>
              </Stack>
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
                  value={filters.status}
                  scrollButtons="auto"
                  variant="scrollable"
                  allowScrollButtonsMobile
                  onChange={(_, value) => {
                    setFilters((preState) => {
                      return { ...preState, status: value, page: 0 };
                    });
                  }}
                  aria-label="tab actions"
                >
                  {status.map((item, index) => {
                    const count = badge[item.value];

                    return (
                      <Tab
                        disableRipple
                        key={index}
                        label={
                          <Stack direction={'row'}>
                            <Typography sx={{ mr: '5px' }} variant="subtitle3">
                              {item.name}
                            </Typography>
                            {!!count && (
                              <Label
                                color={'error'}
                                sx={{
                                  borderRadius: '30px',
                                }}
                                variant="filled"
                              >
                                {count}
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
                            <TableRow
                              hover
                              key={`${row.id}`}
                              sx={{
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                navigate(PATH_DASHBOARD.websiteOrder.edit(row.id));
                              }}
                            >
                              <TableCell align="left">
                                <Typography variant="subtitle3">{row.sale_no}</Typography>
                              </TableCell>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fDate(row.created_at || '')}
                              </TableCell>

                              <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar sx={{ width: 25, height: 25 }} user={row.customer.user} />
                                  <TextMaxLine variant="body2" sx={{ ml: '5px' }} line={1}>
                                    {row.address?.receiver || '-'}
                                  </TextMaxLine>
                                </Stack>
                              </TableCell>
                              <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                                <Stack direction={'row'} alignItems={'center'}>
                                  <TextMaxLine variant="body2" sx={{ ml: '5px' }} line={1}>
                                    {row.address?.phone || '-'}
                                  </TextMaxLine>
                                </Stack>
                              </TableCell>
                              <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                                {row.address?.address || '-'}, {row.address?.city?.split('_').join(' ') || '-'},{' '}
                                {row.address?.state?.split('_').join(' ') || '-'}
                              </TableCell>
                              <TableCell align="left" sx={{ fontWeight: 600 }}>
                                {fCurrency(row.total)}
                                <br />
                                {user?.role?.name === 'Owner' && (
                                  <Typography color="success" component={'span'} variant="caption">
                                    {fCurrency(row.profit_amount)}
                                  </Typography>
                                )}
                              </TableCell>
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
                                    color={(row.status === 'Cancelled' && 'error') || 'success'}
                                  >
                                    {row.status}
                                  </Label>
                                </Stack>
                              </TableCell>

                              <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                                <TextMaxLine line={1} sx={{ ml: '5px' }} variant="body2">
                                  {row.note || '-'}
                                </TextMaxLine>
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
export default connect(mapStateToProps)(WebsiteOrderList);
