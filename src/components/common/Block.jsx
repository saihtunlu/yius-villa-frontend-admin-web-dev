import { ReactNode } from 'react';
// material
import { Card, CardHeader, Box, Typography } from '@mui/material';


export function Label({ title }) {
  return (
    <Typography variant="overline" component="p" gutterBottom sx={{ color: 'text.secondary' }}>
      {title}
    </Typography>
  );
}


export function Block({ title, sx, children }) {
  return (
    <Card sx={{ overflow: 'unset', position: 'unset', width: '100%' }}>
      {title && <CardHeader title={title} />}
      <Box
        sx={{
          p: 3,
          minHeight: 180,
          ...sx
        }}
      >
        {children}
      </Box>
    </Card>
  );
}
