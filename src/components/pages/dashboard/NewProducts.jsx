import Slider from 'react-slick';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Button, CardContent, Typography } from '@mui/material';
import { CarouselDots } from '../../common/carousel';

// ----------------------------------------------------------------------

const CarouselImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  height: 280,
  objectFit: 'contain',
  [theme.breakpoints.up('xl')]: {
    height: 320,
  },
}));

function CarouselItem({ item }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CarouselImgStyle
        alt={item.name}
        src={item.images[0]?.image ? item.images[0]?.image : item.image || '/assets/img/default.png'}
      />
      <Box
        sx={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
          background: (theme) => `linear-gradient(0deg, ${alpha(theme.palette.grey[900], 0.72)}, transparent)`,
        }}
      />
      <CardContent
        sx={{
          left: 0,
          bottom: 0,
          maxWidth: '80%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.48 }}>
          New
        </Typography>
        <Typography noWrap variant="h5" sx={{ mt: 1, mb: 3 }}>
          {item.name}
        </Typography>
        <Button to={`/product/${item.slug}/edit`} variant="contained" component={RouterLink}>
          View
        </Button>
      </CardContent>
    </Box>
  );
}

export default function NewProducts({ products }) {
  const theme = useTheme();

  const settings = {
    speed: 1000,
    dots: true,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: Boolean(theme.direction === 'rtl'),
    ...CarouselDots({ position: 'absolute', right: 24, bottom: 24 }),
  };

  return (
    <Card>
      <Slider {...settings}>
        {products.map((product) => (
          <CarouselItem key={product.name} item={product} />
        ))}
      </Slider>
    </Card>
  );
}
