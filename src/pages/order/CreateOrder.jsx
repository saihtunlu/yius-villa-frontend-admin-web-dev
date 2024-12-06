import { useEffect } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import OrderNewForm from '../../components/pages/order/OrderNewForm';
// import { toggleSidebar } from '../../redux/actions';
// import useCollapseDrawer from '../../hooks/useCollapseDrawer';

const CreateOrder = () => {
  // // effects
  // useEffect(() => {
  //   toggleSidebar('collapse');
  //   return () => {};
  // }, []);

  // const { collapseClick, onToggleCollapse } = useCollapseDrawer();
  // useEffect(() => {
  //   if (!collapseClick) {
  //     onToggleCollapse();
  //   }
  //   return () => {
  //     if (collapseClick) {
  //       onToggleCollapse();
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [collapseClick]);

  return (
    <Page title={'Create Order Page'} roleBased role={{ name: 'Order', type: 'create' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Create a new order'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Orders',
                href: PATH_DASHBOARD.order.list,
              },
              { name: 'New order' },
            ]}
          />
          <OrderNewForm />
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(CreateOrder);
