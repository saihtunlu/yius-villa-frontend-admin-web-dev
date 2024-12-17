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
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useNavigation } from 'react-router-dom';
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
    name: 'Joined Date (oldest first)',
    value: 'date_joined',
  },
  {
    name: 'Joined Date (newest first)',
    value: '-date_joined',
  },
  {
    name: 'Name A–Z',
    value: 'first_name',
  },
  {
    name: 'Name Z–A',
    value: '-first_name',
  },
];

const TABLE_HEAD = [
  { id: 'id', label: 'User', alignRight: false },
  { id: 'Started_Date', label: 'Started Date', alignRight: false },
  { id: 'Department', label: 'Department', alignRight: false },
  { id: 'position', label: 'Position', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const UserList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const statusParam = query.get('status') || 'Active';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 5;
  const orderByParam = query.get('order_by') || '-date_joined';
  const roleParam = query.get('role') || '';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    page: 0,
    role: roleParam,
  });
  const [selected, setSelected] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [users, setUsers] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
    next: 1,
  });

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isProductNotFound = users.results.length === 0;

  // effects
  useEffect(() => {
    getUsers();
    getRoles();
    return () => {};
  }, [query]);

  // department
  useEffect(() => {
    var params = '';
    params = `?status=${filters.status}&role=${filters.role}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&order_by=${filters.order_by}`;

    navigate(PATH_DASHBOARD.user.list + params);
    return () => {};
  }, [filters]);

  const handleDelete = (id) => {
    setUpdatingStatus(true);
    var data = [];
    selected.forEach((id) => {
      data.push(id);
    });
    axios
      .delete('user/?id=' + id)
      .then(() => {
        getUsers();
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

  const getUsers = () => {
    var url = `user/list/?page=${filters.page + 1}&page_size=${
      filters.pageSize
    }&role=${filters.role}&query=${filters.query}&status=${filters.status}&order_by=${filters.order_by}`;
    axios.get(url).then(({ data }) => {
      setUsers(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'User List Page'} roleBased role={{ name: 'User', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading="User List"
            hideBack
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Users',
                href: PATH_DASHBOARD.user.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                color={'black'}
                to={PATH_DASHBOARD.user.create}
                startIcon={<Iconify icon="mynaui:plus-solid" />}
              >
                New user
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
                        {['Active', 'Banned'].map((val) => (
                          <MenuItem value={val} key={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ width: '180px' }}>
                      <InputLabel id="role-select-label">Role</InputLabel>
                      <Select
                        labelId="role-select-label-id"
                        id="role-select-id"
                        placeholder="Role"
                        sx={{ width: '180px' }}
                        value={filters.role || ''}
                        label={'Role'}
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, role: event.target.value, page: 0 };
                          });
                        }}
                      >
                        <MenuItem value={''}>All</MenuItem>

                        {rolesData.map((val, index) => (
                          <MenuItem key={`${index}-state`} value={val.name}>
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                }
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
                        {users.results.map((row, index) => {
                          return (
                            <TableRow hover key={`${row.id}`}>
                              <TableCell
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(PATH_DASHBOARD.user.edit(row.id))}
                                align="left"
                              >
                                <Stack direction={'row'} alignItems={'center'}>
                                  <Avatar
                                    sx={{ width: 40, height: 40 }}
                                    src={row.avatar}
                                    user={{
                                      first_name: row.first_name,
                                    }}
                                  />
                                  <Stack sx={{ ml: 1 }}>
                                    <Typography variant="subtitle3" line={1}>
                                      {row.first_name + ' ' + row.last_name || '-'}
                                    </Typography>
                                    <Typography variant="caption" color={'text.secondary'} line={1}>
                                      {row.email || '-'}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </TableCell>

                              <TableCell align="left">{row.role?.name || '-'}</TableCell>
                              <TableCell align="left">{moment(row.date_joined).format('DD MMM YYYY')}</TableCell>

                              <TableCell align="left">{moment(row.last_login).format('DD MMM YYYY hh:mmA')}</TableCell>
                              <TableCell align="left">
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={row.is_active ? 'success' : 'error'}
                                >
                                  {row.is_active ? 'Active' : 'Banned'}
                                </Label>
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
                                          navigate(PATH_DASHBOARD.user.edit(row.id));
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
                count={users.total_pages * parseInt(filters.pageSize, 10)}
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
export default connect(mapStateToProps)(UserList);
