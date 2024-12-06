import { Stack, Grid2 as Grid, Card, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';

import { updateStore } from '../../../redux/actions';
import Img from '../../common/Img';
import Label from '../../common/Label';
import axios from '../../../utils/axios';
import SkeletonCard from '../../skeleton/SkeletonCard';
import { INITIAL_STORE } from '../../../redux/reducer/store';

function PackingSlipTemplate(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { store } = props;
  const [PackingSlipTemplates, setPackingSlipTemplates] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // effects
  useEffect(() => {
    getPackingSlipTemplates();
    return () => {};
  }, []);

  const getPackingSlipTemplates = () => {
    const url = 'printing/templates/?type=packing-slip';
    axios.get(url).then(({ data }) => {
      setPackingSlipTemplates(data);
      setIsReady(true);
    });
  };

  // handlers
  const updatePackingSlipTemplate = (filePath) => {
    var packingSlipPath = filePath;
    if (filePath.includes('http')) {
      packingSlipPath = '/media' + filePath.split('media')[1];
    }
    const storeData = { ...store, settings: { ...store.settings, packing_slip: packingSlipPath } };
    updateStore(storeData).then(() => {
      enqueueSnackbar('Update success', { variant: 'success' });
    });
  };

  // renders
  const InvoiceCard = ({ PackingSlipTemplate }) => {
    return (
      <Card>
        <Box sx={{ position: 'relative', cursor: 'pointer' }}>
          <Label
            variant="filled"
            color={'success'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {PackingSlipTemplate.size}
          </Label>

          <Img lightbox alt={PackingSlipTemplate.name} src={PackingSlipTemplate.preview} ratio="1/1" />
        </Box>

        <Stack spacing={1} sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {PackingSlipTemplate.name}
          </Typography>

          {'/media' + PackingSlipTemplate.file.split('media')[1] === store.settings.packing_slip ? (
            <Button variant="outlined" fullWidth color="black">
              Selected
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                updatePackingSlipTemplate(PackingSlipTemplate.file);
              }}
              color="primary"
            >
              Select
            </Button>
          )}
        </Stack>
      </Card>
    );
  };
  return (
    <Grid container spacing={2.5}>
      <Grid size={12}>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(5, 1fr)',
              lg: 'repeat(7, 1fr)',
            },
          }}
        >
          {(!isReady ? [...Array(12)] : PackingSlipTemplates).map((PackingSlipTemplate, index) =>
            PackingSlipTemplate ? (
              <InvoiceCard
                key={`${PackingSlipTemplate.id}-invoice-template`}
                PackingSlipTemplate={PackingSlipTemplate}
              />
            ) : (
              <SkeletonCard key={index} />
            )
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
const mapStateToProps = (state) => ({
  store: state.auth?.user?.store || INITIAL_STORE,
});
export default connect(mapStateToProps)(PackingSlipTemplate);
