import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid2 as Grid,
  Button,
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
import AdjustmentForm from '../../components/pages/payroll/AdjustmentForm';
import Iconify from '../../components/common/Iconify';
// import Iconify from '../../components/common/Iconify';

const types = [
  {
    label: 'All',
    value: '',
    icon: <Icon icon={starFill} />,
    color: 'primary',
  },
  {
    label: 'Allowance',
    value: 'Allowance',
    icon: <Icon icon={starFill} />,
    color: 'success',
  },
  {
    label: 'Deduction',
    value: 'Deduction',
    icon: <Icon icon={starFill} />,
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
  { id: 'employee', label: 'Employee', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: '' },
];

const initialData = {
  employee: {
    name: '',
  },
  description: '',
  amount: 0,
  type: 'Deduction',
  date: null,
};
const Adjustment = () => {
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
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState(initialData);
  const [editingIndex, setEditingIndex] = useState(1);
  const [editingType, setEditingType] = useState('Edit');
  const [loading, setLoading] = useState(false);

  const [isReady, setIsReady] = useState(false);

  const [adjustments, setAdjustments] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isProductNotFound = adjustments.results.length === 0;

  // effects
  useEffect(() => {
    getPayrolls();
    return () => {};
  }, [query]);

  useEffect(() => {
    var params = '';
    if (filters.dates[0] && filters.dates[1]) {
      params = `?query=${filters.query}&page_size=${filters.pageSize}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&page=${filters.page}&order_by=${filters.order_by}`;
    } else {
      params = `?query=${filters.query}&page_size=${filters.pageSize}&from_date=&to_date=&page=${filters.page}&order_by=${filters.order_by}`;
    }
    navigate(PATH_DASHBOARD.payroll.adjustment + params);
    return () => {};
  }, [filters]);

  // handlers

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

    var url = `employee/payroll/adjustments/list/?page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setAdjustments(data);
      setIsReady(true);
    });
  };

  const handleUpdateData = (data) => {
    setLoading(true);
    const isEdit = editingType === 'Edit';
    const axiosFetch = isEdit ? axios.put : axios.post;

    axiosFetch('employee/payroll/adjustment/', {
      data,
    })
      .then((res) => {
        setOpen(false);
        setEditingData(initialData);
        setAdjustments((preState) => {
          var newState = JSON.parse(JSON.stringify(preState));
          if (isEdit) {
            newState.results[editingIndex] = res.data;
          } else {
            newState.results = [res.data, ...newState.results];
          }
          return { ...newState };
        });
        setLoading(false);
        enqueueSnackbar(' success', {
          variant: 'success',
        });
      })
      .catch(() => {
        setLoading(false);
        setEditingData(initialData);
      });
  };

  const handleDelete = (id) => {
    const url = 'employee/payroll/adjustment/?id=' + id;
    axios
      .delete(url)
      .then(() => {
        enqueueSnackbar('Delete success', {
          variant: 'success',
        });
        getPayrolls();
      })
      .catch(() => {});
  };

  return (
    <Page title={'Payroll Adjustment Page'} roleBased role={{ name: 'Payroll', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Payroll Adjustment"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Payroll',
                href: PATH_DASHBOARD.payroll.list,
              },
              { name: 'Adjustment' },
            ]}
            action={
              <Button
                variant="contained"
                color={'text'}
                component={RouterLink}
                onClick={() => {
                  setEditingType('Create');
                  setEditingData(initialData);
                  setOpen(!open);
                }}
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
                    <DatePicker
                      sx={{ width: '180px' }}
                      slotProps={{ field: { clearable: true } }}
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
                      slotProps={{ field: { clearable: true } }}
                      format={'DD-MM-YYYY'}
                      label="To Date"
                      slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
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
                        {adjustments.results.map((row, index) => {
                          return (
                            <TableRow hover key={`${row.id}`}>
                              <TableCell
                                sx={{ cursor: 'pointer', minWidth: 220 }}
                                onClick={() => {
                                  setEditingType('Edit');
                                  setEditingData(row);
                                  setEditingIndex(index);
                                  setOpen(!open);
                                }}
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
                                {moment(row.date, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.description}
                              </TableCell>
                              <TableCell align="left">
                                {types.filter((data) => data.value === row.type)[0] ? (
                                  <Label
                                    startIcon={types.filter((data) => data.value === row.type)[0].icon}
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={types.filter((data) => data.value === row.type)[0].color}
                                  >
                                    {types.filter((data) => data.value === row.type)[0].label}
                                  </Label>
                                ) : (
                                  '-'
                                )}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fCurrency(row.amount)}
                              </TableCell>

                              <TableCell align="center">
                                <MoreMenu
                                  actions={[
                                    {
                                      icon: <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />,
                                      text: 'Delete',
                                      props: {
                                        onClick: () => {
                                          handleDelete(row.id);
                                        },
                                        sx: { color: 'text.secondary' },
                                      },
                                    },
                                    {
                                      icon: <Iconify icon={'solar:pen-new-round-bold-duotone'} />,
                                      text: 'Edit',
                                      props: {
                                        onClick: () => {
                                          setEditingType('Edit');
                                          setEditingData(row);
                                          setEditingIndex(index);
                                          setOpen(!open);
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
                count={adjustments.total_pages * parseInt(filters.pageSize, 10)}
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

          <AdjustmentForm
            loading={loading}
            data={editingData}
            type={editingType}
            open={open}
            onClose={() => {
              setOpen(false);
              setEditingData(initialData);
            }}
            onUpdate={(val) => handleUpdateData(val)}
          />
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(Adjustment);
