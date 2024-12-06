import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import { fCurrency } from '../../../utils/formatNumber';
import Img from '../../common/Img';
import Iconify from '../../common/Iconify';
// ----------------------------------------------------------------------

const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.grey[500_32]}`,
}));

function Incrementer({ available, quantity, onIncrease, onDecrease }) {
  return (
    <Box sx={{ width: 96, textAlign: 'right' }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <Icon icon={minusFill} width={16} height={16} />
        </IconButton>
        {quantity}
        <IconButton
          size="small"
          color="inherit"
          onClick={onIncrease}
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

export default function CheckoutProductList({ products, onDelete, onIncreaseQuantity, onDecreaseQuantity }) {
  return (
    <TableContainer sx={{ minWidth: 720 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
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
                        <Typography variant="caption">
                          <Typography component="span" variant="caption" sx={{ color: 'text.secondary' }}>
                            price:&nbsp;
                          </Typography>
                          {fCurrency(price)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="left">
                  <Incrementer
                    quantity={quantity}
                    // available={}
                    onDecrease={() => onDecreaseQuantity(index)}
                    onIncrease={() => onIncreaseQuantity(index)}
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
