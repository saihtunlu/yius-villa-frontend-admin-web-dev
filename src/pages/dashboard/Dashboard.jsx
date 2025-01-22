// material
import { Box, Grid2 as Grid, InputAdornment, Skeleton, Stack, useTheme, Typography, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';

import Page from '../../components/common/Page';
import DashboardSkeleton from '../../components/skeleton/DashboardSkeleton';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import Welcome from '../../components/pages/dashboard/Welcome';
import NewProducts from '../../components/pages/dashboard/NewProducts';

import { PATH_DASHBOARD } from '../../router/paths';
import PaymentSummary from '../../components/pages/dashboard/PaymentSummary';
import SalesSummary from '../../components/pages/dashboard/SalesSummary';
import NoOfSales from '../../components/pages/dashboard/NoOfSales';
import ProfitSummary from '../../components/pages/dashboard/ProfitSummary';
import TopSoldProducts from '../../components/pages/dashboard/TopSoldProducts';
import TopCustomers from '../../components/pages/dashboard/TopCustomers';
import TopCities from '../../components/pages/dashboard/TopCities';
import Iconify from '../../components/common/Iconify';
import SaleChannels from '../../components/pages/dashboard/SaleChannels';

import TopSalesmen from '../../components/pages/dashboard/TopSalesmen';
import { fCurrency } from '../../utils/formatNumber';
import { INITIAL_USER } from '../../redux/slices/auth';
import { INITIAL_STORE } from '../../redux/slices/store';

const end = new Date();
const start = new Date();

start.setTime(start.getTime() - 3600 * 1000 * 24 * 10); //last 10 days
end.setTime(end.getTime() + 3600 * 1000 * 24 * 1); //tomorrow
const today = moment().format('YYYY-MM-DD');
const dates = [moment(start), moment(end)];

const Dashboard = (props) => {
  const { user } = props;
  const { store } = user || INITIAL_STORE;
  const { t } = useTranslation();
  const theme = useTheme();

  const [isReady, setIsReady] = useState(false);
  const [gettingData, setGettingData] = useState(false);

  const [startDate, setStartDate] = useState({
    formatted: dates[0].format('YYYY-MM-DD'),
    unformatted: dates[0],
  });
  const [endDate, setEndDate] = useState({
    formatted: dates[1].format('YYYY-MM-DD'),
    unformatted: dates[1],
  });
  const [todayData, setTodayData] = useState([]);
  // const [newProducts, setNewProducts] = useState([]);
  const [todayIndex, setTodayIndex] = useState(0);

  const [dataLabels, setDataLabels] = useState([]);
  const [saleData, setSaleData] = useState([]);
  const [saleChannels, setSaleChannels] = useState([]);

  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topSalesMenData, setTopSalesMenData] = useState([]);
  const [topCitiesData, setTopCitiesData] = useState([]);
  const [noOfSaleData, setNoOfSaleData] = useState([]);

  const [profitData, setProfitData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [productReport, setProductReport] = useState({ total_selling_amount: 0, total_purchase_cost: 0 });

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const getData = () => {
    setGettingData(true);

    axios
      .get(`sale-reports/?from=${startDate.formatted}&to=${endDate.formatted}&today=${today}`)
      .then((response) => {
        try {
          const resData = response.data;
          setTodayData(resData.today_data);
          setTopSoldProducts(resData.top_sold_products);
          setTopCustomers(resData.top_customers);
          setTopSalesMenData(resData.top_salesmen);
          setTopCitiesData(resData.top_cities);
          setPaymentData(resData.sales_by_payments);
          setSaleChannels(resData.sale_by_channels);
          const index = resData.sales_by_payments[0]?.dates.findIndex((date) => date === today);
          setTodayIndex(index);
          setProductReport({
            total_selling_amount: resData.total_selling_amount,
            total_purchase_cost: resData.total_purchase_cost,
          });
          var labels_ = [];
          var orderedAmount = [];
          var receivedAmount = [];
          var saleCounts = [];
          var profitAmount = [];
          var discountAmount = [];
          resData.total_sales.forEach((res, index) => {
            if (index !== resData.total_sales.length - 1) {
              labels_.push(res.label);
              res.data.forEach((data) => {
                if (data.type === 'sale_price') {
                  orderedAmount.push(data.data);
                }
                if (data.type === 'received_amounts') {
                  receivedAmount.push(data.data);
                }
                if (data.type === 'sale_counts') {
                  saleCounts.push(data.data);
                }

                if (data.type === 'profit_amount') {
                  profitAmount.push(data.data);
                }

                if (data.type === 'discount_amount') {
                  discountAmount.push(data.data);
                }
              });
            }
          });
          setDataLabels(labels_);

          setSaleData([
            {
              name: 'Sale',
              data: orderedAmount,
            },
            {
              name: 'Payment Received',
              data: receivedAmount,
            },
            {
              name: 'Discount',
              data: discountAmount,
            },
          ]);
          setNoOfSaleData([
            {
              name: 'Number of orders',
              data: saleCounts,
            },
          ]);
          setProfitData([
            {
              name: 'Profit Amount',
              data: profitAmount,
            },
          ]);

          setIsReady(true);
        } catch (e) {
          console.log('🚀 ~ .then ~ e:', e);
        }
      })
      .catch(() => {
        setGettingData(false);
        setIsReady(false);
      });
  };

  return (
    <Page title="Dashboard page">
      <Grid container spacing={3}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            hideBack
            heading="Dashboard"
            links={[{ name: t('demo.title'), href: PATH_DASHBOARD.root }]}
            action={
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <DatePicker
                  label="Start Date"
                  format={'DD-MM-YYYY'}
                  value={startDate.unformatted}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                  onChange={(newValue) => {
                    setStartDate((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.unformatted = newValue;
                      newState.formatted = newValue.format('YYYY-MM-DD');
                      return { ...newState };
                    });
                  }}
                />
                <DatePicker
                  label="End Date"
                  format={'DD-MM-YYYY'}
                  value={endDate.unformatted}
                  slots={{ openPickerIcon: () => <Iconify icon="solar:calendar-bold-duotone" /> }}
                  onChange={(newValue) => {
                    setEndDate((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.unformatted = newValue;
                      newState.formatted = newValue.format('YYYY-MM-DD');
                      return { ...newState };
                    });
                  }}
                />
              </Stack>
            }
          />
        </Grid>

        {isReady ? (
          <>
            <Grid size={{ xs: 12, md: 8 }}>
              <Welcome
                storeName={store.name}
                content={
                  <Stack spacing={2.5}>
                    <Typography sx={{ pt: 4 }}>
                      <Typography sx={{ fontWeight: 700 }} variant="span">
                        Congratulation!
                        <br />
                      </Typography>
                      You have achieved a total sales amount of
                      <Typography sx={{ fontWeight: 700 }} variant="h4">
                        {fCurrency(todayData.sale_prices)}
                      </Typography>
                    </Typography>

                    <Stack direction={'row'} flexWrap={'wrap'} spacing={3} sx={{ pt: 5 }}>
                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Stack
                          justifyContent={'center'}
                          alignItems={'center'}
                          sx={{
                            background: theme.palette.primary.main,
                            borderRadius: '8px',
                            height: 40,
                            width: 40,
                          }}
                        >
                          <Iconify
                            icon="solar:card-line-duotone"
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </Stack>

                        <Stack>
                          <Typography variant="body2">Payments</Typography>
                          <Typography fontWeight={700} variant="body1">
                            {fCurrency(todayData.received_amounts)}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Stack
                          justifyContent={'center'}
                          alignItems={'center'}
                          sx={{
                            background: theme.palette.primary.main,
                            borderRadius: '8px',
                            height: 40,
                            width: 40,
                          }}
                        >
                          <Iconify
                            icon="streamline:discount-percent-coupon"
                            width={22}
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </Stack>

                        <Stack>
                          <Typography variant="body2">Discounts</Typography>
                          <Typography fontWeight={700} variant="body1">
                            {fCurrency(todayData.today_discount)}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Stack
                          justifyContent={'center'}
                          alignItems={'center'}
                          sx={{
                            background: theme.palette.primary.main,
                            borderRadius: '8px',
                            height: 40,
                            width: 40,
                          }}
                        >
                          <Iconify
                            icon="hugeicons:money-add-01"
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </Stack>

                        <Stack>
                          <Typography variant="body2">Extra Fees</Typography>
                          <Typography fontWeight={700} variant="body1">
                            {fCurrency(todayData.today_extra_fee)}
                          </Typography>
                        </Stack>
                      </Stack>

                      {user.role?.name === 'Owner' && (
                        <Stack direction={'row'} alignItems={'center'} spacing={1}>
                          <Stack
                            justifyContent={'center'}
                            alignItems={'center'}
                            sx={{
                              background: theme.palette.primary.main,
                              borderRadius: '8px',
                              height: 40,
                              width: 40,
                            }}
                          >
                            <Iconify
                              icon="hugeicons:money-receive-circle"
                              sx={{
                                color: '#fff',
                              }}
                            />
                          </Stack>

                          <Stack>
                            <Typography variant="body2">Profit</Typography>
                            <Typography fontWeight={700} variant="body1">
                              {fCurrency(todayData.profit_amount)}
                            </Typography>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              {saleChannels.length > 0 ? (
                <SaleChannels
                  colors={['primary', 'secondary', 'success', 'info', 'warning', 'error']}
                  data={saleChannels}
                  total={saleChannels[0]?.total}
                  title="Sale By Channels"
                  subheader={''}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    borderRadius: (theme) => theme.shape.borderRadiusMd + 'px',
                  }}
                  height={280}
                />
              )}
            </Grid>
            {paymentData.map((payment, index) => {
              return (
                <Grid size={{ xs: 12, md: 3 }} key={index + payment.payment_method.name}>
                  <PaymentSummary
                    paymentType={payment.payment_method.name}
                    imgSrc={payment.payment_method.image}
                    labels={payment.dates}
                    todayAmount={payment.total_price[todayIndex]}
                    chartData={payment.total_price}
                    color={payment.payment_method.color}
                  />
                </Grid>
              );
            })}
            {Array.from({ length: 4 - paymentData.length }, (_, i) => i + 1).map((index) => {
              return <Grid size={{ xs: 12, md: 3 }} key={index} />;
            })}
            <Grid size={{ xs: 12, md: 4 }}>
              <NoOfSales
                title="Number Of Orders"
                subheader={`Total ${noOfSaleData[0].data.reduce((total, value) => {
                  return total + value;
                }, 0)} orders received  from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                chartLabels={dataLabels}
                chartData={noOfSaleData}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <SalesSummary
                title="Sales Summary"
                subheader={`Total ${saleData[0].data
                  .reduce((total, value) => {
                    return total + value;
                  }, 0)
                  .toFixed(
                    0
                  )}MMK  from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                chartLabels={dataLabels}
                chartData={saleData}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                {user?.role?.name === 'Owner' && (
                  <ProfitSummary
                    title="Profits Summary"
                    subheader={`Total ${profitData[0].data.reduce((total, value) => {
                      return total + value;
                    }, 0)}MMK  from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                    chartLabels={dataLabels}
                    chartData={profitData}
                  />
                )}
                <TopSoldProducts
                  title="Top Sold Products"
                  subheader={`from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                  tableData={topSoldProducts}
                  tableLabels={[
                    { id: 'Product', label: 'Product' },
                    { id: 'no.of_sold', label: 'No. Of Sold' },
                    { id: 'total', label: 'Total' },
                    { id: 'rank', label: 'Rank' },
                  ]}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction={'column'} spacing={3}>
                {user.role?.name === 'Owner' && (
                  <Card>
                    <Stack sx={{ p: 2.5, pb: 0 }} spacing={1}>
                      <Typography variant="subtitle1">Inventory Report</Typography>
                    </Stack>
                    <Stack spacing={2.5} sx={{ p: 2.5 }}>
                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Stack
                          justifyContent={'center'}
                          alignItems={'center'}
                          sx={{
                            background: theme.palette.success.lighter,
                            borderRadius: '8px',
                            height: 40,
                            width: 40,
                          }}
                        >
                          <Iconify
                            icon="solar:box-bold-duotone"
                            sx={{
                              color: theme.palette.success.main,
                            }}
                          />
                        </Stack>

                        <Stack>
                          <Typography variant="body2">Total Selling Amount</Typography>
                          <Typography fontWeight={700} variant="body1">
                            {fCurrency(productReport.total_selling_amount)}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack direction={'row'} alignItems={'center'} spacing={1}>
                        <Stack
                          justifyContent={'center'}
                          alignItems={'center'}
                          sx={{
                            background: theme.palette.success.lighter,
                            borderRadius: '8px',
                            height: 40,
                            width: 40,
                          }}
                        >
                          <Iconify
                            icon="solar:inbox-in-bold-duotone"
                            sx={{
                              color: theme.palette.success.main,
                            }}
                          />
                        </Stack>

                        <Stack>
                          <Typography variant="body2">Total Purchase Amount</Typography>
                          <Typography fontWeight={700} variant="body1">
                            {fCurrency(productReport.total_purchase_cost)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Card>
                )}

                {user.role?.name === 'Owner' && (
                  <TopSalesmen
                    title="Top Salesmen"
                    subheader={`from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                    list={topSalesMenData}
                  />
                )}
                <TopCustomers
                  title="Top Customers"
                  subheader={`from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                  list={topCustomers}
                />
                <TopCities
                  title="Top Cities"
                  subheader={`from ${moment(startDate.unformatted).format('DD-MM-YYYY')} to ${moment(endDate.unformatted).format('DD-MM-YYYY')}`}
                  chartData={topCitiesData}
                />
              </Stack>
            </Grid>
          </>
        ) : (
          <DashboardSkeleton />
        )}
      </Grid>
    </Page>
  );
};

const mapStateToProp = (state) => {
  return {
    user: state.auth?.user || INITIAL_USER,
  };
};
export default connect(mapStateToProp)(Dashboard);
