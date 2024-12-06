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
  Tooltip,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import moment from 'moment';

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

const statusTypes = [
  {
    label: 'All',
    value: '',
    color: 'primary',
  },
  {
    label: 'Active',
    value: 'Active',
    color: 'success',
  },
  {
    label: 'Resigned',
    value: 'Resigned',
    color: 'warning',
  },
  {
    label: 'Terminated',
    value: 'Terminated',
    color: 'error',
  },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Employee', alignRight: false },
  { id: 'em_id', label: 'Employee ID', alignRight: false },
  { id: 'Started_Date', label: 'Started Date', alignRight: false },
  { id: 'Department', label: 'Department', alignRight: false },
  { id: 'position', label: 'Position', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const EmployeeList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 5;
  const orderByParam = query.get('order_by') || '-created_at';
  const departmentParam = query.get('department') || '';
  const positionParam = query.get('position') || '';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    page: 0,
    department: positionParam,
    position: departmentParam,
  });
  const [selected, setSelected] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [employees, setEmployees] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isProductNotFound = employees.results.length === 0;

  // effects
  useEffect(() => {
    getEmployees();
    getRoles();
    return () => {};
  }, [query]);

  // department
  const [departmentData, setDepartmentData] = useState([]);
  useEffect(() => {
    getDepartments();
    return () => {};
  }, []);
  const getDepartments = () => {
    var url = `employee/departments/`;
    axios.get(url).then(({ data }) => {
      setDepartmentData(data);
    });
  };

  useEffect(() => {
    var params = '';
    params = `?status=${filters.status}&position=${filters.position}&department=${filters.department}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&order_by=${filters.order_by}`;

    navigate(PATH_DASHBOARD.employee.list + params);
    return () => {};
  }, [filters]);

  const handleDelete = (id) => {
    setUpdatingStatus(true);
    var data = [];
    selected.forEach((id) => {
      data.push(id);
    });
    axios
      .delete('employee/?id=' + id)
      .then(() => {
        getEmployees();
        enqueueSnackbar(' success', {
          variant: 'success',
        });
        setSelected([]);
      })
      .catch(() => {
        setUpdatingStatus(false);
      });
  };

  // actions

  const getRoles = () => {
    var url = `roles/`;
    axios.get(url).then(({ data }) => {
      setRolesData(data);
    });
  };

  const getEmployees = () => {
    var url = `employee/list/?page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&position=${filters.position}&department=${filters.department}&query=${filters.query}&status=${filters.status}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setEmployees(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Employee List Page'} roleBased role={{ name: 'Employee', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="Employee List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Employees',
                href: PATH_DASHBOARD.employee.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                color={'black'}
                to={PATH_DASHBOARD.employee.create}
                startIcon={<Iconify icon="mynaui:plus-solid" />}
              >
                New employee
              </Button>
            }
          />

          {isReady ? (
            <Card>
              <ListToolbar
                input={
                  <Stack
                    spacing={2.5}
                    width={'100%'}
                    direction={{
                      lg: 'row',
                      md: 'row',
                      sm: 'column',
                      xs: 'column',
                    }}
                  >
                    <FormControl sx={{ width: '180px' }}>
                      <InputLabel id="status-filter">Status</InputLabel>
                      <Select
                        labelId="status-filter"
                        id="status-filter-sel"
                        value={filters.status}
                        sx={{ width: '180px' }}
                        label="Status"
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, status: event.target.value, page: 0 };
                          });
                        }}
                      >
                        {statusTypes.map((val) => (
                          <MenuItem value={val.value} key={val.value}>
                            {val.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ width: '180px' }}>
                      <InputLabel id="role-select-label">Department</InputLabel>
                      <Select
                        labelId="role-select-label-id"
                        id="role-select-id"
                        placeholder="Department"
                        sx={{ width: '180px' }}
                        value={filters.department || ''}
                        label={'Department'}
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, department: event.target.value, position: '', page: 0 };
                          });
                        }}
                      >
                        <MenuItem value={''}>All</MenuItem>

                        {departmentData.map((val, index) => (
                          <MenuItem key={`${index}-state`} value={val.name}>
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ width: '180px' }}>
                      <InputLabel id="role-select-label">Position</InputLabel>
                      <Select
                        labelId="role-select-label-id"
                        sx={{ width: '180px' }}
                        id="role-select-id"
                        placeholder="Position"
                        value={filters.position || ''}
                        label={'Position'}
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, position: event.target.value, page: 0 };
                          });
                        }}
                      >
                        <MenuItem value={''}>All</MenuItem>
                        {departmentData
                          .filter((val) => val.name === filters.department)[0]
                          ?.department_positions.map((val, index) => (
                            <MenuItem key={`${index}-state`} value={val.name}>
                              {val.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
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
                        {employees.results.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow hover key={`${row.id}`} selected={isItemSelected}>
                              <TableCell
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(PATH_DASHBOARD.employee.edit(row.id))}
                                align="left"
                              >
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={row.photo}
                                    user={{
                                      first_name: row.name,
                                    }}
                                  />
                                  <Stack sx={{ ml: 1 }}>
                                    <Typography variant="subtitle3" line={1}>
                                      {row.name || '-'}
                                    </Typography>
                                    <Typography variant="caption" color={'text.secondary'} line={1}>
                                      {row.phone || '-'}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{row.em_id || '-'}</TableCell>
                              <TableCell align="left">
                                {moment(row.started_date, 'YYYY-MM-DD').format('DD MMM YYYY')}
                              </TableCell>

                              <TableCell align="left">{row.department?.name || '-'}</TableCell>

                              <TableCell align="left">{row.position?.name || '-'}</TableCell>

                              <TableCell align="left">
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
                                          navigate(PATH_DASHBOARD.employee.edit(row.id));
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
                count={employees.total_pages * parseInt(filters.pageSize, 10)}
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
export default connect(mapStateToProps)(EmployeeList);
