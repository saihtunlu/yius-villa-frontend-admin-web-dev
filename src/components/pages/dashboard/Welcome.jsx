// material
import { styled } from '@mui/material/styles';
import { Typography, Card, Button, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import MotivationIllustration from '../../../assets/illustrations/illustration_motivation';
import { PATH_DASHBOARD } from '../../../router/paths';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.lighter,
  [theme.breakpoints.up('md')]: {
    height: '100%',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default function Welcome(props) {
  const { storeName, caption } = props;
  return (
    <RootStyle>
      <CardContent
        sx={{
          color: 'grey.800',
          p: { md: 0 },
          pl: { md: 5 },
        }}
      >
        <Typography gutterBottom variant="h4">
          Welcome back,
          <br /> {storeName}!
        </Typography>

        <Typography variant="body2" sx={{ pb: { xs: 3, xl: 5 }, maxWidth: 480, mx: 'auto' }}>
          {caption}
        </Typography>
        <Button to={PATH_DASHBOARD.order.create} variant="contained" component={RouterLink}>
          Add new order
        </Button>
      </CardContent>

      <MotivationIllustration
        sx={{
          p: 3,
          width: 360,
          margin: { xs: 'auto', md: 'inherit' },
        }}
      />
    </RootStyle>
  );
}
