import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, BoxProps } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MEDIA_URL } from '../../config';
import smLogo from '../../assets/img/logo.png';

export default function Logo({ disabledLink = false, sx }) {
  const logo = (
    <Box
      component={'img'}
      sx={{ objectFit: 'cover', cursor: 'pointer', ...sx }}
      src={smLogo}
      onError={(event) => {
        event.target.src = `${MEDIA_URL}/media/default.png`;
      }}
    />
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}
