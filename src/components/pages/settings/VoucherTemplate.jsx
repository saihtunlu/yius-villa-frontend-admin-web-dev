import { Stack, Grid2 as Grid, Card, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';

import Img from '../../common/Img';
import Label from '../../common/Label';
import axios from '../../../utils/axios';
import SkeletonCard from '../../skeleton/SkeletonCard';
import { INITIAL_STORE, updateStore } from '../../../redux/slices/store';

function VoucherTemplate(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { store } = props;
  const [voucherTemplates, setVoucherTemplates] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // effects
  useEffect(() => {
    getVoucherTemplates();
    return () => {};
  }, []);

  const getVoucherTemplates = () => {
    const url = 'printing/templates/?type=voucher';
    axios.get(url).then(({ data }) => {
      setVoucherTemplates(data);
      setIsReady(true);
    });
  };

  // handlers
  const updateVoucherTemplate = (filePath) => {
    var payrollPath = filePath;
    if (filePath.includes('http')) {
      payrollPath = '/media' + filePath.split('media')[1];
    }
    const storeData = { ...store, settings: { ...store.settings, voucher: payrollPath } };
    updateStore(storeData).then(() => {
      enqueueSnackbar('Update success', { variant: 'success' });
    });
  };

  // renders
  const TemplateCard = ({ voucherTemplate }) => {
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
            {voucherTemplate.size}
          </Label>

          <Img lightbox alt={voucherTemplate.name} src={voucherTemplate.preview} ratio="1/1" />
        </Box>

        <Stack spacing={1} sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {voucherTemplate.name}
          </Typography>

          {'/media' + voucherTemplate.file.split('media')[1] === store.settings.voucher ? (
            <Button variant="outlined" fullWidth color="black">
              Selected
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                updateVoucherTemplate(voucherTemplate.file);
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
          {(!isReady ? [...Array(12)] : voucherTemplates).map((voucherTemplate, index) =>
            voucherTemplate ? (
              <TemplateCard key={`${voucherTemplate.id}-invoice-template`} voucherTemplate={voucherTemplate} />
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
export default connect(mapStateToProps)(VoucherTemplate);
