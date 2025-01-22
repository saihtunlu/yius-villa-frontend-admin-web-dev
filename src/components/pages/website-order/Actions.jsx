import { Icon } from '@iconify/react';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
// material
import {
  Card,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  Checkbox,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function Actions({ initialOrder, onSave }) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  useEffect(() => {
    setOrder(initialOrder);
    return () => {};
  }, [initialOrder]);

  const status = ['To Pay', 'To Verify', 'To Pack', 'To Delivery', 'Delivery Picked Up', 'Cancelled'];

  const handleSubmit = () => {
    setLoading(true);
    axios
      .put('order/', { data: order })
      .then(({ data }) => {
        setLoading(false);
        onSave(data);
        enqueueSnackbar('Update success', { variant: 'success' });
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader title="Actions" />
        <CardContent>
          <Stack spacing={2.5}>
            <div>
              <LabelStyle>Status</LabelStyle>
              <RadioGroup
                aria-label="gender"
                value={order.status}
                name="gender-radio-buttons-group"
                onChange={(event) => {
                  setOrder((preState) => {
                    return { ...preState, status: event.target.value };
                  });
                }}
                row
              >
                <Stack
                  sx={{
                    borderRadius: theme.shape.borderRadiusSm + 'px',
                    border: `1px solid ${theme.palette.divider}`,
                    p: 1.5,
                  }}
                  direction={'row'}
                  alignItems={'center'}
                  flexWrap={'wrap'}
                >
                  {status.map((val) => (
                    <FormControlLabel key={val} value={val} control={<Radio />} label={val} />
                  ))}
                </Stack>
              </RadioGroup>
            </div>

            {order.status === 'Delivery Picked Up' && (
              <RemoteAutocomplete
                value={order.delivery_company?.name}
                onChange={(value, data) => {
                  setOrder((preState) => {
                    return { ...preState, delivery_company: { name: value } };
                  });
                }}
                required
                remote="delivery/search/"
                label={'Delivery Company'}
              />
            )}

            <TextField
              value={order.note}
              onChange={(event) =>
                setOrder((preState) => {
                  return { ...preState, note: event.target.value };
                })
              }
              rows={4}
              fullWidth
              multiline
              label="Order Note"
            />

            <LoadingButton
              fullWidth
              size="large"
              onClick={() => {
                handleSubmit();
              }}
              variant="contained"
              loading={loading}
            >
              Update Order
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
