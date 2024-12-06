// material
import { Grid2, Skeleton } from '@mui/material';

const SettingSkeleton = () => {
  return (
    <Grid2 container spacing={2.5}>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <Skeleton
          variant="rectangular"
          sx={{
            borderRadius: (theme) => theme.shape.borderRadiusMd + 'px',
          }}
          height={380}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 8 }}>
        <Skeleton
          variant="rectangular"
          sx={{
            borderRadius: (theme) => theme.shape.borderRadiusMd + 'px',
          }}
          height={380}
        />
      </Grid2>
    </Grid2>
  );
};

export default SettingSkeleton;
