import { Card, Stack, CardHeader, Typography, CardContent, styled } from '@mui/material';
import Avatar from '../../common/Avatar';

export default function CustomerDetail({ initialOrder }) {
  return (
    <>
      <Card>
        <CardHeader title="Customer Detail" />

        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Name
              </Typography>

              <Stack direction={'row'} alignItems={'center'}>
                <Avatar sx={{ width: 25, height: 25, mr: '5px' }} user={initialOrder.customer} />
                <Typography variant="subtitle3">{initialOrder.address?.receiver || '-'}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Phone number
              </Typography>
              <Typography variant="subtitle3">{initialOrder.address?.phone || '-'}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                State
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.address?.state?.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                City
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.address?.city?.split('_').join(' ') || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Street Address
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder?.address?.address || '-'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Order Note:
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.note || '-'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
