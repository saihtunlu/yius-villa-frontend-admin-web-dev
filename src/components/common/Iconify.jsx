// icons
import { Icon, IconifyIcon } from '@iconify/react';
// @mui
import { Box, BoxProps } from '@mui/material';
import { SxProps } from '@mui/system';

// ----------------------------------------------------------------------

// interface Props extends BoxProps {
//   sx?: SxProps;
//   icon: IconifyIcon | string;
// }

export default function Iconify({ icon, sx, width = 24, height = 24, ...other }) {
  return <Box component={Icon} icon={icon} sx={{ width, height, ...sx }} {...other} />;
}
