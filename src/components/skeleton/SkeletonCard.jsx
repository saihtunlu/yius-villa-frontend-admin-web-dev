// @mui
import { Card, Skeleton, Stack } from "@mui/material";

// ----------------------------------------------------------------------

export default function SkeletonCard() {
  return (
    <Card>
      <Skeleton
        variant="rectangular"
        sx={{ paddingTop: "100%", height: "180px" }}
      />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Skeleton variant="text" sx={{ width: 0.5 }} />
        <Skeleton variant="text" sx={{ width: "100%", height: 30 }} />
      </Stack>
    </Card>
  );
}
