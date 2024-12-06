// @mui
import { Card, Skeleton, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export default function ListSkeleton() {
  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2} justifyContent={'space-between'} direction={'row'}>
        <Stack spacing={2} sx={{ pb: 3, width: '80%' }} direction={'row'}>
          <Skeleton variant="rounded" sx={{ width: '10%', height: 60 }} />
          <Skeleton variant="rounded" sx={{ width: '10%', height: 60 }} />
          <Skeleton variant="rounded" sx={{ width: '10%', height: 60 }} />
        </Stack>

        <Stack spacing={2} sx={{ pb: 3, width: '20%' }} direction={'row-reverse'}>
          <Skeleton variant="rounded" sx={{ width: '50%', height: 60 }} />
        </Stack>
      </Stack>
      <Skeleton variant="rounded" sx={{ height: 80 }} />

      <Stack spacing={2} sx={{ pt: 3 }} direction={'row'}>
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '15%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '35%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
      </Stack>
      <Stack spacing={2} sx={{ pt: 3 }} direction={'row'}>
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '15%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '35%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
      </Stack>
      <Stack spacing={2} sx={{ pt: 3 }} direction={'row'}>
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '15%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '35%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
      </Stack>
      <Stack spacing={2} sx={{ pt: 3, pb: 6 }} direction={'row'}>
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '15%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '35%', height: 60 }} />
        <Skeleton variant="rounded" sx={{ width: '25%', height: 60 }} />
      </Stack>
    </Card>
  );
}
