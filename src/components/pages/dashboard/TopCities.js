import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';

// @mui
import { Box, Card, CardHeader, Stack, Typography } from '@mui/material';
// components
import { BaseOptionChart } from '../../common/charts';
import { fNumber } from '../../../utils/formatNumber';

export default function TopCities({ title, subheader, chartData, ...other }) {
  const [chartHeight, setChartHeight] = useState(200);

  useEffect(() => {
    const calculatedHeight = Math.max(200, chartData.length * 50);
    setChartHeight(calculatedHeight);
  }, [chartData]);

  const chartLabels = chartData.map((i) => {
    const str = i.address__city.split('(')[1];
    return `${str.substring(0, str.length - 1)}မြို့`;
  });

  const chartSeries = chartData.map((i) => i.count);

  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      height: 'auto', // Makes the chart height flexible
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },

    plotOptions: {
      bar: { horizontal: true, barHeight: '30%', borderRadius: 3 },
    },
    xaxis: {
      categories: chartLabels,
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
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={chartHeight} />
      </Box>
    </Card>
  );
}
