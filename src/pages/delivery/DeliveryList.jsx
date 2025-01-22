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
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
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
import DeliveryForm from '../../components/pages/delivery/DeliveryForm';
import { fCurrency } from '../../utils/formatNumber';
import Iconify from '../../components/common/Iconify';
import {
  handleAddDelivery,
  handleGetDeliveryList,
  handleRemoveDelivery,
  handleUpdateDelivery,
} from '../../redux/slices/delivery';
import Img from '../../components/common/Img';
import MoreMenu from '../../components/common/MoreMenu';

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
  { id: 'Delivery', label: 'Delivery', alignRight: false },
  { id: 'Office', label: 'Office Phone Number', alignRight: false },
  { id: 'Contact', label: 'Main Contact Phone NUmber', alignRight: false },
  { id: 'Address', label: 'Office Address', alignRight: false },
  { id: 'Status', label: 'Status', alignRight: false },
  { id: '' },
];

const initialData = {
  name: '',
  image: '/media/default.png',
  contact_person: null,
  telephone: null,
  remark: null,
  active: false,
  delivery_address: { state: '', city: '', address: '' },
};
const DeliveryList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const deliveryList = useSelector((state) => state.delivery.list);

  const theme = useTheme();
  const navigate = useNavigate();
  const query = useQuery();
  const queryParam = query.get('query') || '';
  const statusParam = query.get('status') || 'Active';
  const pageSizeParam = query.get('page_size') || 5;
  const orderByParam = query.get('order_by') || '-created_at';

  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    page: 0,
  });
  const [selected, setSelected] = useState([]);
  const [editingData, setEditingData] = useState(initialData);
  const [editingType, setEditingType] = useState('Edit');
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const isProductNotFound = deliveryList.results.length === 0;

  // effects
  useEffect(() => {
    handleGetDeliveryList(filters);
    return () => {};
  }, [query]);

  useEffect(() => {
    reload();
    return () => {};
  }, [filters]);

  const reload = () => {
    var params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&order_by=${filters.order_by}`;
    navigate(PATH_DASHBOARD.delivery.list + params);
  };

  const handleUpdateData = (data) => {
    setLoading(true);
    const isEdit = editingType === 'Edit';
    const axiosFetch = isEdit ? handleUpdateDelivery : handleAddDelivery;

    axiosFetch(data)
      .then((res) => {
        setOpen(false);
        setEditingData(initialData);
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
    <Page title={'Delivery List Page'}>
      {/*roleBased role={{ name: 'Delivery', type: 'read' }} */}
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Delivery List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Delivery List',
              },
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
                New Delivery
              </Button>
            }
          />

          <Card>
            <ListToolbar
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
                      {deliveryList.results.map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}`}>
                            <TableCell sx={{ minWidth: 120 }} align="left">
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
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell sx={{ minWidth: 120 }} align="left">
                              {row.telephone || '-'}
                            </TableCell>

                            <TableCell sx={{ minWidth: 120 }} align="left">
                              {row.contact_person || '-'}
                            </TableCell>

                            <TableCell align="left" sx={{ maxWidth: 200, minWidth: 150 }}>
                              {row.delivery_address?.address || '-'},{' '}
                              {row.delivery_address?.city?.split('_').join(' ') || '-'},{' '}
                              {row.delivery_address?.state?.split('_').join(' ') || '-'}
                            </TableCell>
                            <TableCell sx={{ minWidth: 120 }} align="left">
                              {row.active ? 'Active' : 'In-active'}
                            </TableCell>
                            <TableCell align="center">
                              <MoreMenu
                                actions={[
                                  {
                                    icon: <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />,
                                    text: 'Delete',
                                    props: {
                                      onClick: () => handleRemoveDelivery([row.id]),
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
              count={deliveryList.total_pages * parseInt(filters.pageSize, 10)}
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

          <DeliveryForm
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
export default DeliveryList;
