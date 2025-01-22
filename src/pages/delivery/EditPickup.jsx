import { useEffect, useState } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import DeliveryPickupForm, { initialDeliveryPickupData } from '../../components/pages/delivery/DeliveryPickupForm';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';

const EditPickup = () => {
  const [data, setData] = useState(initialDeliveryPickupData);
  const [isReady, setIsReady] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      getData();
    }
    return () => {};
  }, []);

  const getData = () => {
    const url = 'delivery-pickup/?id=' + params.id;
    axios.get(url).then(({ data }) => {
      setData(data);
      setIsReady(true);
    });
  };

  return (
    <Page title={'Edit Delivery Pickup Page'}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Edit Delivery pickup'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Delivery Pickup List',
                href: PATH_DASHBOARD.delivery.pickupList,
              },
              { name: 'Edit Delivery Pickup' },
            ]}
          />
          {isReady ? <DeliveryPickupForm data={data} type="Update" /> : <EditorSkeleton />}
        </Grid>
      </Grid>
    </Page>
  );
};

export default EditPickup;
