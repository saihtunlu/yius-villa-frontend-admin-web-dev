import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, Box, useTheme, Typography, Stack } from '@mui/material';
import moment from 'moment';
import { BaseOptionChart } from '../../common/charts';
import TextMaxLine from '../../common/TextMaxLine';

export default function NoOfSales({ title, subheader, chartLabels, chartData, ...other }) {
  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '45%',
      },
    },
    xaxis: {
      type: 'datetime',
      categories: chartLabels,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} order(s) received`,
      },
      x: {
        show: true,
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
        <TextMaxLine line={1} variant="body2" color="text.secondary">
          {subheader}
        </TextMaxLine>
      </Stack>

      <Box sx={{ mx: 2.5 }} dir="ltr">
        <ReactApexChart type="bar" series={chartData} options={chartOptions} height={320} />
      </Box>
    </Card>
  );
}
