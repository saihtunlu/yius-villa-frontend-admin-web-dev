// @mui
import { Box, Link, Card, CardHeader, Typography, Stack, useTheme } from '@mui/material';
// utils
import Scrollbar from '../../common/Scrollbar';
import Avatar from '../../common/Avatar';
import Label from '../../common/Label';
import { fCurrency } from '../../../utils/formatNumber';
import TextMaxLine from '../../common/TextMaxLine';

export default function TopCustomers({ title, subheader, list, ...other }) {
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
          {list.map((customer, index) => (
            <CustomerItem key={customer.id + '-' + index} customer={customer} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  );
}

function CustomerItem({ customer }) {
  const theme = useTheme();
  const str = customer.customer__address__city?.split('(')[1] || null;
  const city = str ? `${str.substring(0, str.length - 1)}မြို့` : 'Unknown';

  return (
    <Stack direction="row" spacing={1}>
      <Avatar
        user={{ first_name: customer.customer__name }}
        sx={{ width: 35, height: 35, borderRadius: '100%', flexShrink: 0 }}
      />

      <Box sx={{ flexGrow: 1, minWidth: 200 }}>
        <TextMaxLine line={1} variant="subtitle3" sx={{ color: 'text.primary' }}>
          {customer.customer__name}
        </TextMaxLine>

        <Stack direction="row">
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {customer.count} order{customer.count > 1 && 's'} total purchased for {fCurrency(customer.price)}
          </Typography>
        </Stack>
      </Box>
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={city !== 'Unknown' ? 'success' : 'secondary'}
      >
        {city}
      </Label>
    </Stack>
  );
}
