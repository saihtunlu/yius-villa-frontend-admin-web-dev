import { useEffect } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import DeliveryPickupForm from '../../components/pages/delivery/DeliveryPickupForm';

const CreatePickup = () => {
  return (
    <Page title={'Create Delivery Pickup Page'} roleBased role={{ name: 'Pickup', type: 'create' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Create Delivery pickup'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Delivery Pickup List',
                href: PATH_DASHBOARD.delivery.pickupList,
              },
              { name: 'New Delivery Pickup' },
            ]}
          />
          <DeliveryPickupForm type="Create" />
        </Grid>
      </Grid>
    </Page>
  );
};

export default CreatePickup;
