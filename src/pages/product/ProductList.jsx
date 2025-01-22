import { useState, useEffect } from 'react';

import {
  Grid2,
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
  Typography,
  IconButton,
  Tooltip,
  Stack,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from '@mui/material';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ListToolbar from '../../components/common/ListToolbar';
import SearchNotFound from '../../components/common/SearchNotFound';
import MoreMenu from '../../components/common/MoreMenu';
import Label from '../../components/common/Label';
import { fCurrency } from '../../utils/formatNumber';
import Img from '../../components/common/Img';
import { fDate } from '../../utils/formatTime';

import useQuery from '../../utils/RouteQuery';
import ListSkeleton from '../../components/skeleton/ListSkeleton';
import Iconify from '../../components/common/Iconify';

const status = ['Active', 'Draft', 'Archived'];
const sortList = [
  {
    name: 'Product title A–Z',
    value: 'name',
  },
  {
    name: 'Product title Z–A',
    value: '-name',
  },
  {
    name: 'Number of Stock(Highest)',
    value: '-number_of_stock',
  },
  {
    name: 'Number of Stock(Lowest)',
    value: 'number_of_stock',
  },
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
const initialFilters = {
  query: '',
  order_by: '-updated_at',
  pageSize: 5,
  supplier: '',
  status: 'Active',
  page: 0,
};
const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false },

  { id: 'status', label: 'Status', alignRight: false },
  // { id: 'category', label: 'Category', alignRight: false },
  { id: 'noOfStock', label: 'Inventory', alignRight: false },
  { id: 'noOfSold', label: 'Sold Quantity', alignRight: false },

  { id: 'tags', label: 'Tags', alignRight: false },
  { id: 'created_at', label: 'Created Date', alignRight: false },
  { id: '' },
];

