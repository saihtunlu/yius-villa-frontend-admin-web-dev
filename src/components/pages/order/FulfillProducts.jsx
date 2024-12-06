import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2 as Grid,
  InputAdornment,
  Typography,
  Box,
  Stack,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Icon } from '@iconify/react';
import { useState, useEffect, useRef } from 'react';
import Img from '../../common/Img';
import { fCurrency } from '../../../utils/formatNumber';

const FulfillProducts = (props) => {
  const { onChange, initialProducts, sid, pendingTask } = props;
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleUpdateFulfillment = () => {
    setUpdating(true);
    const payload = {
      sid,
      products,
    };
    axios
      .put('sale/fulfill/', { data: payload })
      .then(({ data }) => {
        setOpen(false);
        setUpdating(false);
        onChange(data);
      })
      .catch(() => {
        setOpen(false);
        setUpdating(false);
      });
  };
  // handlers
  const handleClickOpen = () => () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const showBtn = pendingTask.includes('inspection');
  return (
    <div>
      {showBtn && (
        <Button
          variant="text"
          onClick={handleClickOpen()}
          size="small"
          startIcon={<Icon icon={'lucide:package-check'} />}
        >
          Add fulfill
        </Button>
      )}

      <Dialog
        open={open}
        fullWidth
        maxWidth={'sm'}
        id="fulfill-product-dialog"
        onClose={handleClose}
        aria-labelledby="Fulfill"
        aria-describedby="FulfillProducts"
      >
        <DialogTitle variant="subtitle1" id="FulfillProducts-library">
          Fulfill Product
        </DialogTitle>
        <DialogContent dividers sx={{ pb: 0 }}>
          <Grid container spacing={0}>
            <Grid size={12}>
              {products.map((product, index) => {
                const labelId = `fulfill-product-${index}`;
                return (
                  <Stack direction={'row'} key={labelId} justifyContent={'space-between'} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Img
                        alt="product image"
                        src={product.image}
                        sx={{
                          width: 55,
                          height: 55,
                          objectFit: 'cover',
                          marginRight: (theme) => theme.spacing(2),
                          borderRadius: (theme) => theme.shape.borderRadiusSm + 'px',
                        }}
                      />
                      <Box>
                        <Typography noWrap variant="subtitle3" sx={{ maxWidth: 240 }}>
                          {product.name}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="caption">
                            <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                              price:&nbsp;
                            </Typography>
                            {fCurrency(product.price)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <TextField
                      label="Fulfilled"
                      sx={{ width: '150px' }}
                      slotProps={{
                        input: {
                          endAdornment: <InputAdornment position="end">of {product.quantity}</InputAdornment>,
                          type: 'number',
                          inputMode: 'numeric',
                          inputProps: { min: 0, max: product.quantity },
                        },
                      }}
                      value={product.number_of_fulfilled}
                      onChange={(event) =>
                        setProducts((preState) => {
                          var newState = JSON.parse(JSON.stringify(preState));
                          newState[index].number_of_fulfilled = event.target.value;
                          newState[index].is_fulfilled =
                            parseInt(event.target.value, 10) === parseInt(newState[index].quantity, 10);
                          return newState;
                        })
                      }
                    />
                  </Stack>
                );
              })}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="black" variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            variant={'contained'}
            color="black"
            onClick={handleUpdateFulfillment}
            autoFocus
            loading={updating}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FulfillProducts;
