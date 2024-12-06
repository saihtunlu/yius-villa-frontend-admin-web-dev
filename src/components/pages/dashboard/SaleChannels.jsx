// @mui
import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Stack, LinearProgress } from '@mui/material';
// utils
import { fNumber, fCurrency, fPercent } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------

SaleChannels.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default function SaleChannels({ title, subheader, data, colors, ...other }) {
  return (
    <Card sx={{ height: '100%' }} {...other}>
      <Stack sx={{ p: 2.5 }} spacing={1}>
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>

      <Stack spacing={2.5} sx={{ p: 2.5, pt: 0 }}>
        {data.map((progress, index) => {
          return <ProgressItem key={progress.label} color={colors[index]} progress={progress} />;
        })}
      </Stack>
    </Card>
  );
}

function ProgressItem({ progress, color }) {
  return (
    <Stack spacing={0.5}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle3" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle3">{fCurrency(progress.amount)}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        sx={{
          height: '10px',
        }}
        variant="determinate"
        value={progress.value}
        color={color}
      />
    </Stack>
  );
}
