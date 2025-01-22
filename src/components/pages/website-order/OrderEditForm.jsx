import { Stack, Grid2 as Grid, Card, CardHeader, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { connect } from 'react-redux';
import { sum } from 'lodash';
import onScan from 'onscan.js';
import axios from 'axios';

import { useSnackbar } from 'notistack';
import OrderProductList from './OrderProductList';
import Scrollbar from '../../common/Scrollbar';
import EmptyContent from '../../common/EmptyContent';
import OrderSummary from './OrderSummary';

import OrderPayment from './OrderPayment';
import OrderTimeline from './OrderTimeline';

import GeneralDetail from './GeneralDetail';
import { INITIAL_STORE } from '../../../redux/slices/store';
import Actions from './Actions';

function OrderEditForm(props) {
  const { initialOrder } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState(initialOrder);

  const isEmptyOrder = order.products?.length === 0;
  const totalItems = sum(order.products.map((item) => parseInt(item.quantity, 10)));

  useEffect(() => {
    // Define the scan event handler
    const handleScan = (event) => {
      if (event) {
        console.log('🚀 ~ handleScan ~ event:', event);
      }
    };

    // Attach the onScan library to the document
    onScan.attachTo(document, {
      onScan: handleScan, // Triggered when a scan is detected
      reactToPaste: true, // Treat pasted text as a scan
      ignoreIfFocusOn: ['input', 'textarea'],
    });

    return () => {
      // Detach the event listener on cleanup
      onScan.detachFrom(document);
    };
  }, []);

  useEffect(() => {
    setOrder(initialOrder);
    return () => {};
  }, [initialOrder]);

  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 8, lg: 8 }}>
        <Stack spacing={3}>
          <Card>
            <Stack sx={{ p: 2.5 }} direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
              <Typography variant="subtitle1">Order ({totalItems} items)</Typography>
            </Stack>

            {!isEmptyOrder ? (
              <Scrollbar>
                <OrderProductList products={order.products} />
              </Scrollbar>
            ) : (
              <EmptyContent
                title="Order is empty"
                description="Look like you have no items in your new order."
                img={'/assets/illustrations/illustration_empty_cart.svg'}
              />
            )}
          </Card>
          <OrderPayment
            onChange={(data) => {
              setOrder(data);
            }}
            initialOrder={order}
          />
          <OrderTimeline activities={order.activities} timeline={order.timelines} />
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, md: 4, lg: 4 }}>
        <Stack spacing={3}>
          <Actions
            initialOrder={order}
            onSave={(data) => {
              setOrder(data);
            }}
          />
          <GeneralDetail initialOrder={order} />

          <OrderSummary initialOrder={order} />
        </Stack>
      </Grid>
    </Grid>
  );
}
const mapStateToProps = (state) => {
  return {
    store: state.auth?.user?.store || INITIAL_STORE,
  };
};

export default connect(mapStateToProps)(OrderEditForm);
