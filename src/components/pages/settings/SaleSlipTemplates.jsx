import { Stack, Grid2 as Grid, Card, Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';

import Img from '../../common/Img';
import Label from '../../common/Label';
import axios from '../../../utils/axios';
import SkeletonCard from '../../skeleton/SkeletonCard';
import { INITIAL_STORE, updateStore } from '../../../redux/slices/store';

function SaleSlipTemplate(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { store } = props;
  const [SaleSlipTemplates, setSaleSlipTemplates] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // effects
  useEffect(() => {
    getSaleSlipTemplates();
    return () => {};
  }, []);

  const getSaleSlipTemplates = () => {
    const url = 'printing/templates/?type=sale-slip';
    axios.get(url).then(({ data }) => {
      setSaleSlipTemplates(data);
      setIsReady(true);
    });
  };

  // handlers
  const updateSaleSlipTemplate = (filePath) => {
    var templatePath = filePath;
    if (filePath.includes('http')) {
      templatePath = '/media' + filePath.split('media')[1];
    }
    const storeData = { ...store, settings: { ...store.settings, sale_slip: templatePath } };
    updateStore(storeData).then(() => {
      enqueueSnackbar('Update success', { variant: 'success' });
    });
  };

  // renders
  const TemplateCard = ({ template }) => {
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
            {template.size}
          </Label>

          <Img lightbox alt={template.name} src={template.preview} ratio="1/1" />
        </Box>

        <Stack spacing={1} sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {template.name}
          </Typography>

          {'/media' + template.file.split('media')[1] === store.settings.sale_slip ? (
            <Button variant="outlined" fullWidth color="black">
              Selected
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                updateSaleSlipTemplate(template.file);
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
          {(!isReady ? [...Array(12)] : SaleSlipTemplates).map((template, index) =>
            template ? (
              <TemplateCard key={`${template.id}-invoice-template`} template={template} />
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
export default connect(mapStateToProps)(SaleSlipTemplate);
