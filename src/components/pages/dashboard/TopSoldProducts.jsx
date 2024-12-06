// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';

// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../common/Label';
import Scrollbar from '../../common/Scrollbar';
import { TableHeadCustom } from '../../common/table';
import Img from '../../common/Img';

export default function TopSoldProducts({ title, subheader, tableData, tableLabels, ...other }) {
  return (
    <Card {...other}>
      <Stack sx={{ p: 2.5 }} spacing={1}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subheader}
        </Typography>
      </Stack>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row, index) => (
                <TopSoldProductRow key={row.id + '-' + index} index={index} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}

function TopSoldProductRow({ row, index }) {
  const theme = useTheme();

  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" alignItems="center">
          <Img
            lightbox
            alt={row.name}
            fullLink
            src={row.image}
            sx={{
              width: 55,
              height: 55,
              borderRadius: theme.shape.borderRadiusSm + 'px',
            }}
          />

          <Box sx={{ ml: 2 }}>
            <Typography component={'p'} variant="subtitle3">
              {row.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {fCurrency(row.price)}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{row.quantity} Sold</TableCell>

      <TableCell>{fCurrency(row.total)}</TableCell>

      <TableCell>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (index === 0 && 'primary') ||
            (index === 1 && 'info') ||
            (index === 2 && 'success') ||
            (index === 3 && 'warning') ||
            'secondary'
          }
        >
          Top {index + 1}
        </Label>
      </TableCell>
    </TableRow>
  );
}
