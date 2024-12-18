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
          Welcome, {storeName}!
        </Typography>

        {caption}
        <Button to={PATH_DASHBOARD.order.create} variant="contained" sx={{ mt: 2.5 }} component={RouterLink}>
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
