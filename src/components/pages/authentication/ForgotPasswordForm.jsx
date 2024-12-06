import { TextField, Stack } from '@mui/material';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';

import { forgot } from '../../../redux/actions';
import { PATH_AUTH } from '../../../router/paths';
import useQuery from '../../../utils/RouteQuery';

function ForgotPasswordForm(props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const emailParam = query.get('email') || '';
  const [email, setEmail] = useState(emailParam);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    forgot(email)
      .then((uid) => {
        setLoading(false);
        const bufUid = Buffer.from(`${uid}`);
        const bufEmail = Buffer.from(email);

        navigate(`${PATH_AUTH.verify}?uid=${bufUid.toString('base64')}&email=${bufEmail.toString('base64')}`);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          required
          type="email"
          label={'Email address'}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Reset Password
        </LoadingButton>
      </Stack>
    </form>
  );
}

export default ForgotPasswordForm;
