import { AnimatePresence, m } from 'framer-motion';
import { useState, useEffect } from 'react';
// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import {
  Stack,
  Divider,
  Grid2 as Grid,
  Backdrop,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));
const statusTypes = ['Present', 'Absent', 'Leave', 'Half-Day', 'Off-Day', 'Late'];

export default function AttendanceForm({ open = false, onClose, onUpdate, data, loading = false }) {
  const [value, setValue] = useState([]);

  useEffect(() => {
    setValue(data);
  }, [data]);

  // const theme = useTheme();
  // useEffect(() => {
  //   if (open) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [open]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={'sm'}
      id="filter-dialog"
      onClose={onClose}
      aria-labelledby="filter"
      aria-describedby="filter"
    >
      <DialogContent sx={{ pb: 0 }}>
        <Grid container spacing={0}>
          <Grid size={12}>
            <Stack spacing={2.5}>
              <Typography variant="subtitle1">Edit</Typography>

              <div>
                <LabelStyle>Status</LabelStyle>
                <RadioGroup
                  aria-label="status"
                  value={value.status || ''}
                  name="status-radio-buttons-group"
                  onChange={(event) => {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.status = event.target.value;
                      return { ...newState };
                    });
                  }}
                  row
                >
                  <Stack spacing={1} direction="row">
                    {statusTypes.map((status) => (
                      <FormControlLabel key={status} value={status} control={<Radio />} label={status} />
                    ))}
                  </Stack>
                </RadioGroup>
              </div>

              <TextField
                multiline
                fullWidth
                rows={6}
                label={'Remarks'}
                placeholder="..."
                value={value.remarks || ''}
                onChange={(event) => {
                  setValue((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.remarks = event.target.value;
                    return { ...newState };
                  });
                }}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="black" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant={'contained'}
          color={'black'}
          onClick={() => {
            onUpdate(value);
          }}
          autoFocus
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
