import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  Fab,
  Tooltip,
  Alert,
  CircularProgress,
  Switch,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import Iconify from '../../common/Iconify';

const ScanIcon = (props) => (
  <Box
    component={'svg'}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    sx={{
      width: '430px',
      height: '430px',
      position: 'absolute',
      top: '-55px',
      left: '-55px',
    }}
    width="100%"
    height="100%"
    viewBox="0 0 512 512"
  >
    <path
      fill="none"
      stroke="#535353"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="10"
      d="M336 448h56a56 56 0 0 0 56-56v-56m0-160v-56a56 56 0 0 0-56-56h-56M176 448h-56a56 56 0 0 1-56-56v-56m0-160v-56a56 56 0 0 1 56-56h56"
    />
  </Box>
);
const messageData = {
  color: 'warning',
  text: 'Scanning... Please align your QR code with the camera.',
};
export default function AttendForm({ type, show = true }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [showManual, setShowManual] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(messageData);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setText('');
    setValue('');
    setMessage(messageData);
  };

  const theme = useTheme();
  useEffect(() => {
    if (value) {
      handlePosting(value);
      setText(value);
    }
  }, [value]);

  const handlePosting = (id) => {
    setMessage({
      text: 'Checking attendance... Please wait.',
      color: 'info',
    });
    setLoading(true);
    axios
      .post('employee/attendance/', {
        data: {
          type,
          em_id: id,
        },
      })
      .then((res) => {
        setMessage(res.data);
        setLoading(false);
        enqueueSnackbar(' success', {
          variant: 'success',
        });
      })
      .catch((err) => {
        setLoading(false);
        if (err.status === 404) {
          setMessage({
            text: `There is no employee with ID - ${id}, please try again.`,
            color: 'error',
          });
        }
      });
  };

  return (
    <>
      {show && (
        <Tooltip title={'Attendance ' + type} placement="left">
          <Fab
            sx={{
              position: 'fixed',
              right: '25px',
              bottom: '85px',
              zIndex: '1000000000 !important',
            }}
            color="success"
            size="medium"
            onClick={handleClickOpen}
          >
            <Iconify color="#fff" icon={'solar:calendar-add-bold-duotone'} />
          </Fab>
        </Tooltip>
      )}

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle variant="subtitle1">Attendance ({type})</DialogTitle>

        <DialogContent sx={{ p: 2.5, mt: 2.5, maxWidth: '473px' }}>
          <Stack spacing={2.5}>
            <Stack
              spacing={2.5}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadiusSm + 'px',
                width: '433px',
                height: '433px',
              }}
              justifyContent={'center'}
              alignItems={'center'}
            >
              {open && (
                <Scanner
                  components={{ finder: false }}
                  scanDelay={100}
                  onError={(e) => {
                    console.log('🚀 ~ AttendForm ~ e:', e);
                    return {};
                  }}
                  onScan={(result) => {
                    if (result[0]) {
                      setValue(result[0].rawValue); // Access the scanned text
                    }
                  }}
                />
              )}
              {loading && (
                <Stack
                  justifyContent={'center'}
                  alignItems={'center'}
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    position: 'absolute',
                    zIndex: 1,
                    marginTop: '0px !important',
                  }}
                >
                  <CircularProgress color="inherit" />
                </Stack>
              )}
              <Box className="scanner-animation">
                <ScanIcon />
              </Box>
            </Stack>

            <Alert icon={<Iconify icon={'solar:code-scan-broken'} />} severity={message.color}>
              <Typography sx={{ maxWidth: 420 }}>{message.text}</Typography>
            </Alert>

            <Stack direction={'row'} sx={{ width: '100%' }} justifyContent={'space-between'} alignItems={'center'}>
              <Typography color="text.secondary" variant="subtitle3">
                Enter employee ID manually
              </Typography>

              <Switch
                color="primary"
                checked={showManual}
                onChange={(event) => {
                  setShowManual(!showManual);
                }}
              />
            </Stack>

            {showManual && (
              <TextField
                fullWidth
                label="Employee ID"
                value={text}
                onChange={(event) => {
                  setText(event.target.value);
                }}
              />
            )}

            {showManual && (
              <LoadingButton
                size={'large'}
                loading={loading}
                onClick={() => {
                  handlePosting(text);
                }}
                variant="contained"
                color="black"
              >
                Confirm
              </LoadingButton>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
