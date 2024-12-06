// material

import { Stack, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import address from '../../assets/constants/address';

export default function AddressPicker(props) {
  const { initialAddress, onChangeState, onChangeCity, onChangeStreetAddress, spacing } = props;
  return (
    <Stack spacing={spacing || 2.5}>
      <Stack spacing={spacing || 2.5} direction={{ xs: 'column', sm: 'row' }}>
        <FormControl fullWidth>
          <InputLabel id="state-select-label">State</InputLabel>
          <Select
            labelId="state-select-label-id"
            id="state-select-id"
            value={initialAddress?.state || ''}
            label="State"
            onChange={(event) => {
              onChangeState(event.target.value);
            }}
          >
            {address.map((val, index) => (
              <MenuItem key={`${index}-state`} value={val.value}>
                {val.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label-id"
            id="city-select-id"
            value={initialAddress?.city || ''}
            label="City"
            onChange={(event) => {
              onChangeCity(event.target.value);
            }}
          >
            {address
              .filter((state) => state?.value === initialAddress?.state)[0]
              ?.children.map((val, index) => (
                <MenuItem key={`${index}-city`} value={val.value}>
                  {val.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Stack>
      <TextField
        multiline
        fullWidth
        rows={3}
        label="Street address"
        placeholder="..."
        value={initialAddress?.address || ''}
        onChange={(event) => onChangeStreetAddress(event.target.value)}
      />
    </Stack>
  );
}
