import { Stack, Grid2 as Grid, Card, CardHeader, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { sum } from 'lodash';
import onScan from 'onscan.js';

import OrderProductList from './OrderProductList';
import Scrollbar from '../../common/Scrollbar';
import EmptyContent from '../../common/EmptyContent';
import AddProduct from './AddProduct';
import OrderSummary from './OrderSummary';
import CustomerDetail from './CustomerDetail';
import { PATH_DASHBOARD } from '../../../router/paths';
import { createNewOrder, searchProducts } from '../../../redux/actions';
import { PREFIX_URL } from '../../../config';
import { INITIAL_STORE } from '../../../redux/reducer/store';
import GeneralDetail from './GeneralDetail';

export const INITIAL_ORDER = {
  payment_status: 'Unpaid',
  due_amount: 0,
  customer: {
    name: 'In-store Customer',
    phone: '',
    gender: 'Other',
  },
  delivery_company: {
    name: 'Pick Up',
  },

  phone: '',
  status: 'Active',
  delivery_date: null,
  payment_method: null,
  type: 'In-store Sale',
  sale_from: 'In-Store',
  exported_by: '',
  payments: [],
  extra_fees: [],
  address: { state: '', city: '', address: '', map: '' },
  products: [],
  timelines: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  discount_reason: '',
  discount_type: 'Amount',
  note: 'note',
  paid_amount: 0,
  profit_amount: 0,
};

function OrderNewForm(props) {
  const { store } = props;
  const newOrder = { ...INITIAL_ORDER, tax_rate: store.settings.tax };
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [order, setOrder] = useState(newOrder);

  const [loading, setLoading] = useState(false);
  const isEmptyOrder = order.products.length === 0;
  const totalItems = sum(order.products.map((item) => parseInt(item.quantity, 10)));

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

  // effects
  useEffect(() => {
    calcOrderValues();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.products, order.extra_fees]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createNewOrder(order)
      .then((data) => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.order.edit(data.id));
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
      return {
        ...preState,
        products: [...preState.products, ...products],
      };
    });
  };
  const handleRemoveProduct = (index) => {
    setOrder((preState) => {
      var newState = JSON.parse(JSON.stringify(preState));
      newState.products.splice(index, 1);
      return newState;
    });
  };

  const calcOrderValues = (newDiscount) => {
    const subtotal = sum(order.products.map((item) => parseInt(item.subtotal, 10)));
    const totalProfit = sum(order.products.map((item) => parseInt(item.profit, 10)));

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

    // const tax_rate = order.tax_rate / 100;
    // var tax = '';
    // if (store.settings.tax_type === 'Inclusive') {
    //   tax = ((subtotal / (1 + tax_rate)) * tax_rate).toFixed(0);
    // }
    // if (store.settings.tax_type === 'Exclusive') {
    //   tax = (subtotal * tax_rate).toFixed(0);
    // }

    const totalExtraFees = sum(order.extra_fees.map((item) => parseInt(item.amount, 10)));
    const total = totalExtraFees + subtotal - discount;

    setOrder((preState) => {
      return {
        ...preState,
        subtotal: String(subtotal),
        total: String(total),
        due_amount: String(total),
        discount: String(discount),
        discount_percentage,
        discount_reason,
        discount_type,
        profit_amount: totalProfit,
      };
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={2.5}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6">
                    Order
                    <Typography component="span" sx={{ color: 'text.secondary' }}>
                      &nbsp;({totalItems} item)
                    </Typography>
                  </Typography>
                }
                action={<AddProduct onSelect={(products) => handleUpdateProducts(products)} />}
                sx={{ mb: 2.5 }}
              />

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
                  img={PREFIX_URL + '/assets/illustrations/illustration_empty_cart.svg'}
                />
              )}
            </Card>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2.5}>
            <GeneralDetail initialOrder={order} onSave={(order) => setOrder(order)} />
            <CustomerDetail initialOrder={order} onSaveCustomer={(order) => setOrder(order)} />

            <OrderSummary
              OnRemoveExtraFee={(index) => {
                setOrder((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.extra_fees.splice(index, 1);
                  return {
                    ...newState,
                  };
                });
              }}
              extraFees={order.extra_fees}
              onAddedExtraFees={(extraFee) => {
                setOrder((preState) => {
                  return {
                    ...preState,
                    extra_fees: [...preState.extra_fees, extraFee],
                  };
                });
              }}
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
              Create Order
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

export default connect(mapStateToProps)(OrderNewForm);