export const removeProducts = async ({ data, type }) => {
  try {
    await axios.post(`product/remove/?type=${type}`, { data });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

const ProductList = (props) => {
  const { categories } = props;
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const query = useQuery();
  const statusParam = query.get('status') || '';
  const queryParam = query.get('query') || '';
  const pageSizeParam = query.get('page_size') || 5;
  const orderByParam = query.get('order_by') || '-created_at';
  const pageParam = query.get('page') || 0;

  // const mainCategoryParam = query.get('main_category') || '';
  // const subCategory = query.get('sub_category') || '';
  const [filters, setFilters] = useState({
    query: queryParam,
    order_by: orderByParam,
    pageSize: pageSizeParam,
    status: statusParam,
    page: pageParam,
    // main_category: subCategory,
    // sub_category: mainCategoryParam,
  });

  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [removing, setRemoving] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [products, setProducts] = useState({
    current_page: 1,
    results: [],
    total_pages: 0,
  });
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isProductNotFound = products.results.length === 0;

  // effects
  useEffect(() => {
    getProducts();
    return () => {};
  }, [query]);

  useEffect(() => {
    // &main_category=${filters.main_category}&sub_category=${filters.sub_category}
    var params = '';
    params = `?status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&page=${filters.page}&order_by=${filters.order_by}`;

    navigate(PATH_DASHBOARD.product.list + params);
    return () => {};
  }, [filters]);

  // handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = products.results.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (id) => {
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

  // actions
  const getProducts = () => {
    var link = `product/list/?page=${parseInt(filters.page, 10) + 1}&status=${filters.status}&query=${filters.query}&page_size=${filters.pageSize}&order_by=${filters.order_by}`;
    axios.get(link).then(({ data }) => {
      setProducts(data);
      setIsReady(true);
    });
  };
  const handleRemoveProduct = ({ pid, type }) => {
    setRemoving(true);
    var data = [];
    if (pid) {
      data = [pid];
    } else {
      selected.forEach((id) => {
        data.push(id);
      });
    }
    removeProducts({ data, type })
      .then(() => {
        getProducts();
        setRemoving(false);
        enqueueSnackbar(type + ' success', { variant: 'success' });
        setSelected([]);
      })
      .catch(() => {
        setRemoving(false);
      });
  };

  const getProductPrice = (product) => {
    if (product.has_variant) {
      const prices = product.variations.map((variant) => {
        return parseInt(variant.sale_price || variant.regular_price, 10);
      });

      var min = Math.min(...prices);
      var max = Math.max(...prices);
      if (min === max) {
        return fCurrency(min);
      }
      return min + ' - ' + fCurrency(max);
    }
    return fCurrency(product.sale_price || product.regular_price);
  };

  const getNoOfStocks = (product) => {
    if (product.has_variant) {
      const total = product.variations.reduce((sum, item) => sum + item.number_of_stock, 0);
      return total;
    }
    return product.number_of_stock;
  };

  const getNoOfSold = (product) => {
    if (product.has_variant) {
      const total = product.variations.reduce((sum, item) => sum + item.sold_out, 0);
      return total;
    }
    return product.sold_out;
  };

  return (
    <Page title={'Product List Page'} roleBased role={{ name: 'Product', type: 'read' }}>
      <Grid2 container spacing={2.5} maxWidth={'xl'}>
        <Grid2 size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Product List"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Products',
                href: PATH_DASHBOARD.product.list,
              },
              { name: 'List' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                color={'black'}
                to={PATH_DASHBOARD.product.create}
                startIcon={<Iconify icon="mynaui:plus-solid" />}
              >
                New Product
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
                        sx={{ width: '180px' }}
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
                        <MenuItem value={''}>All</MenuItem>

                        {status.map((val) => (
                          <MenuItem key={val} value={val}>
                            {val}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* <FormControl fullWidth sx={{ width: '180px' }}>
                      <InputLabel id="role-select-label">Main Category</InputLabel>
                      <Select
                        sx={{ width: '180px' }}
                        labelId="role-select-label-id"
                        id="role-select-id"
                        placeholder="Main Category"
                        value={filters.main_category || ''}
                        label={'Main Category'}
                        onChange={(event) => {
                          setFilters((preState) => {
                            return {
                              ...preState,
                              main_category: event.target.value,
                              sub_category: '',
                              position: '',
                              page: 0,
                            };
                          });
                        }}
                      >
                        <MenuItem value={''}>All</MenuItem>

                        {categories.map((val, index) => (
                          <MenuItem key={`${index}-state`} value={val.name}>
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ width: '180px' }}>
                      <InputLabel id="role-select-label">Sub Category</InputLabel>
                      <Select
                        sx={{ width: '180px' }}
                        labelId="role-select-label-id"
                        id="role-select-id"
                        placeholder="Sub Category"
                        value={filters.sub_category || ''}
                        label={'Sub Category'}
                        onChange={(event) => {
                          setFilters((preState) => {
                            return { ...preState, sub_category: event.target.value, page: 0 };
                          });
                        }}
                      >
                        <MenuItem value={''}>All</MenuItem>
                        {categories
                          .filter((val) => val.name === filters.main_category)[0]
                          ?.sub_categories.map((val, index) => (
                            <MenuItem key={`${index}-state`} value={val.name}>
                              {val.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl> */}
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
                actions={[
                  <Tooltip title="Archive">
                    <IconButton disabled={removing} onClick={() => handleRemoveProduct({ type: 'Archive' })}>
                      <Iconify icon={'solar:archive-bold-duotone'} />
                    </IconButton>
                  </Tooltip>,
                  <Tooltip title="Delete">
                    <IconButton disabled={removing} onClick={() => handleRemoveProduct({ type: 'Delete' })}>
                      <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                    </IconButton>
                  </Tooltip>,
                ]}
              />
              <Box sx={{ overflowX: 'auto' }}>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            indeterminate={selected.length > 0 && selected.length < products.results.length}
                            checked={products.results.length > 0 && selected.length === products.results.length}
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
                          <TableCell align="center" colSpan={9}>
                            <Box sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filters.query} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      <TableBody>
                        {products.results.map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={`${row.id}-${row.name}`}
                              selected={isItemSelected}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox checked={isItemSelected} onClick={() => handleClick(row.id)} />
                              </TableCell>

                              <TableCell
                                align="left"
                                sx={{ cursor: 'pointer', minWidth: '250px' }}
                                onClick={() => navigate(PATH_DASHBOARD.product.edit(row.slug))}
                              >
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
                                    src={row.images[0]?.image || '/assets/img/default.png'}
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
                                      {getProductPrice(row)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>

                              <TableCell align="left">
                                <Label
                                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                  color={
                                    (row.status === 'Archived' && 'error') ||
                                    (row.status === 'Draft' && 'warning') ||
                                    'success'
                                  }
                                >
                                  {row.status ? sentenceCase(row.status) : '-'}
                                </Label>
                              </TableCell>

                              {/* <TableCell align="left" sx={{ minWidth: 300 }}>
                                <Stack sx={{ flexWrap: 'wrap' }} spacing={1} direction="row">
                                  <Label
                                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                    color={'success'}
                                    sx={{
                                      marginBottom: '5px !important',
                                      marginLeft: '0px !important',
                                      marginRight: '5px !important',
                                    }}
                                  >
                                    {row.main_category?.name || '-'}
                                  </Label>

                                  {row.sub_category.map((sub, index) => {
                                    return (
                                      <Label
                                        sx={{
                                          marginBottom: '5px !important',
                                          marginLeft: '0px !important',
                                          marginRight: '5px !important',
                                        }}
                                        key={sub.name + index}
                                        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                        color={'warning'}
                                      >
                                        {sub.name || '-'}
                                      </Label>
                                    );
                                  })}
                                </Stack>
                              </TableCell> */}

                              <TableCell align="left" sx={{ minWidth: 150 }}>
                                {getNoOfStocks(row)} pcs
                              </TableCell>
                              <TableCell align="left" sx={{ minWidth: 200 }}>
                                {getNoOfSold(row)} pcs sold out
                              </TableCell>

                              <TableCell align="left" sx={{ minWidth: 200 }}>
                                <Stack sx={{ flexWrap: 'wrap' }} spacing={1} direction="row">
                                  {row.tags.length > 0
                                    ? row.tags.map((tag, index) => {
                                        return (
                                          <Box key={index} sx={{ mb: '3px !important' }}>
                                            <Label
                                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                              color={'primary'}
                                            >
                                              {tag}
                                            </Label>
                                          </Box>
                                        );
                                      })
                                    : '-'}
                                </Stack>
                              </TableCell>

                              <TableCell align="left" sx={{ minWidth: 120 }}>
                                {fDate(row.created_at || '')}
                              </TableCell>
                              <TableCell align="center">
                                <MoreMenu
                                  actions={[
                                    {
                                      icon: <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />,
                                      text: 'Delete',
                                      props: {
                                        onClick: () =>
                                          handleRemoveProduct({
                                            pid: row.id,
                                            type: 'Delete',
                                          }),
                                        sx: { color: 'text.secondary' },
                                      },
                                    },
                                    {
                                      icon: <Iconify icon={'solar:pen-new-round-bold-duotone'} />,
                                      text: 'Edit',
                                      props: {
                                        onClick: () => {
                                          navigate(PATH_DASHBOARD.product.edit(row.slug));
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
                rowsPerPageOptions={[1, 5, 10, 25]}
                component="div"
                count={products.total_pages * parseInt(filters.pageSize, 10)}
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
        </Grid2>
      </Grid2>
    </Page>
  );
};
const mapStateToProps = (state) => {
  return { store: state.auth.user.store, categories: state.category };
};

export default connect(mapStateToProps)(ProductList);
