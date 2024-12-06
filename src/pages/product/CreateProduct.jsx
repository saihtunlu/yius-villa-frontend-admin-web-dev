import { Grid2 } from '@mui/material';
import { connect } from 'react-redux';
import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ProductNewForm from '../../components/pages/product/ProductNewForm';

const CreateProduct = () => {
  return (
    <Page title={'Create Product Page'} roleBased role={{ name: 'Product', type: 'create' }}>
      <Grid2 container spacing={2.5}>
        <Grid2 size={12}>
          <HeaderBreadcrumbs
            heading={'Create a new product'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Products',
                href: PATH_DASHBOARD.product.list,
              },
              { name: 'New product' },
            ]}
          />

          <ProductNewForm />
        </Grid2>
      </Grid2>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(CreateProduct);
