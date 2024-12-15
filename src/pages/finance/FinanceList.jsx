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
  IconButton,
  Stack,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import starFill from '@iconify/icons-eva/star-fill';
import checkmarkCircleFill from '@iconify/icons-eva/checkmark-circle-fill';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
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
import Label from '../../components/common/Label';
import FinanceForm from '../../components/pages/finance/FinanceForm';
import { fCurrency } from '../../utils/formatNumber';
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
];

const TABLE_HEAD = [
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'label', label: 'Label', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'note', label: 'Note', alignRight: false },
  { id: '' },
];

const statusTypes = [
  {
    label: 'All',
    value: '',
    icon: <Icon icon={starFill} />,
    color: 'primary',
  },
  {
    label: 'Income',
    value: 'Income',
    icon: <Icon icon={starFill} />,
    color: 'success',
  },
  {
    label: 'Expense',
    value: 'Expense',
    icon: <Icon icon={starFill} />,
    color: 'error',
  },
];

const ACTIONS = [
  {
    label: 'Set as Active',
    value: 'Active',
    icon: <Icon icon={starFill} />,
  },
  {
    label: 'Set as Banned',
    value: 'Completed',
    icon: <Icon icon={checkmarkCircleFill} />,
  },
];
const initialData = {
  note: '',
  label: {
    name: '',
  },
  date: new Date(),
  amount: 0,
  type: 'Expense',
};
const FinanceList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const typeParam = query.get('type') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 5;
  const orderByParam = query.get('order_by') || '-created_at';
  const fromDateParam = query.get('from_date') || '';
  const toDateParam = query.get('to_date') || '';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    type: typeParam,
    dates: [fromDateParam, toDateParam],
    page: 0,
  });
  const [selected, setSelected] = useState([]);
  const [editingData, setEditingData] = useState(initialData);
  const [editingIndex, setEditingIndex] = useState(1);
  const [editingType, setEditingType] = useState('Edit');
  const [loading, setLoading] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [finances, setFinances] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isProductNotFound = finances.results.length === 0;

  // effects
  useEffect(() => {
    getFinances();
    return () => {};
  }, [query]);

  useEffect(() => {
    reload();
    return () => {};
  }, [filters]);

  const reload = () => {
    var params = '';

    if (filters.dates[0] && filters.dates[1]) {
      params = `?type=${filters.type}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&from_date=${filters.dates[0]}&to_date=${filters.dates[1]}&order_by=${filters.order_by}`;
    } else {
      params = `?type=${filters.type}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&from_date=&to_date=&order_by=${filters.order_by}`;
    }

    navigate(PATH_DASHBOARD.finance + params);
  };

  const getFinances = () => {
    var fromDate = '';
    var toDate = '';
    if (filters.dates[0] && filters.dates[1]) {
      fromDate = moment(filters.dates[0]).format('YYYY-MM-DD');
      toDate = moment(filters.dates[1]).format('YYYY-MM-DD');
    } else {
      fromDate = '';
      toDate = '';
    }

    var url = `finance/list/?type=${filters.type}&page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&query=${filters.query}&from_date=${fromDate}&to_date=${toDate}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setFinances(data);
      setIsReady(true);
    });
  };

  const handleUpdateData = (data) => {
    setLoading(true);
    const isEdit = editingType === 'Edit';
    const axiosFetch = isEdit ? axios.put : axios.post;

    axiosFetch('finance/', {
      data,
    })
      .then((res) => {
        setOpen(false);
        setEditingData(initialData);
        setFinances((preState) => {
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

  return (
    <Page title={'Finance Page'} roleBased role={{ name: 'Finance', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="Finance"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Finance',
                href: PATH_DASHBOARD.attendance.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                color={'text'}
                onClick={() => {
                  setEditingType('Create');
                  setEditingData(initialData);
                  setOpen(!open);
                }}
                startIcon={<Iconify icon="mynaui:plus-solid" />}
              >
                New finance
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
                        {finances.results.map((row, index) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}`}>
                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {statusTypes.filter((data) => data.value === row.type)[0] ? (
                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={statusTypes.filter((data) => data.value === row.type)[0].color}
                                  >
                                    {statusTypes.filter((data) => data.value === row.type)[0].label}
                                  </Label>
                                ) : (
                                  '-'
                                )}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {moment(row.date, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {row.label?.name}
                              </TableCell>

                              <TableCell sx={{ minWidth: 120 }} align="left">
                                {fCurrency(row.amount)}
                              </TableCell>

                              <TableCell align="left" sx={{ minWidth: 200 }}>
                                {row.note || '-'}
                              </TableCell>

                              <TableCell align="center">
                                <IconButton
                                  aria-label="edit-attendance"
                                  onClick={() => {
                                    setEditingType('Edit');
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
                count={finances.total_pages * parseInt(filters.pageSize, 10)}
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

          <FinanceForm
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
export default connect(mapStateToProps)(FinanceList);
