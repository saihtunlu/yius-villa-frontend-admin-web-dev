import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, useTheme, Stack, Typography } from '@mui/material';
import moment from 'moment';

import { fCurrency } from '../../../utils/formatNumber';
import { BaseOptionChart } from '../../common/charts';
// components

export default function SalesSummary({ title, subheader, chartLabels, chartData, ...other }) {
  const theme = useTheme();
  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      type: 'datetime',
      categories: chartLabels,
    },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    tooltip: {
      y: {
        formatter: (seriesName) => fCurrency(seriesName),
        title: {
          formatter: (val) => '',
        },
      },
      x: {
        formatter: (seriesName) => moment(seriesName).format('DD-MM-YYYY'),
        title: {
          formatter: (val) => '',
        },
      },
    },
  });

  return (
    <Card {...other}>
      <Stack sx={{ p: 2.5 }} spacing={1}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subheader}
        </Typography>
      </Stack>

      <Box sx={{ mx: 2.5 }} dir="ltr">
        <ReactApexChart type="area" series={chartData} options={chartOptions} height={320} />
      </Box>
    </Card>
  );
}
