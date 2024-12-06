import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import AddressPicker from '../../common/AddressPicker';

function LocationRegisterForm({ onSubmitLocation, onBack, initialLocation, loading }) {
  const [location, setLocation] = useState({
    is_default: true,
    location_address: {
      state: '',
      city: '',
      address: '',
      map: '',
    },
    name: 'Default',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitLocation(location);
  };

  useEffect(() => {
    setLocation(initialLocation);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <AddressPicker
          initialAddress={location.location_address}
          onChangeState={(state) => {
            setLocation((preState) => {
              return {
                ...preState,
                location_address: {
                  ...preState.location_address,
                  state,
                },
              };
            });
          }}
          onChangeCity={(city) => {
            setLocation((preState) => {
              return {
                ...preState,
                location_address: { ...preState.location_address, city },
              };
            });
          }}
          onChangeStreetAddress={(address) => {
            setLocation((preState) => {
              return {
                ...preState,
                location_address: {
                  ...preState.location_address,
                  address,
                },
              };
            });
          }}
        />

        <LoadingButton loading={loading} fullWidth size="large" type="submit" variant="contained">
          Register
        </LoadingButton>
        <Button fullWidth size="large" onClick={() => onBack(1)} variant="text">
          Back
        </Button>
      </Stack>
    </form>
  );
}

export default LocationRegisterForm;
