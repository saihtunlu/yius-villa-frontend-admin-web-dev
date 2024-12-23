import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2 as Grid,
  useTheme,
  Tab,
  Tabs,
  InputAdornment,
  OutlinedInput,
  Tooltip,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  ListSubheader,
  Divider,
  Typography,
  ListItemAvatar,
  Box,
  Stack,
  TextField,
  IconButton,
  FormControlLabel,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';

import SearchNotFound from '../../common/SearchNotFound';
import { searchProducts } from '../../../redux/actions';
import Img from '../../common/Img';
import { fCurrency } from '../../../utils/formatNumber';
import Media from '../../common/Media';
import Iconify from '../../common/Iconify';

const INITIAL_CUSTOM_PRODUCT = {
  name: '',
  is_custom_product: true,
  quantity: 0,
  profit: 0,
  margin: 0,
  price: 1,
  cost_per_item: 0,
  image: '/assets/img/default.png',
  variation_product: null,
  number_of_fulfilled: 0,
  product: null,
  subtotal: 0,
};

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  border: `solid 1px ${theme.palette.divider}`,
  overflow: 'auto',
  maxHeight: 'calc(100vh - 325px)',
}));

const AddProduct = (props) => {
  const { onSelect } = props;
  const [customProducts, setCustomProducts] = useState([INITIAL_CUSTOM_PRODUCT]);
  const [tab, setTab] = useState(0);

  const [searchResult, setSearchResult] = useState([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const isEmptySearchResult = searchResult.length === 0;
  const theme = useTheme();

  useEffect(() => {
    if (!query) {
      setSearchResult([]);
    }
  }, [query]);

  // handlers
  const handleClickOpen = () => () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeTap = (event, newValue) => {
    setTab(newValue);
  };
  const handleChoose = () => {
    if (tab === 0) {
      var selectedProducts = [];
      searchResult.forEach((product, index) => {
        if (product.isSelected) {
          var sellingPrice = product.sale_price || product.regular_price;

          var primary_price =
            parseInt(product.cost_per_item, 10) === 0 || !product.cost_per_item
              ? parseInt(parseInt(sellingPrice, 10) * 0.6666, 10)
              : product.cost_per_item;

          var profit = sellingPrice - primary_price;

          var margin = ((profit / sellingPrice) * 100).toFixed(2);

          selectedProducts.push({
            profit,
            margin,
            cost_per_item: product.cost_per_item,
            name: product.is_main_product ? product.name : product.product_name + ' - ' + product.name,
            quantity: 1,
            price: sellingPrice,
            image:
              (product.is_main_product ? product.images[0]?.image || '/assets/img/default.png' : product.image) ||
              '/assets/img/default.png',
            variation_product: product.is_main_product ? null : product.id,
            number_of_fulfilled: 0,
            product: product.is_main_product ? product.id : null,
            subtotal: sellingPrice,
          });
        }
      });
      onSelect(selectedProducts);
    } else {
      var selectedCustomProducts = [];

      customProducts.forEach((product, index) => {
        var cost_per_item = parseInt(parseInt(product.price, 10) * 0.6666, 10);
        var profit = product.price - cost_per_item;
        var margin = ((profit / product.price / product.quantity) * 100).toFixed(2);

        selectedCustomProducts.push({ ...product, margin, profit, cost_per_item });
      });

      onSelect(selectedCustomProducts);
    }
    setOpen(false);
  };

  const handleSearchProducts = () => {
    setSearching(true);
    searchProducts(query).then((data) => {
      setSearchResult(data.map((data2) => ({ ...data2, isSelected: false })));
      setSearching(false);
    });
  };
  const handleAddCustomProduct = () => {
    setCustomProducts((preState) => {
      return [...preState, INITIAL_CUSTOM_PRODUCT];
    });
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <Button
        variant="text"
        onClick={handleClickOpen()}
        size="small"
        startIcon={<Iconify width={20} height={20} icon="mynaui:plus-solid" />}
      >
        Add product
      </Button>

      <Dialog
        open={open}
        fullWidth
        maxWidth={'sm'}
        id="new-order-product-dialog"
        onClose={handleClose}
        aria-labelledby="order-product-title"
        aria-describedby="order-product-description"
      >
        <DialogTitle id="AddProduct-library" sx={{ px: 2.5, pt: 2.5 }} variant="subtitle1">
          New Product
        </DialogTitle>
        <DialogContent dividers sx={{ py: 0, minHeight: '65vh', px: 2.5 }}>
          <Tabs
            value={tab}
            onChange={handleChangeTap}
            aria-label="AddProduct tabs"
            sx={{
              position: 'sticky',
              top: 0,
              background: theme.palette.background.paper,
              zIndex: 11,
            }}
          >
            <Tab disableTouchRipple label="Select from products" {...a11yProps(0)} />
            <Tab label="Add custom products" disableTouchRipple {...a11yProps(1)} />
          </Tabs>
          {tab === 0 && (
            <Grid container spacing={0}>
              <Grid size={12}>
                <OutlinedInput
                  fullWidth
                  onKeyDown={({ key }) => {
                    if (key === 'Enter') {
                      handleSearchProducts();
                    }
                  }}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Enter product name"
                  endAdornment={
                    <InputAdornment position="end">
                      {query && (
                        <Tooltip title="Clear">
                          <IconButton
                            aria-label=""
                            sx={{ mr: 1.5 }}
                            onClick={() => {
                              setQuery('');
                            }}
                          >
                            <Icon icon={closeFill} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <LoadingButton
                        color={'black'}
                        loading={searching}
                        onClick={() => handleSearchProducts()}
                        variant="contained"
                        startIcon={<Icon icon={searchFill} />}
                      >
                        Search
                      </LoadingButton>
                    </InputAdornment>
                  }
                  sx={{
                    my: 2.5,
                    pr: 0.8,
                    transition: (theme) =>
                      theme.transitions.create('box-shadow', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.shorter,
                      }),
                    '&.Mui-focused': {
                      boxShadow: (theme) => theme.customShadows.z8,
                    },
                    '& fieldset': {
                      borderWidth: `1px !important`,
                      borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
                    },
                  }}
                />

                {!searching && isEmptySearchResult ? (
                  <SearchNotFound />
                ) : (
                  <ListWrapperStyle>
                    <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                      }}
                      subheader={
                        <ListSubheader component="div" id="search-product-subheader" sx={{ display: 'flex', py: 2.5 }}>
                          <Typography variant="body2">
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              Search result:&nbsp;
                            </Typography>
                            {searchResult.length}
                          </Typography>
                          <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
                          <Typography variant="body2">
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
                              Selected:&nbsp;
                            </Typography>
                            {searchResult.filter((product) => product.isSelected).length}
                          </Typography>
                        </ListSubheader>
                      }
                    >
                      {searchResult.map((product, index) => {
                        const labelId = `search-result-product-${index}`;
                        return (
                          <ListItem
                            key={labelId}
                            secondaryAction={
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={product.isSelected}
                                    onChange={() => {
                                      setSearchResult((preState) => {
                                        var newState = JSON.parse(JSON.stringify(preState));
                                        if (!product.isSelected) {
                                          newState[index].isSelected = true;
                                        } else {
                                          newState[index].isSelected = false;
                                        }
                                        return [...newState];
                                      });
                                    }}
                                  />
                                }
                              />
                            }
                            disablePadding
                          >
                            <ListItemButton sx={{ p: 1.5 }} role={undefined} dense>
                              <ListItemAvatar>
                                <Img
                                  alt={product.name}
                                  lightbox
                                  src={
                                    product.is_main_product
                                      ? product.images[0]?.image || '/assets/img/default.png'
                                      : product.image
                                  }
                                  sx={{
                                    borderRadius: (theme) => theme.shape.borderRadiusSm + 'px',
                                    width: '55px',
                                    height: '55px',
                                    objectFit: 'cover',
                                  }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                onClick={() => {
                                  setSearchResult((preState) => {
                                    var newState = JSON.parse(JSON.stringify(preState));
                                    if (!product.isSelected) {
                                      newState[index].isSelected = true;
                                    } else {
                                      newState[index].isSelected = false;
                                    }
                                    return [...newState];
                                  });
                                }}
                                id={labelId}
                                primary={
                                  <Typography variant="subtitle2">
                                    {product.is_main_product
                                      ? product.name
                                      : product.product_name + ' - ' + product.name}{' '}
                                    <Typography variant="body2" component={'span'}>
                                      ({product.barcode})
                                    </Typography>
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2">
                                    Price : {fCurrency(product.sale_price || product.regular_price)} /{' '}
                                    {product.number_of_stock} in stock
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </ListWrapperStyle>
                )}
              </Grid>
            </Grid>
          )}
          {tab === 1 && (
            <Grid container spacing={0}>
              <Grid size={12}>
                <Stack spacing={2.5}>
                  {customProducts.map((product, index) => {
                    return (
                      <Box
                        key={`search-product-${index}`}
                        sx={{
                          padding: 2.5,
                          marginTop: 2.5,
                          borderRadius: theme.shape.borderRadius + 'px',
                          bgcolor: 'background.neutral',
                        }}
                      >
                        <Stack spacing={2.5}>
                          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography variant="subtitle2" sx={{}}>
                              {product.name ? product.name : 'Add new custom product'}
                            </Typography>
                            {customProducts.length > 1 && (
                              <Tooltip title="Remove custom product">
                                <IconButton
                                  aria-label="remove-custom-product"
                                  onClick={() => {
                                    setCustomProducts((preState) => {
                                      var newState = JSON.parse(JSON.stringify(preState));
                                      newState.splice(index, 1);
                                      return newState;
                                    });
                                  }}
                                >
                                  <Icon icon={trash2Fill} width={20} height={20} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>

                          <Media
                            initialSelected={[{ image: product.image }]}
                            single
                            caption=""
                            onChange={(data) => {
                              setCustomProducts((preState) => {
                                var newState = JSON.parse(JSON.stringify(preState));
                                newState[index].image = data[0]?.full_url;
                                return newState;
                              });
                            }}
                          />

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                            <TextField
                              value={product.name}
                              onChange={(event) =>
                                setCustomProducts((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState[index].name = event.target.value;
                                  return newState;
                                })
                              }
                              fullWidth
                              label="Name"
                            />
                          </Stack>

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                            <TextField
                              fullWidth
                              label="Quantity"
                              slotProps={{
                                input: {
                                  endAdornment: <InputAdornment position="end">Items</InputAdornment>,
                                  type: 'number',
                                  inputMode: 'numeric',
                                  inputProps: { min: 1 },
                                },
                              }}
                              value={product.quantity}
                              onChange={(event) =>
                                setCustomProducts((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState[index].quantity = event.target.value;
                                  newState[index].subtotal = String(
                                    parseInt(event.target.value, 10) * parseInt(newState[index].price, 10)
                                  );
                                  return newState;
                                })
                              }
                            />

                            <TextField
                              fullWidth
                              label="Price"
                              slotProps={{
                                input: {
                                  endAdornment: <InputAdornment position="end">KS</InputAdornment>,
                                  type: 'number',
                                  inputMode: 'numeric',
                                  inputProps: { min: 0 },
                                },
                              }}
                              value={product.price}
                              onChange={(event) =>
                                setCustomProducts((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState[index].price = event.target.value;
                                  newState[index].subtotal = String(
                                    parseInt(newState[index].quantity, 10) * parseInt(event.target.value, 10)
                                  );
                                  return newState;
                                })
                              }
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}

                  <Box sx={{ mt: 3 }}>
                    <Button size="small" startIcon={<Icon icon={plusFill} />} onClick={() => handleAddCustomProduct()}>
                      Add new custom product
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="black">
            Cancel
          </Button>
          <Button variant={'contained'} color="black" onClick={handleChoose}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProduct;
