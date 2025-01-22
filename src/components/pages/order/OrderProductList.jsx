import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  IconButton,
  Tooltip,
  TextField,
  Stack,
} from '@mui/material';
import { useSelector } from 'react-redux';

import { fCurrency } from '../../../utils/formatNumber';
import Img from '../../common/Img';
import Iconify from '../../common/Iconify';
// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0),
  padding: theme.spacing(0.7),
  borderRadius: '10px',
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

function Incrementer({ available, quantity, onChangeQuantity }) {
  return (
    <Box sx={{ maxWidth: 120, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton
          size="small"
          color="inherit"
          onClick={() => {
            onChangeQuantity(quantity - 1);
          }}
          disabled={quantity <= 1}
        >
          <Icon icon={minusFill} width={16} height={16} />
        </IconButton>

        <Typography
          variant="body1"
          component={'input'}
          color="text.primary"
          value={quantity}
          size="small"
          type="number"
          onChange={(event) => {
            if (event.target.value && parseInt(event.target.value, 10) !== 0) {
              onChangeQuantity(event.target.value);
            } else {
              onChangeQuantity(1);
            }
          }}
          sx={{
            maxWidth: 35,
            padding: 0,
            outline: 'none',
            border: 'none',
            background: 'transparent',
            textAlign: 'center',
          }}
        />
        <IconButton
          size="small"
          color="inherit"
          onClick={() => {
            onChangeQuantity(quantity + 1);
          }}
          // disabled={quantity >= available}
        >
          <Icon icon={plusFill} width={16} height={16} />
        </IconButton>
      </IncrementerStyle>
      {/* <Typography variant="caption" sx={{ color: "text.secondary" }}>
        available: {available}
      </Typography> */}
    </Box>
  );
}

export default function CheckoutProductList({ products, onDelete, onChangeSalePrice, onChangeQuantity }) {
  const user = useSelector((state) => state.auth.user);

  const theme = useTheme();
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="left">Regular Price</TableCell>
            <TableCell align="left">Sale Price</TableCell>
            <TableCell align="left">Quantity</TableCell>
            <TableCell align="right">Total Price</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((product, index) => {
            const { name, price, image, quantity, subtotal } = product;
            return (
              <TableRow key={`${index}`}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Img
                      alt="product image"
                      src={image}
                      lightbox
                      sx={{
                        width: 55,
                        height: 55,
                        objectFit: 'cover',
                        marginRight: (theme) => theme.spacing(2),
                        borderRadius: (theme) => theme.shape.borderRadiusSm + 'px',
                      }}
                    />
                    <Box>
                      <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                        {name}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                          <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                            Discount:&nbsp;
                          </Typography>
                          -{fCurrency(product.discount)}
                          {user?.role?.name === 'Owner' && (
                            <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                              / profit: {fCurrency(product.profit)}
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body1">{fCurrency(product.price)}</Typography>
                </TableCell>

                <TableCell align="left">
                  <TextField
                    value={product.sale_price}
                    size="small"
                    type="number"
                    onChange={(event) => onChangeSalePrice(event.target.value, index)}
                    sx={{ maxWidth: 120 }}
                  />
                </TableCell>

                <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    onChangeQuantity={(quantity) => onChangeQuantity(quantity, index)}
                    available={0}
                  />
                </TableCell>

                <TableCell align="right">{fCurrency(subtotal)}</TableCell>

                <TableCell align="right">
                  <Tooltip title="Remove item">
                    <IconButton onClick={() => onDelete(index)}>
                      <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
