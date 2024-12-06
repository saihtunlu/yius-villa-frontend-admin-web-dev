// material
import { Grid2, Skeleton } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Grid2 size={12}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Skeleton variant="rounded" height={280} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={280} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rounded" height={220} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rounded" height={220} />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rounded" height={220} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 3 }}>
          <Skeleton variant="rounded" height={220} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6, lg: 4 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6, lg: 8 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default DashboardSkeleton;
