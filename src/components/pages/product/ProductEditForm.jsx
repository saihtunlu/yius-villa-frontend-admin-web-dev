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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Box,
  Button,
  Collapse,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingButton from '@mui/lab/LoadingButton';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../../router/paths';

import QuillEditor from '../../common/quill';
import Media from '../../common/Media';
import { editProduct } from '../../../redux/actions';
import Iconify from '../../common/Iconify';
import { getInitialVariation } from '../../../utils/getVariation';
import { fCurrency } from '../../../utils/formatNumber';
import BarcodePrint from './BarcodePrint';
import Label from '../../common/Label';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const STATUS_OPTIONS = ['Draft', 'Active', 'Archived'];

function ProductEditForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { initialProduct, store, user } = props;
  const theme = useTheme();

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState(initialProduct.variations);
  const [removedVariations, setRemovedVariations] = useState([]);
  const [isAddingNewVariation, setIsAddingNewVariation] = useState(false);
  const [newVariation, setNewVariation] = useState(getInitialVariation(initialProduct));
  const [newVariationError, setNewVariationError] = useState({
    show: false,
    message: '',
  });

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...product,
      ...(product.has_variant && { variations }), // Only include variations if product has variants
    };
    editProduct(payload, removedVariations)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Update success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.product.list);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Side effect: Update variation name when options change
  useEffect(() => {
    const name = newVariation.options
      .map((option, index) => (index !== newVariation.options.length - 1 ? `${option.name} / ` : option.name))
      .join('');

    const variationExists = product.variations.some((variation) => variation.name === name);
    if (variationExists) {
      setNewVariationError({
        show: true,
        message: `The variation '${name}' already exists. Please change at least one option value.`,
      });
    } else {
      setNewVariation((prevState) => ({ ...prevState, name }));
      setNewVariationError({ show: false });
    }
  }, [newVariation.options]);

  // Side effect: Calculate margin and profit
  useEffect(() => {
    const { profit, margin } = calcMarginAndProfit(product.cost_per_item, product.regular_price, product.sale_price);
    setProduct((prevState) => ({ ...prevState, profit, margin }));
  }, [product.sale_price, product.regular_price, product.cost_per_item]);

  // Price Calculation Logic
  const calcMarginAndProfit = (cost_per_item, regular_price, sale_price) => {
    if (cost_per_item && (sale_price > 0 || regular_price)) {
      const price = sale_price > 0 ? sale_price : regular_price;
      const profit = price - cost_per_item;
      const margin = ((profit / price) * 100).toFixed(2);
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
                label="Product Name"
                required
                value={product.name}
                onChange={(event) =>
                  setProduct((preState) => {
                    return { ...preState, name: event.target.value };
                  })
                }
              />
              <div>
                <LabelStyle>Description</LabelStyle>
                <QuillEditor
                  simple
                  id="product-description"
                  value={product.description}
                  onKeyUp={(e) => {
                    setProduct((preState) => {
                      return { ...preState, description: e.target.innerHTML };
                    });
                  }}
                />
              </div>

              <FormControlLabel
                control={<Switch checked={product.has_variant} inputProps={{ 'aria-label': 'controlled' }} />}
                label=" This product has multi options, like different size and color "
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={product.is_tracking}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) => {
                      setProduct((preState) => {
                        return {
                          ...preState,
                          is_tracking: event.target.checked,
                        };
                      });
                    }}
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

                {user.is_superadmin && (
                  <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
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

          {product.has_variant && (
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
                          '&.Mui-expanded .MuiAccordionSummary-content': {
                            marginBottom: '12px',
                            marginTop: '12px !important',
                          },
                        }}
                        expandIcon={
                          <IconButton size="small">
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
                          <Stack direction={'row'} justifyContent={'center'}>
                            <Typography>{variant.name}</Typography>
                            {variant.sold_out !== 0 && (
                              <Label
                                key="pending-task"
                                sx={{ ml: 2 }}
                                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                                color={'success'}
                                startIcon={<Iconify icon={'solar:cart-check-bold-duotone'} />}
                              >
                                {variant.sold_out} psc sold out
                              </Label>
                            )}
                          </Stack>
                          <IconButton
                            color={'error'}
                            onClick={() => {
                              setRemovedVariations((preState) => {
                                return [...preState, variations[index].id];
                              });
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

                            <BarcodePrint
                              price={variant.sale_price || variant.regular_price}
                              value={variant.barcode}
                              onChangeValue={(event) =>
                                setVariations((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState[index].barcode = event.target.value;
                                  return newState;
                                })
                              }
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

                          {user.is_superadmin && (
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
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
                <Box>
                  <Button
                    size="small"
                    startIcon={<Iconify icon="mynaui:plus-solid" />}
                    onClick={() => {
                      setIsAddingNewVariation(true);
                    }}
                  >
                    Add new variation
                  </Button>
                </Box>

                <Collapse sx={{ mt: 0 + ' !important' }} in={isAddingNewVariation}>
                  <Box
                    sx={{
                      padding: 2.5,
                      mt: 2.5,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <Stack spacing={2.5}>
                      <Typography variant="subtitle1">Add new variation</Typography>

                      <Stack spacing={2.5}>
                        <Media
                          initialSelected={[{ image: newVariation.image }]}
                          single
                          caption=""
                          onChange={(data) => {
                            setNewVariation((preState) => {
                              return { ...preState, image: data[0]?.full_url };
                            });
                          }}
                        />
                        <Collapse in={newVariationError.show}>
                          <Alert severity="error">{newVariationError.message}</Alert>
                        </Collapse>

                        {newVariation.options.map((option, optionIndex) => {
                          return (
                            <Autocomplete
                              key={optionIndex + '-option-value'}
                              freeSolo
                              fullWidth
                              onChange={(_, value) => {
                                setNewVariation((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.options[optionIndex].name = value;
                                  return { ...newState };
                                });
                              }}
                              disableClearable
                              value={option.name}
                              inputValue={option.name}
                              onInputChange={(_, value) => {
                                setNewVariation((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.options[optionIndex].name = value;
                                  return { ...newState };
                                });
                              }}
                              options={product.options
                                .filter((opt) => opt.name === option.option_name)[0]
                                ?._values.map((val) => val.name)}
                              renderInput={(params) => <TextField {...params} label={option.option_name || '-'} />}
                            />
                          );
                        })}
                        <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                          <TextField
                            fullWidth
                            label="Name"
                            value={newVariation.name}
                            onChange={(event) =>
                              setNewVariation((preState) => {
                                return {
                                  ...preState,
                                  name: event.target.value,
                                };
                              })
                            }
                          />
                          <TextField
                            fullWidth
                            label="Barcode"
                            value={newVariation.barcode}
                            onChange={(event) =>
                              setNewVariation((preState) => {
                                return {
                                  ...preState,
                                  barcode: event.target.value,
                                };
                              })
                            }
                          />
                        </Stack>

                        <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                          <TextField
                            fullWidth
                            placeholder="0"
                            label="Regular Price"
                            value={newVariation.regular_price}
                            onChange={(event) =>
                              setNewVariation((preState) => {
                                return {
                                  ...preState,
                                  regular_price: event.target.value,
                                };
                              })
                            }
                            slotProps={{
                              inputProps: {
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
                            value={newVariation.sale_price}
                            onChange={(event) =>
                              setNewVariation((preState) => {
                                return {
                                  ...preState,
                                  sale_price: event.target.value,
                                };
                              })
                            }
                            slotProps={{
                              inputProps: {
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
                        {user.is_superadmin && (
                          <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                            <TextField
                              fullWidth
                              placeholder="0"
                              label="Cost per item"
                              sx={{ width: '48%' }}
                              value={newVariation.cost_per_item}
                              onChange={(event) =>
                                setNewVariation((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  const { margin, profit } = calcMarginAndProfit(
                                    event.target.value,
                                    newState.regular_price,
                                    newState.sale_price
                                  );
                                  newState.cost_per_item = event.target.value;
                                  newState.margin = margin;
                                  newState.profit = profit;
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
                                  {newVariation.margin || '-'}%
                                </Typography>
                              </Box>
                              <Box>
                                <LabelStyle>Profit</LabelStyle>
                                <Typography textAlign={'center'} variant="body1">
                                  {fCurrency(newVariation.profit || '') || '-'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        )}
                        {product.is_tracking && product.has_variant && (
                          <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }}>
                            <TextField
                              fullWidth
                              placeholder="0"
                              sx={{ width: '48%' }}
                              label="Number of stock"
                              value={newVariation.number_of_stock}
                              onChange={(event) =>
                                setNewVariation((preState) => {
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
                              value={newVariation.threshold_stock}
                              onChange={(event) =>
                                setNewVariation((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.threshold_stock = event.target.value;
                                  return newState;
                                })
                              }
                            />
                          </Stack>
                        )}
                      </Stack>

                      <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                        <Button
                          color="inherit"
                          variant="outlined"
                          onClick={() => {
                            setIsAddingNewVariation(false);
                            setNewVariation(getInitialVariation(product));
                          }}
                        >
                          Cancel
                        </Button>
                        <LoadingButton
                          variant="contained"
                          color="black"
                          onClick={() => {
                            setIsAddingNewVariation(false);
                            setVariations((preState) => {
                              var newState = JSON.parse(JSON.stringify(preState));
                              return [...newState, newVariation];
                            });
                          }}
                        >
                          Save Change
                        </LoadingButton>
                      </Stack>
                    </Stack>
                  </Box>
                </Collapse>
              </Stack>
            </Card>
          )}
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
                        return newState;
                      });
                    } else {
                      setProduct((preState) => {
                        var newState = JSON.parse(JSON.stringify(preState));
                        newState.main_category = { name: value };
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
                        {...getTagProps({ index })}
                        key={option}
                        size="small"
                        sx={{
                          borderRadius: '8px ',
                        }}
                        label={option}
                      />
                    ))
                  }
                  renderInput={(params) => <TextField label="Tags" {...params} />}
                />
                {!product.has_variant && (
                  <BarcodePrint
                    price={product.sale_price || product.regular_price}
                    value={product.barcode}
                    onChangeValue={(event) =>
                      setProduct((preState) => {
                        return { ...preState, barcode: event.target.value };
                      })
                    }
                  />
                )}
              </Stack>
            </Card>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Save Changes
            </LoadingButton>
          </Stack>
        </Grid2>
      </Grid2>
    </form>
  );
}
const mapStateToProps = (state) => {
  return { store: state.auth.user.store, user: state.auth.user };
};

export default connect(mapStateToProps)(ProductEditForm);
