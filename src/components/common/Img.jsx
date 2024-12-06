import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Box } from '@mui/material';
import { MEDIA_URL } from '../../config';
import LightboxModal from './LightboxModal';
// export type ImageRato =
//   | "4/3"
//   | "3/4"
//   | "6/4"
//   | "4/6"
//   | "16/9"
//   | "9/16"
//   | "21/9"
//   | "9/21"
//   | "1/1";

// interface IImage extends IProps {
//   src: string;
//   alt: string;
//   fullLink?: boolean;
//   sx?: SxProps<Theme>;
//   ratio?: ImageRato;
//   disabledEffect?: boolean;
// }

export default function Img({
  ratio,
  lightbox = false,
  disabledEffect = false,
  effect = 'blur',
  src = '/assets/img/default.png',
  fullLink,
  sx,
  ...other
}) {
  const lightBoxImages = [src?.includes('http') ? src : MEDIA_URL + src];
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedLightBoxImage, setSelectedLightBoxImage] = useState(0);

  if (ratio) {
    return (
      <Box
        component="span"
        onClick={() => {
          if (lightbox) {
            setOpenLightbox(true);
          }
        }}
        sx={{
          width: 1,
          lineHeight: 0,
          display: 'block',
          overflow: 'hidden',
          position: 'relative',
          pt: getRatio(ratio),
          '& .wrapper': {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            lineHeight: 0,
            position: 'absolute',
            backgroundSize: 'cover !important',
          },
          ...sx,
        }}
      >
        <Box
          component={LazyLoadImage}
          wrapperClassName="wrapper"
          effect={disabledEffect ? undefined : effect}
          placeholderSrc={'/assets/img/placeholder.svg'}
          sx={{ width: 1, height: 1, objectFit: 'cover' }}
          src={src.includes('http') ? src : MEDIA_URL + src}
          onError={(event) => {
            event.target.src = `${MEDIA_URL}/assets/img/default.png`;
          }}
          {...other}
        />
        <LightboxModal
          images={lightBoxImages}
          mainSrc={lightBoxImages[0]}
          photoIndex={selectedLightBoxImage}
          isOpen={openLightbox}
          onCloseRequest={() => setOpenLightbox(false)}
          setPhotoIndex={setSelectedLightBoxImage}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        component="span"
        sx={{
          lineHeight: 0,
          display: 'block',
          overflow: 'hidden',
          '& .wrapper': {
            width: 1,
            height: 1,
            backgroundSize: 'cover !important',
          },
          ...sx,
        }}
      >
        <Box
          onClick={() => {
            if (lightbox) {
              setOpenLightbox(true);
            }
          }}
          component={LazyLoadImage}
          wrapperClassName="wrapper"
          effect={disabledEffect ? undefined : effect}
          placeholderSrc={'/assets/img/placeholder.svg'}
          sx={{ width: 1, height: 1, objectFit: 'cover', cursor: 'pointer' }}
          src={src.includes('http') ? src : MEDIA_URL + src}
          onError={(event) => {
            event.target.src = `${MEDIA_URL}/assets/img/default.png`;
          }}
          {...other}
        />
      </Box>

      <LightboxModal
        images={lightBoxImages}
        mainSrc={lightBoxImages[0]}
        photoIndex={selectedLightBoxImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
        setPhotoIndex={setSelectedLightBoxImage}
      />
    </>
  );
}

function getRatio(ratio = '1/1') {
  return {
    '4/3': 'calc(100% / 4 * 3)',
    '3/4': 'calc(100% / 3 * 4)',
    '6/4': 'calc(100% / 6 * 4)',
    '4/6': 'calc(100% / 4 * 6)',
    '16/9': 'calc(100% / 16 * 9)',
    '9/16': 'calc(100% / 9 * 16)',
    '21/9': 'calc(100% / 21 * 9)',
    '9/21': 'calc(100% / 9 * 21)',
    '1/1': '100%',
  }[ratio];
}
