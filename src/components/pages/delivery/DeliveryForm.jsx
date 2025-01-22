import { useState, useEffect } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Media from '../../common/Media';
import AddressPicker from '../../common/AddressPicker';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function DeliveryForm({ onClose, onUpdate, data, loading = false, type = 'Edit', open = false }) {
  const [value, setValue] = useState(data);

  useEffect(() => {
    setValue(data);
  }, [data]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(value);
  };
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
      <form onSubmit={handleSubmit}>
        <DialogTitle variant="subtitle1" id="discount-dialog">
          {type} Delivery
        </DialogTitle>

        <DialogContent sx={{}}>
          <Stack spacing={2.5} sx={{ mt: 2.5 }}>
            <Media
              initialSelected={[{ image: value.image }]}
              single
              caption=""
              onChange={(data) => {
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.image = data[0]?.full_url;
                  return newState;
                });
              }}
            />

            <TextField
              fullWidth
              label="Name"
              value={value.name}
              onChange={(event) =>
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.name = event.target.value;
                  return newState;
                })
              }
            />

            <TextField
              value={value.telephone}
              onChange={(event) =>
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.telephone = event.target.value;
                  return newState;
                })
              }
              fullWidth
              required
              label="Office Phone number"
            />

            <TextField
              value={value.contact_person}
              onChange={(event) =>
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.contact_person = event.target.value;
                  return newState;
                })
              }
              fullWidth
              required
              label="Main Contact Phone number"
            />

            <AddressPicker
              initialAddress={value.delivery_address}
              onChangeState={(state) => {
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));

                  newState.delivery_address = {
                    ...preState.delivery_address,
                    state,
                  };
                  return newState;
                });
              }}
              onChangeCity={(city) => {
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));

                  newState.delivery_address = {
                    ...preState.delivery_address,
                    city,
                  };
                  return newState;
                });
              }}
              onChangeStreetAddress={(address) => {
                setValue((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.delivery_address = {
                    ...preState.delivery_address,
                    address,
                  };
                  return newState;
                });
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={value.active}
                  onChange={() => {
                    setValue((preState) => {
                      var newState = JSON.parse(JSON.stringify(preState));
                      newState.active = !newState.active;
                      return { ...newState };
                    });
                  }}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="black" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={loading} variant={'contained'} color={'black'} type="submit">
            Confirm
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default DeliveryForm;
