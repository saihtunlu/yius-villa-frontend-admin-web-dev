import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Stack } from '@mui/material';
import moment from 'moment';

// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import { BaseOptionChart } from '../../common/charts';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 60,
  height: 60,
  display: 'flex',
  borderRadius: 12,
  overflow: 'hidden',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(3),
  right: theme.spacing(3),
  justifyContent: 'center',
}));

export default function PaymentSummary({
  paymentType,
  todayAmount,
  imgSrc,
  color = 'primary',
  chartData,
  labels,
  sx,
  ...other
}) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette[color].main],
    chart: { sparkline: { enabled: true } },
    xaxis: {
      type: 'datetime',
      categories: labels,
    },
    yaxis: { labels: { show: false } },
    stroke: { width: 4 },
    legend: { show: false },
    grid: { show: false },
    tooltip: {
      y: {
        formatter: (seriesName) => fCurrency(seriesName),
        title: {
          formatter: (val) => '',
        },
      },
      x: {
        show: true,
        formatter: (seriesName) => moment(seriesName).format('DD-MM-YYYY'),
        title: {
          formatter: (val) => '',
        },
      },
    },
    fill: { gradient: { opacityFrom: 0.56, opacityTo: 0.56 } },
  });

  return (
    <Card
      sx={{
        width: 1,
        boxShadow: 0,
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >
      <IconWrapperStyle
        sx={{
          color: (theme) => theme.palette[color].lighter,
          bgcolor: (theme) => theme.palette[color].dark,
        }}
      >
        <img
          src={imgSrc}
          style={{
            width: 60,
            height: 60,
          }}
          alt=""
        />
      </IconWrapperStyle>

      <Stack spacing={1} sx={{ p: 3 }}>
        <Typography variant="overline" sx={{ typography: 'subtitle2' }}>
          {paymentType}
        </Typography>

        <Typography sx={{ typography: 'h5' }}>{fCurrency(todayAmount)}</Typography>
        <Stack direction="row" alignItems="center" flexWrap="wrap">
          <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
            received on {moment().format('DD-MM-YYYY')}
          </Typography>
        </Stack>
      </Stack>

      <ReactApexChart type="area" series={[{ data: chartData }]} options={chartOptions} height={100} />
    </Card>
  );
}
