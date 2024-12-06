import { TextField, Button, Stack, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { fSubdomain } from '../../../utils/formatString';

export const STORE_TYPES = [
  'Beauty',
  'Clothing',
  'Electronics',
  'Furniture',
  'Handcrafts',
  'Jewelry',
  'Painting',
  'Photography',
  'Restaurants',
  'Groceries',
  'Other food & drink',
  'Sports',
  'Toys',
  'Services',
  'Virtual services',
  'Other',
  "I havn't decided yet",
];

function StoreRegisterForm({ onSubmitStore, onBack, initialStore }) {
  const [store, setStore] = useState({
    name: '',
    subdomain_name: '',
    email: '',
    phone: '',
    type: '',
    settings: {
      currency: 'MMK',
      tax_type: 'Exclusive',
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitStore(store);
  };

  useEffect(() => {
    setStore(initialStore);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          sx={{ width: '100%' }}
          label={'Name'}
          value={store.name}
          required
          onChange={(event) => {
            setStore((preState) => {
              return {
                ...preState,
                name: event.target.value,
                subdomain_name: fSubdomain(event.target.value),
              };
            });
          }}
        />
        <TextField
          sx={{ width: '100%' }}
          label={'Phone number'}
          required
          type={'number'}
          value={store.phone}
          onChange={(event) => {
            setStore((preState) => {
              return { ...preState, phone: event.target.value };
            });
          }}
        />
        <TextField
          sx={{ width: '100%' }}
          label={'Email address'}
          value={store.email}
          required
          type={'email'}
          onChange={(event) => {
            setStore((preState) => {
              return { ...preState, email: event.target.value };
            });
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="store-type-label">Type</InputLabel>
          <Select
            labelId="store-type-label-id"
            id="store-type-id"
            value={store.type}
            label="State"
            onChange={(event) => {
              setStore((preState) => {
                return { ...preState, type: event.target.value };
              });
            }}
          >
            {STORE_TYPES.map((val, index) => (
              <MenuItem key={`${index}-state`} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button fullWidth size="large" type="submit" variant="contained">
          Continue
        </Button>
        <Button fullWidth size="large" onClick={() => onBack(0)} variant="text">
          Back
        </Button>
      </Stack>
    </form>
  );
}

export default StoreRegisterForm;
