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
import CouponForm from '../../components/pages/coupon/CouponForm';
import Iconify from '../../components/common/Iconify';
import {
  handleAddCoupon,
  handleGetCouponList,
  handleRemoveCoupon,
  handleUpdateCoupon,
} from '../../redux/slices/coupon';
import Img from '../../components/common/Img';
import MoreMenu from '../../components/common/MoreMenu';
import { fDate } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';

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
  { id: 'Coupon', label: 'Coupon', alignRight: false },
  { id: 'Usages', label: 'Usages', alignRight: false },
  { id: 'type', label: 'Discount Type', alignRight: false },
  { id: 'value', label: 'Discount Value', alignRight: false },
  { id: 'max_value', label: 'Max Discount Value', alignRight: false },
  { id: 'min_order', label: 'Min Order Amount', alignRight: false },
  { id: 'start', label: 'Start Date', alignRight: false },
  { id: 'end', label: 'End Date', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

const initialData = {
  code: '',
  discount_type: 'Amount',
  discount_value: '',
  min_order_value: '',
  max_discount_value: null,
  start_date: null,
  end_date: null,
  is_active: true,
  code_type: 'static',
};
const CouponList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const couponList = useSelector((state) => state.coupon.list);

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

  const isProductNotFound = couponList.results.length === 0;

  // effects
  useEffect(() => {
    handleGetCouponList(filters);
    return () => {};
  }, [query]);

  useEffect(() => {
    reload();
    return () => {};
  }, [filters]);

  const reload = () => {
    var params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&order_by=${filters.order_by}`;
    navigate(PATH_DASHBOARD.coupon.list + params);
  };

  const handleUpdateData = (data) => {
    setLoading(true);
    const isEdit = editingType === 'Edit';
    const axiosFetch = isEdit ? handleUpdateCoupon : handleAddCoupon;

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
    <Page title={'Coupon List Page'}>
      {/*roleBased role={{ name: 'Coupon', type: 'read' }} */}
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Coupon List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Coupon List',
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
                New Coupon
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
                      {couponList.results.map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={`${row.id}`}>
                            <TableCell align="left">{row.code}</TableCell>
                            <TableCell align="left">{row.usages.length} uses</TableCell>
                            <TableCell align="left">{row.discount_type}</TableCell>
                            <TableCell align="left">
                              {row.discount_type === 'Amount'
                                ? fCurrency(row.discount_value)
                                : row.discount_value + '%'}
                            </TableCell>
                            <TableCell align="left">{fCurrency(row.max_discount_value) || '-'}</TableCell>
                            <TableCell align="left">{fCurrency(row.min_order_value) || '-'}</TableCell>

                            <TableCell align="left">{fDate(row.start_date)}</TableCell>
                            <TableCell align="left">{fDate(row.end_date)}</TableCell>
                            <TableCell sx={{ minWidth: 120 }} align="left">
                              <Label variant="ghost" color={row.is_active ? 'success' : 'error'}>
                                {row.is_active ? 'Active' : 'In-active'}
                              </Label>
                            </TableCell>
                            <TableCell align="center">
                              <MoreMenu
                                actions={[
                                  {
                                    icon: <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />,
                                    text: 'Delete',
                                    props: {
                                      onClick: () => handleRemoveCoupon([row.id]),
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
              count={couponList.total_pages * parseInt(filters.pageSize, 10)}
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

          <CouponForm
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
export default CouponList;
