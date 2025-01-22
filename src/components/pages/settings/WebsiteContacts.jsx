import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import {
  Box,
  Card,
  Button,
  Typography,
  CardProps,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// @types
import { connect, useSelector } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { isInteger } from 'lodash';
import { LoadingButton } from '@mui/lab';

import {
  updateWebsiteContact,
  addWebsiteContact,
  deleteWebsiteContact,
  getWebsiteContacts,
} from '../../../redux/slices/websiteContact';
import Img from '../../common/Img';
import Media from '../../common/Media';
import Iconify from '../../common/Iconify';
import { ColorSinglePicker } from '../../common/color-utils';
import { allCities } from '../../../assets/constants/address';

const INITIAL_CONTACT = {
  type: '',
  value: '',
  label: '',
  image: '/media/default.png',
};

function WebsiteContacts() {
  const contacts = useSelector((state) => state.websiteContact);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const theme = useTheme();

  const [type, setType] = useState('edit');
  const [selectedContact, setSelectedContact] = useState(INITIAL_CONTACT);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getWebsiteContacts();
  }, []);
  const handleClickOpen = (type, index) => {
    setType(type);

    if (type === 'edit' && isInteger(index)) {
      setSelectedContact(contacts[index || 0]);
    } else {
      setSelectedContact(INITIAL_CONTACT);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedContact(INITIAL_CONTACT);
    setOpen(false);
  };
  const handleDeletePayment = (id) => {
    deleteWebsiteContact(id).then(() => {
      enqueueSnackbar('Delete success', { variant: 'success' });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (type === 'edit') {
      updateWebsiteContact(selectedContact)
        .then(() => {
          setLoading(false);
          enqueueSnackbar('Update success', { variant: 'success' });
          handleClose();
          setSelectedContact(INITIAL_CONTACT);
        })
        .catch(() => {
          setSelectedContact(INITIAL_CONTACT);

          setLoading(false);
        });
    } else {
      addWebsiteContact(selectedContact)
        .then(() => {
          setLoading(false);
          enqueueSnackbar('Add success', { variant: 'success' });
          handleClose();
          setSelectedContact(INITIAL_CONTACT);
        })
        .catch(() => {
          setLoading(false);
          setSelectedContact(INITIAL_CONTACT);
        });
      setLoading(false);
    }
  };
  return (
    <>
      <Card>
        <Stack spacing={2.5} sx={{ p: 2.5 }} alignItems="flex-start">
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Website Contacts
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              },

              width: '100%',
            }}
          >
            {contacts.map((contact, index) => (
              <Stack
                key={`${index}-payment-method`}
                sx={{
                  p: 2,
                  width: '100%',
                  // margin: '10px',
                  bgcolor: 'background.neutral',
                  borderRadius: theme.shape.borderRadius + 'px',
                }}
                spacing={2}
              >
                <Img
                  src={contact.image}
                  sx={{ width: '100px', height: '100px', borderRadius: theme.shape.borderRadiusSm + 'px' }}
                />
                <Stack spacing={1.5}>
                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Type
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {contact.type}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Label
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {contact.label || '-'}
                    </Typography>
                  </Stack>

                  <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant="body1" color={'text.secondary'} gutterBottom>
                      Value
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {contact.value || '-'}
                    </Typography>
                  </Stack>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />}
                      onClick={() => {
                        handleDeletePayment(contact.id || '');
                      }}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Iconify icon={'solar:pen-new-round-bold-duotone'} />}
                      onClick={() => handleClickOpen('edit', index)}
                    >
                      Edit
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Box>

          <Button size="small" onClick={() => handleClickOpen('add')} startIcon={<Iconify icon="mynaui:plus-solid" />}>
            Add new payment method
          </Button>
        </Stack>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="store-payment-method-dialog"
        aria-describedby="store-payment-method-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="store-payment-method-dialog">
          {type === 'edit' ? selectedContact.name : 'New Payment Method'}
        </DialogTitle>

        <DialogContent sx={{ pb: 0 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5} sx={{ mt: 2.5 }}>
              <Media
                initialSelected={[{ image: selectedContact.image }]}
                single
                onChange={(data) => {
                  setSelectedContact((preState) => {
                    return { ...preState, image: data[0]?.full_url };
                  });
                }}
              />
              <TextField
                sx={{ width: '100%' }}
                label={'Label'}
                value={selectedContact.label}
                onChange={(event) => {
                  setSelectedContact((preState) => {
                    return {
                      ...preState,
                      label: event.target.value,
                    };
                  });
                }}
              />

              <Stack spacing={2.5} direction={'row'}>
                <FormControl sx={{ width: '30%' }}>
                  <InputLabel id="payroll-type-select-label">Type</InputLabel>
                  <Select
                    labelId="payroll-type-select-label-id"
                    id="payroll-type-select-id"
                    value={selectedContact.type || ''}
                    label="Type"
                    onChange={(event) => {
                      setSelectedContact((preState) => {
                        return { ...preState, type: event.target.value };
                      });
                    }}
                  >
                    {['link', 'phone'].map((val, index) => (
                      <MenuItem key={`${index}-state`} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  sx={{ width: '100%' }}
                  label={'Description'}
                  value={selectedContact.value}
                  placeholder="..."
                  onChange={(event) => {
                    setSelectedContact((preState) => {
                      return { ...preState, value: event.target.value };
                    });
                  }}
                />
              </Stack>
            </Stack>
            <input hidden type={'submit'} ref={inputRef} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color={'black'} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant={'contained'}
            color={'black'}
            onClick={() => {
              inputRef.current?.click();
            }}
            autoFocus
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WebsiteContacts;
