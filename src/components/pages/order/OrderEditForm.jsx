import { Stack, Grid2 as Grid, Card, CardHeader, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { connect } from 'react-redux';
import { sum } from 'lodash';
import { useBlocker } from 'react-router-dom';
import onScan from 'onscan.js';

import { useSnackbar } from 'notistack';
import OrderProductList from './OrderProductList';
import Scrollbar from '../../common/Scrollbar';
import EmptyContent from '../../common/EmptyContent';
import AddProduct from './AddProduct';
import OrderSummary from './OrderSummary';
import CustomerDetail from './CustomerDetail';
import { searchProducts, updateOrder } from '../../../redux/actions';
import OrderPayment from './OrderPayment';
import FulfillProducts from './FulfillProducts';
import OrderTimeline from './OrderTimeline';
import { INITIAL_STORE } from '../../../redux/reducer/store';
import GeneralDetail from './GeneralDetail';

function OrderEditForm(props) {
  const { store, initialOrder, onUpdateStatus } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [order, setOrder] = useState(initialOrder);
  const [initialData, setInitialData] = useState();

  const [loading, setLoading] = useState(false);
  const isEmptyOrder = order.products?.length === 0;
  const totalItems = sum(order.products.map((item) => parseInt(item.quantity, 10)));
  const [removedIDs, setRemovedIDs] = useState([]);

  const [unSavedChanges, setUnSavedChanges] = useState(false);

  useEffect(() => {
    // Define the scan event handler
    const handleScan = (event) => {
      if (event) {
        handleScanProducts(event); // Save scanned code to state
      }
    };

    // Attach the onScan library to the document
    onScan.attachTo(document, {
      onScan: handleScan, // Triggered when a scan is detected
      reactToPaste: true, // Treat pasted text as a scan
    });

    return () => {
      // Detach the event listener on cleanup
      onScan.detachFrom(document);
    };
  }, []);

  const handleScanProducts = (scannedCode) => {
    searchProducts(scannedCode).then((data) => {
      if (data.length > 0) {
        var product = data[0];
        var check = order.products.filter(
          (item) => item.product === product.id || item.variation_product === product.id
        );

        if (check.length > 0) {
          const index = order.products.findIndex(
            (item) => item.product === product.id || item.variation_product === product.id
          );

          if (index !== -1) {
            setOrder((preState) => {
              var newState = JSON.parse(JSON.stringify(preState));
              newState.products[index].quantity += 1;
              newState.products[index].subtotal = newState.products[index].quantity * newState.products[index].price;

              enqueueSnackbar(
                `Product name "${check[0].name}" quantity updated to ${newState.products[index].quantity}`,
                {
                  variant: 'success',
                }
              );
              return newState;
            });
          }
        } else {
          var sellingPrice = product.sale_price || product.regular_price;

          var primary_price =
            parseInt(product.cost_per_item, 10) === 0 || !product.cost_per_item
              ? parseInt(parseInt(sellingPrice, 10) * 0.6666, 10)
              : product.cost_per_item;

          var profit = sellingPrice - primary_price;

          var margin = ((profit / sellingPrice) * 100).toFixed(2);

          const scannedProduct = {
            profit,
            margin,
            cost_per_item: product.cost_per_item,
            name: product.is_main_product ? product.name : product.product_name + ' - ' + product.name,
            quantity: 1,
            price: sellingPrice,
            image:
              (product.is_main_product ? product.images[0]?.image || '/assets/img/default.png' : product.image) ||
              '/assets/img/default.png',
            variation_product: product.is_main_product ? null : product.id,
            number_of_fulfilled: 0,
            product: product.is_main_product ? product.id : null,
            subtotal: sellingPrice,
          };
          handleUpdateProducts([scannedProduct]);
          enqueueSnackbar(scannedProduct.name + ' has been added!', { variant: 'success' });
        }
      } else {
        enqueueSnackbar('No product with ' + scannedCode, { variant: 'warning' });
      }
    });
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unSavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // required for chrome
        return true; // Return a truthy value
      }
      return null; // Allow navigation if no conditions met
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unSavedChanges]);

  const shouldBlockNavigation = () => {
    if (unSavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you really want to leave?')) {
        return true;
      }
      return null;
    }
    return null; // Allow navigation
  };

  useBlocker(shouldBlockNavigation);

  useEffect(() => {
    setTimeout(() => {
      setUnSavedChanges(initialData !== JSON.stringify(order));
    }, 1000);

    return () => {};
  }, [order]);

  useEffect(() => {
    setOrder(initialOrder);
    setInitialData(JSON.stringify(initialOrder));
    return () => {};
  }, [initialOrder]);

  useEffect(() => {
    calcOrderValues();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.products, order.extra_fees]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateOrder(order, removedIDs)
      .then((data) => {
        setLoading(false);
        setOrder(data);
        setInitialData(JSON.stringify(data));
        setRemovedIDs([]);
        enqueueSnackbar('Update success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const handleUpdateQuantity = (index, number) => {
    setOrder((preState) => {
      var newState = JSON.parse(JSON.stringify(preState));
      // eslint-disable-next-line
      newState.products[index].quantity = parseInt(newState.products[index].quantity, 10) + number;
      newState.products[index].subtotal =
        parseInt(newState.products[index].quantity, 10) * newState.products[index].price;

      var sellingPrice = newState.products[index].price;

      if (!newState.products[index].cost_per_item || parseInt(newState.products[index].cost_per_item, 10) === 0) {
        newState.products[index].cost_per_item = parseInt(parseFloat(sellingPrice) * 0.6666, 10).toFixed(0);
      }

      newState.products[index].profit =
        parseInt(sellingPrice - newState.products[index].cost_per_item, 10) *
        parseInt(newState.products[index].quantity, 10);

      newState.products[index].margin = (
        (newState.products[index].profit / sellingPrice / parseInt(newState.products[index].quantity, 10)) *
        100
      ).toFixed(2);

      return newState;
    });
  };
  const handleUpdateProducts = (products) => {
    setOrder((preState) => {
      var newState = JSON.parse(JSON.stringify(preState));
      newState.products = [...newState.products, ...products];
      return newState;
    });
  };

  const handleRemoveProduct = (index) => {
    const removedID = order.products[index]?.id;
    if (removedID) {
      setRemovedIDs((preState) => {
        return [...preState, removedID];
      });
    }
    setOrder((preState) => {
      var newState = JSON.parse(JSON.stringify(preState));
      newState.products.splice(index, 1);
      return newState;
    });
  };

  const calcOrderValues = (newDiscount) => {
    const subtotal = sum(order.products.map((item) => parseInt(item.subtotal, 10)));
    const profit_amount = sum(order.products.map((item) => parseInt(item.profit, 10)));

    var discount = order.discount;
    var discount_percentage = order.discount_percentage;
    var discount_type = order.discount_type;
    var discount_reason = order.discount_reason;
    if (newDiscount) {
      discount = newDiscount.discount;
      discount_percentage = newDiscount.discountPercentage;
      discount_type = newDiscount.discountType;
      discount_reason = newDiscount.discountReason;
    }
    if (discount_type !== 'Amount') {
      var discountAmount = ((parseInt(discount_percentage, 10) / 100) * subtotal).toFixed(0);
      discount = discountAmount;
    }
    const totalExtraFees = sum(order.extra_fees.map((item) => parseInt(item.amount, 10)));
    const total = totalExtraFees + subtotal - parseInt(discount, 10);
    const due_amount = total - parseInt(order.paid_amount, 10);

    setOrder((preState) => {
      return {
        ...preState,
        subtotal,
        total,
        discount,
        discount_percentage,
        discount_reason,
        discount_type,
        profit_amount,
        due_amount,
      };
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8, lg: 8 }}>
          <Stack spacing={3}>
            <Card>
              <Stack sx={{ p: 2.5 }} direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
                <Typography variant="subtitle1">Order ({totalItems} items)</Typography>

                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <AddProduct onSelect={handleUpdateProducts} />
                  <FulfillProducts
                    initialProducts={order.products}
                    pendingTask={order.pending_task}
                    sid={order.id}
                    onChange={(data) => {
                      setOrder(data);
                      setInitialData(JSON.stringify(data));
                      onUpdateStatus({
                        status: data.status,
                        payment_status: data.payment_status,
                        is_fulfilled: data.is_fulfilled,
                        pending_task: data.pending_task,
                      });
                    }}
                  />
                </Stack>
              </Stack>

              {!isEmptyOrder ? (
                <Scrollbar>
                  <OrderProductList
                    products={order.products}
                    onDelete={(index) => handleRemoveProduct(index)}
                    onIncreaseQuantity={(index) => handleUpdateQuantity(index, 1)}
                    onDecreaseQuantity={(index) => handleUpdateQuantity(index, -1)}
                  />
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
                setInitialData(JSON.stringify(data));
                onUpdateStatus({
                  status: data.status,
                  payment_status: data.payment_status,
                  is_fulfilled: data.is_fulfilled,
                  pending_task: data.pending_task,
                });
              }}
              initialOrder={order}
            />
            <OrderTimeline activities={order.activities} timeline={order.timelines} />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4, lg: 4 }}>
          <Stack spacing={3}>
            <GeneralDetail
              initialOrder={order}
              onSave={(order) => {
                setOrder(order);
                setInitialData(JSON.stringify(order));
              }}
            />

            <CustomerDetail
              initialOrder={order}
              onSaveCustomer={(order) => {
                setOrder(order);

                setInitialData(JSON.stringify(order));
              }}
            />

            <OrderSummary
              extraFees={order.extra_fees}
              onAddedExtraFees={(extraFee) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    extra_fees: [...preState.extra_fees, extraFee],
                  };
                });
              }}
              OnRemoveExtraFee={(index) => {
                setOrder((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.extra_fees.splice(index, 1);
                  return {
                    ...newState,
                  };
                });
              }}
              profitAmount={order.profit_amount}
              total={order.total}
              taxIncluded={store.settings.tax_type !== 'Exclusive'}
              discount={{
                discount: order.discount,
                discountPercentage: order.discount_percentage,
                discountType: order.discount_type,
                discountReason: order.discount_reason,
              }}
              tax={{ value: order.tax, rate: order.tax_rate }}
              subtotal={order.subtotal}
              onAddedDiscount={(discount) => calcOrderValues(discount)}
            />
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
              Update Order
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
const mapStateToProps = (state) => {
  return {
    store: state.auth?.user?.store || INITIAL_STORE,
  };
};

export default connect(mapStateToProps)(OrderEditForm);
