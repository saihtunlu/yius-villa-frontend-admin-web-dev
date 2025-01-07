import {
  TextField,
  InputAdornment,
  Stack,
  Grid2,
  Card,
  styled,
  Typography,
  Chip,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Button,
  IconButton,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Collapse,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingButton from '@mui/lab/LoadingButton';

import QuillEditor from '../../common/quill';
import Media from '../../common/Media';
import { createNewProduct } from '../../../redux/actions';
import { PATH_DASHBOARD } from '../../../router/paths';
import axios from '../../../utils/axios';
import { getVariations } from '../../../utils/getVariation';
import { fCurrency } from '../../../utils/formatNumber';
import barcodeGenerator from '../../../utils/barcodeGenerator';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';
import Iconify from '../../common/Iconify';

export const INITIAL_PRODUCT = {
  name: '',
  slug: '',
  barcode: '',
  description: '',
  images: [],
  regular_price: 0,
  sale_price: 0,
  cost_per_item: 0,
  margin: '',
  profit: '',
  is_tracking: true,
  tax_included: true,
  weight: '',
  demission_unit: '',
  weight_unit: '',
  height: '',
  length: '',
  width: '',
  width_unit: '',
  has_variant: true,
  options: [
    {
      name: '',
      values: [],
    },
  ],
  tags: [],
  variations: [],
  number_of_stock: '1',
  sold_out: '0',
  threshold_stock: '0',
  status: 'Draft',
  main_category: { name: '' },
  sub_category: [],
  supplier_name: '',
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const STATUS_OPTIONS = ['Draft', 'Active', 'Archived'];

function ProductNewForm(props) {
  const { store, user } = props;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [variations, setVariations] = useState([]);
  const theme = useTheme();

  // effects
  useEffect(() => {
    setProduct((preState) => {
      return { ...preState, barcode: barcodeGenerator('YV36') };
    });
    getOptions();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const variations = getVariations(product.options, product);
    setVariations(variations);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.options]);

  useEffect(() => {
    calcPrice();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.sale_price, product.regular_price, product.cost_per_item]);

  const calcPrice = () => {
    var profit = null;
    var margin = null;

    if (product.sale_price > 0 && product.cost_per_item) {
      profit = product.sale_price - product.cost_per_item;
      margin = ((profit / product.sale_price) * 100).toFixed(2);
    } else if (product.regular_price && product.cost_per_item) {
      profit = product.regular_price - product.cost_per_item;
      margin = ((profit / product.regular_price) * 100).toFixed(2);
    } else {
      margin = null;
      profit = null;
    }
    setProduct((preState) => {
      return { ...preState, profit, margin };
    });
  };
  const getOptions = () => {
    const url = 'product/options/';
    axios.get(url).then(({ data }) => {
      setOptions(data);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    var payload = product;
    if (product.has_variant) {
      payload.variations = variations;
    }
    createNewProduct(payload)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.product.list);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const calcMarginAndProfit = (cost_per_item, regular_price, sale_price) => {
    cost_per_item = Number(cost_per_item);
    regular_price = Number(regular_price);
    sale_price = Number(sale_price);

    if (cost_per_item && (sale_price > 0 || regular_price > 0)) {
      const price = sale_price > 0 ? sale_price : regular_price;
      const profit = price - cost_per_item;
      const margin = ((profit / cost_per_item) * 100).toFixed(2);
      return { profit, margin };
    }
    return { profit: null, margin: null };
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid2 container spacing={2.5}>
        <Grid2 size={{ xs: 12, md: 8, lg: 8 }}>
          <Card sx={{ p: 2.5, mb: 2.5 }}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle1">General</Typography>

              <div>
                <LabelStyle>Add Images</LabelStyle>
                <Media
                  initialSelected={product.images}
                  onChange={(images) => {
                    var selectedImages = [];
                    images.forEach((image) => {
                      selectedImages.push({ image: image.full_url });
                    });
                    setProduct((preState) => {
                      return { ...preState, images: selectedImages };
                    });
                  }}
                />
              </div>

              <TextField
                fullWidth
                required
                label="Product Name"
                value={product.name}
                onChange={(event) =>
                  setProduct((preState) => {
                    return { ...preState, name: event.target.value };
                  })
                }
              />

              {/* <div>
                <LabelStyle>Description</LabelStyle>
                <QuillEditor
                  simple
                  id="product-description"
                  value={product.description}
                  onChange={(val) =>
                    setProduct((preState) => {
                      return { ...preState, description: val };
                    })
                  }
                />
              </div> */}

              <FormControlLabel
                control={
                  <Switch
                    checked={product.has_variant}
                    onChange={(event) => {
                      setProduct((preState) => {
                        return {
                          ...preState,
                          has_variant: event.target.checked,
                        };
                      });
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label=" This product has multi options, like different size and color "
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={product.is_tracking}
                    onChange={(event) => {
                      setProduct((preState) => {
                        return {
                          ...preState,
                          is_tracking: event.target.checked,
                        };
                      });
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label=" Allow tracking quantity "
              />
            </Stack>
          </Card>

          <Collapse in={product.is_tracking && !product.has_variant}>
            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Inventory</Typography>
                <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    sx={{ width: '48%' }}
                    label="Number of stock"
                    value={product.number_of_stock}
                    onChange={(event) =>
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.number_of_stock = event.target.value;
                        return newState;
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    placeholder="0"
                    sx={{ width: '48%' }}
                    label="Number of threshold"
                    value={product.threshold_stock}
                    onChange={(event) =>
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.threshold_stock = event.target.value;
                        return newState;
                      })
                    }
                  />
                </Stack>
              </Stack>
            </Card>
          </Collapse>

          <Collapse in={!product.has_variant}>
            <Card sx={{ p: 2.5, mb: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Pricing</Typography>
                <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                  <TextField
                    fullWidth
                    placeholder="0"
                    label="Regular Price"
                    value={product.regular_price}
                    onChange={(event) =>
                      setProduct((preState) => {
                        return {
                          ...preState,
                          regular_price: event.target.value,
                        };
                      })
                    }
                    slotProps={{
                      input: {
                        ...(store.settings.suffix_currency
                          ? {
                              endAdornment: (
                                <InputAdornment position="start">{store.settings.suffix_currency}</InputAdornment>
                              ),
                            }
                          : {
                              startAdornment: (
                                <InputAdornment position="start">{store.settings.prefix_currency}</InputAdornment>
                              ),
                            }),
                        type: 'number',
                        inputMode: 'numeric',
                        inputProps: { min: 0 },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    placeholder="0"
                    label="Sale Price"
                    value={product.sale_price}
                    onChange={(event) =>
                      setProduct((preState) => {
                        return {
                          ...preState,
                          sale_price: event.target.value,
                        };
                      })
                    }
                    slotProps={{
                      input: {
                        ...(store.settings.suffix_currency
                          ? {
                              endAdornment: (
                                <InputAdornment position="start">{store.settings.suffix_currency}</InputAdornment>
                              ),
                            }
                          : {
                              startAdornment: (
                                <InputAdornment position="start">{store.settings.prefix_currency}</InputAdornment>
                              ),
                            }),
                        type: 'number',
                        inputMode: 'numeric',
                        inputProps: { min: 0 },
                      },
                    }}
                  />
                </Stack>
                {user?.role?.name === 'Owner' && (
                  <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }} justifyContent={'space-between'}>
                    <TextField
                      fullWidth
                      placeholder="0"
                      label="Cost per item"
                      sx={{ width: 'calc(50% - 12px)' }}
                      value={product.cost_per_item}
                      onChange={(event) =>
                        setProduct((preState) => {
                          return {
                            ...preState,
                            cost_per_item: event.target.value,
                          };
                        })
                      }
                      slotProps={{
                        input: {
                          ...(store.settings.suffix_currency
                            ? {
                                endAdornment: (
                                  <InputAdornment position="start">{store.settings.suffix_currency}</InputAdornment>
                                ),
                              }
                            : {
                                startAdornment: (
                                  <InputAdornment position="start">{store.settings.prefix_currency}</InputAdornment>
                                ),
                              }),
                          type: 'number',
                          inputMode: 'numeric',
                          inputProps: { min: 0 },
                        },
                      }}
                    />
                    <Stack direction={'row'} justifyContent="space-around" alignItems={'center'} sx={{ width: '48%' }}>
                      <Box>
                        <LabelStyle>Margin</LabelStyle>
                        <Typography textAlign={'center'} variant="body1">
                          {product.margin || '-'}%
                        </Typography>
                      </Box>
                      <Box>
                        <LabelStyle>Profit</LabelStyle>
                        <Typography textAlign={'center'} variant="body1">
                          {fCurrency(product.profit || '') || '-'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Collapse>

          <Collapse in={product.has_variant}>
            <Stack spacing={2.5}>
              <Card sx={{ p: 2.5 }}>
                <Stack spacing={2.5}>
                  <Typography variant="subtitle1">Options</Typography>
                  {product.options.map((option, index) => {
                    return (
                      <Stack spacing={2.5} key={index + '-option'} direction={{ xs: 'column', sm: 'row' }}>
                        <Autocomplete
                          freeSolo
                          sx={{ width: '48%' }}
                          disableClearable
                          onChange={(_, value) => {
                            setProduct((preState) => {
                              var newState = JSON.parse(JSON.stringify(preState));
                              newState.options[index].name = value;
                              return { ...newState };
                            });
                          }}
                          value={option.name}
                          inputValue={option.name}
                          onInputChange={(_, value) => {
                            setProduct((preState) => {
                              var newState = JSON.parse(JSON.stringify(preState));
                              newState.options[index].name = value;
                              return { ...newState };
                            });
                          }}
                          options={options.map((option) => option.name)}
                          renderInput={(params) => <TextField {...params} label="Option Name" />}
                        />

                        <Autocomplete
                          multiple
                          freeSolo
                          sx={{ width: '48%' }}
                          onChange={(_, value) => {
                            setProduct((preState) => {
                              var newState = JSON.parse(JSON.stringify(preState));
                              newState.options[index].values = value;
                              return { ...newState };
                            });
                          }}
                          options={[].map((option) => option)}
                          renderTags={(value, getTagProps) =>
                            value.map((option_, index_) => (
                              <Chip
                                {...getTagProps({ index: index_ })}
                                key={option_}
                                size="small"
                                label={option_}
                                sx={{
                                  borderRadius: '8px ',
                                }}
                              />
                            ))
                          }
                          renderInput={(params) => <TextField label="Options" {...params} />}
                        />
                        <div
                          style={{
                            width: '4%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              setProduct((preState) => {
                                var newState = JSON.parse(JSON.stringify(preState));
                                newState.options.splice(index, 1);
                                return { ...newState };
                              });
                            }}
                          >
                            <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                          </IconButton>
                        </div>
                      </Stack>
                    );
                  })}
                  {product.options.length < 3 && (
                    <Stack direction={'row'} justifyContent="flex-start">
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setProduct((preState) => {
                            var newState = JSON.parse(JSON.stringify(preState));
                            newState.options.push({ name: '', values: [] });
                            return { ...newState };
                          });
                        }}
                        startIcon={<Iconify icon="mynaui:plus-solid" />}
                      >
                        Add
                        {product.options.length > 0 ? ' another ' : ' an '}
                        option
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </Card>

              {variations.length !== 0 && (
                <Card sx={{ p: 2.5 }}>
                  <Stack spacing={2.5}>
                    <Typography variant="subtitle1">Variations</Typography>
                    {variations.map((variant, index) => {
                      return (
                        <Accordion
                          key={index + '-product-variation'}
                          sx={{
                            backgroundColor: (theme) => theme.palette.background.neutral + ' !important',
                            borderRadius: (theme) => theme.shape.borderRadius + 'px',

                            '&::before': {
                              display: 'none !important',
                            },
                            '&.Mui-expanded': {
                              boxShadow: 'none',
                              marginBottom: 0,
                              marginTop: '24px !important',
                            },
                          }}
                        >
                          <AccordionSummary
                            sx={{
                              px: 2.5,
                            }}
                            expandIcon={
                              <IconButton>
                                <Icon icon={arrowIosDownwardFill} />
                              </IconButton>
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Stack
                              direction={'row'}
                              sx={{ width: '100%' }}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                            >
                              <Typography>{variant.name}</Typography>

                              <IconButton
                                color={'error'}
                                onClick={() => {
                                  setVariations((preState) => {
                                    var newState = JSON.parse(JSON.stringify(preState));
                                    newState.splice(index, 1);
                                    return newState;
                                  });
                                }}
                              >
                                <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                              </IconButton>
                            </Stack>
                          </AccordionSummary>

                          <AccordionDetails
                            sx={{
                              p: 2.5,
                            }}
                          >
                            <Stack spacing={2.5}>
                              <Media
                                initialSelected={[{ image: variant.image }]}
                                single
                                caption=""
                                onChange={(data) => {
                                  setVariations((preState) => {
                                    var newState = JSON.parse(JSON.stringify(preState));
                                    newState[index].image = data[0]?.full_url;
                                    return newState;
                                  });
                                }}
                              />
                              <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                                <TextField
                                  fullWidth
                                  label="Name"
                                  value={variant.name}
                                  onChange={(event) =>
                                    setVariations((preState) => {
                                      var newState = JSON.parse(JSON.stringify(preState));
                                      newState[index].name = event.target.value;
                                      return newState;
                                    })
                                  }
                                />

                                <TextField
                                  fullWidth
                                  label="Barcode"
                                  value={variant.barcode}
                                  // onChange={(event) =>
                                  //   setVariations((preState) => {
                                  //     var newState = JSON.parse(JSON.stringify(preState));
                                  //     newState[index].barcode = event.target.value;
                                  //     return newState;
                                  //   })
                                  // }
                                />
                              </Stack>

                              <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                                <TextField
                                  fullWidth
                                  placeholder="0"
                                  label="Regular Price"
                                  value={variant.regular_price}
                                  onChange={(event) =>
                                    setVariations((preState) => {
                                      var newState = JSON.parse(JSON.stringify(preState));
                                      const { margin, profit } = calcMarginAndProfit(
                                        newState[index].cost_per_item,
                                        event.target.value,
                                        newState[index].sale_price
                                      );

                                      newState[index].regular_price = event.target.value;
                                      newState[index].margin = margin;
                                      newState[index].profit = profit;
                                      return newState;
                                    })
                                  }
                                  slotProps={{
                                    input: {
                                      ...(store.settings.suffix_currency
                                        ? {
                                            endAdornment: (
                                              <InputAdornment position="start">
                                                {store.settings.suffix_currency}
                                              </InputAdornment>
                                            ),
                                          }
                                        : {
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                {store.settings.prefix_currency}
                                              </InputAdornment>
                                            ),
                                          }),
                                      type: 'number',
                                      inputMode: 'numeric',
                                      inputProps: { min: 0 },
                                    },
                                  }}
                                />

                                <TextField
                                  fullWidth
                                  placeholder="0"
                                  label="Sale Price"
                                  value={variant.sale_price}
                                  onChange={(event) =>
                                    setVariations((preState) => {
                                      var newState = JSON.parse(JSON.stringify(preState));

                                      const { margin, profit } = calcMarginAndProfit(
                                        newState[index].cost_per_item,
                                        newState[index].regular_price,
                                        event.target.value
                                      );
                                      newState[index].sale_price = event.target.value;
                                      newState[index].margin = margin;
                                      newState[index].profit = profit;
                                      return newState;
                                    })
                                  }
                                  slotProps={{
                                    input: {
                                      ...(store.settings.suffix_currency
                                        ? {
                                            endAdornment: (
                                              <InputAdornment position="start">
                                                {store.settings.suffix_currency}
                                              </InputAdornment>
                                            ),
                                          }
                                        : {
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                {store.settings.prefix_currency}
                                              </InputAdornment>
                                            ),
                                          }),
                                      type: 'number',
                                      inputMode: 'numeric',
                                      inputProps: { min: 0 },
                                    },
                                  }}
                                />
                              </Stack>
                              {user?.role?.name === 'Owner' && (
                                <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                                  <TextField
                                    fullWidth
                                    placeholder="0"
                                    label="Cost per item"
                                    sx={{ width: 'calc(50% - 12px)' }}
                                    value={variant.cost_per_item}
                                    onChange={(event) =>
                                      setVariations((preState) => {
                                        var newState = JSON.parse(JSON.stringify(preState));
                                        const { margin, profit } = calcMarginAndProfit(
                                          event.target.value,
                                          newState[index].regular_price,
                                          newState[index].sale_price
                                        );
                                        newState[index].cost_per_item = event.target.value;
                                        newState[index].margin = margin;
                                        newState[index].profit = profit;
                                        return newState;
                                      })
                                    }
                                    slotProps={{
                                      input: {
                                        ...(store.settings.suffix_currency
                                          ? {
                                              endAdornment: (
                                                <InputAdornment position="start">
                                                  {store.settings.suffix_currency}
                                                </InputAdornment>
                                              ),
                                            }
                                          : {
                                              startAdornment: (
                                                <InputAdornment position="start">
                                                  {store.settings.prefix_currency}
                                                </InputAdornment>
                                              ),
                                            }),
                                        type: 'number',
                                        inputMode: 'numeric',
                                        inputProps: { min: 0 },
                                      },
                                    }}
                                  />
                                  <Stack
                                    direction={'row'}
                                    justifyContent="space-around"
                                    alignItems={'center'}
                                    sx={{ width: '48%' }}
                                  >
                                    <Box>
                                      <LabelStyle>Margin</LabelStyle>
                                      <Typography textAlign={'center'} variant="body1">
                                        {variant.margin || '-'}%
                                      </Typography>
                                    </Box>
                                    <Box>
                                      <LabelStyle>Profit</LabelStyle>
                                      <Typography textAlign={'center'} variant="body1">
                                        {fCurrency(variant.profit || '') || '-'}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Stack>
                              )}

                              {product.is_tracking && product.has_variant && variant.inventory !== null && (
                                <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                                  <TextField
                                    fullWidth
                                    placeholder="0"
                                    sx={{ width: '48%' }}
                                    label="Number of stock"
                                    value={variant.number_of_stock}
                                    onChange={(event) =>
                                      setVariations((preState) => {
                                        var newState = JSON.parse(JSON.stringify(preState));
                                        newState[index].number_of_stock = event.target.value;
                                        return newState;
                                      })
                                    }
                                  />
                                  <TextField
                                    fullWidth
                                    placeholder="0"
                                    sx={{ width: '48%' }}
                                    label="Number of threshold"
                                    value={variant.threshold_stock}
                                    onChange={(event) =>
                                      setVariations((preState) => {
                                        var newState = JSON.parse(JSON.stringify(preState));
                                        newState[index].threshold_stock = event.target.value;
                                        return newState;
                                      })
                                    }
                                  />
                                </Stack>
                              )}

                              {/* <Stack direction={'row'} justifyContent="flex-end"></Stack> */}
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Stack>
                </Card>
              )}
            </Stack>
          </Collapse>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4, lg: 4 }}>
          <Stack spacing={2.5}>
            <Card sx={{ p: 2.5 }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1">Organize</Typography>

                <div>
                  <LabelStyle>Status</LabelStyle>
                  <RadioGroup
                    aria-label="status"
                    value={product.status}
                    name="radio-buttons-group"
                    onChange={(event) =>
                      setProduct((preState) => {
                        return { ...preState, status: event.target.value };
                      })
                    }
                    row
                  >
                    <Stack spacing={1} direction="row">
                      {STATUS_OPTIONS.map((status) => (
                        <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                      ))}
                    </Stack>
                  </RadioGroup>
                </div>

                {/* <RemoteAutocomplete
                  value={product.main_category?.name || ''}
                  onChange={(value, data) => {
                    if (data) {
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.main_category = data;
                        newState.sub_category = [];
                        return newState;
                      });
                    } else {
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.main_category = { name: value };
                        newState.sub_category = [];
                        return newState;
                      });
                    }
                  }}
                  required
                  remote="category/main/search/"
                  label={'Main Category'}
                />

                <RemoteAutocomplete
                  value={product.sub_category.map((val) => val?.name)}
                  multiple
                  create
                  onChange={(value, data) => {
                    if (data) {
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.sub_category = data;
                        return newState;
                      });
                    }
                  }}
                  remote={`category/sub/${product.main_category?.id || '0'}/search/`}
                  label={'Sub Category'}
                /> */}

                {/* <FormControl fullWidth>
                  <InputLabel id="city-select-label">Sub Category*</InputLabel>
                  <Select
                    labelId="SubCategory"
                    id="SubCategory"
                    required
                    value={product.sub_category?.id || ''}
                    label="Sub Category"
                    onChange={(event) => {
                      setProduct((preState) => {
                        return {
                          ...preState,
                          sub_category: categories
                            .filter((state) => state.id === product.main_category?.id)[0]
                            ?.sub_categories.filter((cate) => cate.id === event.target.value)[0],
                        };
                      });
                    }}
                  >
                    {categories
                      .filter((state) => state.id === product.main_category?.id)[0]
                      ?.sub_categories.map((val, index) => (
                        <MenuItem key={`${index}-sub`} value={val.id}>
                          {val.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl> */}

                {/* <RemoteAutocomplete
                  value={product.category}
                  onChange={(value) => {
                    setProduct((preState) => {
                      return { ...preState, category: value };
                    });
                  }}
                  required
                  remote="category/search/"
                  label={'Category'}
                /> */}

                {/* <RemoteAutocomplete
                  value={product.supplier_name}
                  onChange={(value) => {
                    setProduct((preState) => {
                      return { ...preState, supplier_name: value };
                    });
                  }}
                  remote="supplier/search/"
                  label={"Supplier"}
                /> */}

                <Autocomplete
                  multiple
                  freeSolo
                  value={product.tags}
                  onChange={(event, value) => {
                    setProduct((preState) => {
                      return { ...preState, tags: value };
                    });
                  }}
                  options={[].map((option) => option)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        sx={{
                          borderRadius: '8px ',
                        }}
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        label={option}
                      />
                    ))
                  }
                  renderInput={(params) => <TextField label="Tags" {...params} />}
                />

                {!product.has_variant && (
                  <TextField
                    fullWidth
                    label="Barcode"
                    value={product.barcode}
                    // onChange={(event) =>
                    //   setProduct((preState) => {
                    //     return { ...preState, barcode: event.target.value };
                    //   })
                    // }
                  />
                )}
              </Stack>
            </Card>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Create Product
            </LoadingButton>
          </Stack>
        </Grid2>

        {/* <Grid2 item lg={12} md={12} sm={12} xs={12}>
                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={loading}
                    >
                        Login
                    </LoadingButton>
                </Grid2> */}
      </Grid2>
    </form>
  );
}
const mapStateToProps = (state) => {
  return { store: state.auth.user.store, user: state.auth.user };
};

export default connect(mapStateToProps)(ProductNewForm);
