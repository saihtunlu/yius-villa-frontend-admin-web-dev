import { useEffect, useRef, useState } from 'react';
import { Button, Grid2, Stack, Typography, useTheme } from '@mui/material';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import ProductEditForm from '../../components/pages/product/ProductEditForm';
import Page from '../../components/common/Page';
import axios from '../../utils/axios';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';
import { INITIAL_PRODUCT } from '../../components/pages/product/ProductNewForm';
import Label from '../../components/common/Label';
import Iconify from '../../components/common/Iconify';

const EditProduct = () => {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [isReady, setIsReady] = useState(false);
  const theme = useTheme();
  const params = useParams();
  // effects
  useEffect(() => {
    if (params.slug) {
      getProduct(params.slug);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProduct = (slug) => {
    const url = 'product/?slug=' + slug;
    axios
      .get(url)
      .then(({ data }) => {
        setProduct(data);
        setIsReady(true);
      })
      .catch((err) => {
        setIsReady(false);
      });
  };

  return (
    <Page title={'Edit Product Page'} roleBased role={{ name: 'Product', type: 'update' }}>
      <Grid2 container spacing={2.5}>
        <Grid2 size={12}>
          <HeaderBreadcrumbs
            heading={
              <>
                Edit a product
                {product.sold_out !== 0 && (
                  <Label
                    key="pending-task"
                    sx={{ ml: 2 }}
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={'success'}
                    startIcon={<Iconify icon={'solar:box-bold-duotone'} />}
                  >
                    {product.sold_out} psc sold out
                  </Label>
                )}
              </>
            }
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Products',
                href: PATH_DASHBOARD.product.list,
              },
              { name: product.slug },
            ]}
          />
          {isReady ? <ProductEditForm initialProduct={product} /> : <EditorSkeleton />}
        </Grid2>
      </Grid2>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(EditProduct);
