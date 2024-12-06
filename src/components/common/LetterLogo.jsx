import { Box } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MEDIA_URL } from '../../config';
import whiteTextLogo from '../../assets/img/logo-white-text.png';
import blackTextLogo from '../../assets/img/logo-black-text.png';
import useSettings from '../../hooks/useSettings';

export default function LetterLogo({ disabledLink = false, width, height, sx }) {
  const { themeMode } = useSettings();
  const logo = (
    <Box sx={{ width: width || 155, height: height || 60, ...sx }}>
      {themeMode === 'dark' ? (
        <Box component={'img'} sx={{ objectFit: 'cover', cursor: 'pointer', ...sx }} src={whiteTextLogo} />
      ) : (
        <Box component={'img'} sx={{ objectFit: 'cover', cursor: 'pointer', ...sx }} src={blackTextLogo} />
      )}
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href="https://salespoint.com.mm/" target="_blank">
      {logo}
    </a>
  );
}
