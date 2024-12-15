// @mui
import { Box, Link, Card, CardHeader, Typography, Stack, useTheme } from '@mui/material';
// utils
import Scrollbar from '../../common/Scrollbar';
import Avatar from '../../common/Avatar';
import Label from '../../common/Label';
import { fCurrency } from '../../../utils/formatNumber';
import TextMaxLine from '../../common/TextMaxLine';

export default function TopSalesmen({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <Stack sx={{ p: 2.5, pb: 0 }} spacing={1}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subheader}
        </Typography>
      </Stack>
      <Scrollbar>
        <Stack spacing={2.5} sx={{ p: 2.5 }}>
          {list.map((salesmen, index) => (
            <SalesmenItem key={salesmen.id + '-' + index} salesmen={salesmen} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

function SalesmenItem({ salesmen }) {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={1}>
      <Avatar
        user={{ first_name: salesmen.exported_by }}
        sx={{ width: 35, height: 35, borderRadius: '100%', flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <TextMaxLine line={1} variant="subtitle3" sx={{ color: 'text.primary' }}>
          {salesmen.exported_by}
        </TextMaxLine>

        <Stack direction="row">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Total sales from {salesmen.count} orders: {fCurrency(salesmen.total)}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
