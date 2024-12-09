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
} from '@mui/material';
import { useEffect, useState } from 'react';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';
import { INITIAL_ORDER } from './OrderNewForm';
import Avatar from '../../common/Avatar';
import Iconify from '../../common/Iconify';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export default function GeneralDetail({ initialOrder, onSave }) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(INITIAL_ORDER);

  const handleClickOpen = () => {
    setOrder(initialOrder);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOrder(initialOrder);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card>
        <CardHeader
          title="Organize"
          action={
            <Button
              size="small"
              type="button"
              onClick={handleClickOpen}
              startIcon={<Iconify icon={'solar:pen-new-round-bold-duotone'} width={20} height={20} />}
            >
              Edit
            </Button>
          }
        />

        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sale Type
              </Typography>
              <Typography variant="subtitle3">
                {initialOrder.type || '-'} {initialOrder.sale_from && `(${initialOrder.sale_from})`}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Selling By
              </Typography>

              <Stack direction={'row'} alignItems={'center'}>
                <Avatar
                  sx={{ width: 25, height: 25, mr: '5px' }}
                  user={{
                    first_name: initialOrder.exported_by,
                  }}
                />
                <Typography variant="subtitle3">{initialOrder.exported_by || '-'}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Delivery Company
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.delivery_company?.name || '-'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Order Note:
              </Typography>
              <Typography maxWidth={'70%'} textAlign={'right'} variant="subtitle3">
                {initialOrder.note || '-'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="general-detail-dialog"
        aria-describedby="general-detail-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="general-detail-dialog">
          Organize
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <div>
              <LabelStyle>Sale Type</LabelStyle>
              <RadioGroup
                aria-label="gender"
                value={order.type}
                name="gender-radio-buttons-group"
                onChange={(event) => {
                  if (event.target.value === 'In-store Sale') {
                    setOrder((preState) => {
                      return { ...preState, type: event.target.value, sale_from: 'In-Store' };
                    });
                  } else {
                    setOrder((preState) => {
                      return { ...preState, type: event.target.value };
                    });
                  }
                }}
                row
              >
                <Stack spacing={1} direction="row">
                  {['In-store Sale', 'Online Sale'].map((val) => (
                    <FormControlLabel key={val} value={val} control={<Radio required />} label={val} />
                  ))}
                </Stack>
              </RadioGroup>
            </div>

            {order.type === 'Online Sale' && (
              <FormControl fullWidth>
                <InputLabel id="state-select-label">Sales Channel</InputLabel>
                <Select
                  labelId="state-select-label-id"
                  id="state-select-id"
                  value={order.sale_from}
                  label="Sales Channel"
                  onChange={(event) => {
                    setOrder((preState) => {
                      return { ...preState, sale_from: event.target.value };
                    });
                  }}
                >
                  {['In-Store', 'Facebook', 'Telegram', 'Viber', 'Website', 'Others'].map((val, index) => (
                    <MenuItem key={`${index}-state`} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <RemoteAutocomplete
              value={order.exported_by}
              onChange={(value, data) => {
                setOrder((preState) => {
                  return { ...preState, exported_by: value };
                });
              }}
              required
              remote="employee/search/"
              label={'Selling By'}
            />

            <RemoteAutocomplete
              value={order.delivery_company?.name || '-'}
              onChange={(value, data) => {
                setOrder((preState) => {
                  return { ...preState, delivery_company: { name: value } };
                });
              }}
              required
              remote="delivery/search/"
              label={'Delivery Company'}
            />

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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="black" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="black"
            variant={'contained'}
            onClick={() => {
              onSave(order);
              setOpen(false);
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
