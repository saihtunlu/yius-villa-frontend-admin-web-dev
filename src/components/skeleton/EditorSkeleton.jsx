// material
import { Grid, Skeleton, Stack } from "@mui/material";

const EditorSkeleton = () => {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} md={8} lg={8}>
        <Stack spacing={3}>
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadiusMd + "px",
            }}
            height={380}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadiusMd + "px",
            }}
            height={250}
          />
        </Stack>
      </Grid>

      <Grid item lg={4} md={4} sm={12} xs={12}>
        <Stack spacing={3}>
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadiusMd + "px",
            }}
            height={280}
          />
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: (theme) => theme.shape.borderRadiusMd + "px",
            }}
            height={280}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditorSkeleton;
