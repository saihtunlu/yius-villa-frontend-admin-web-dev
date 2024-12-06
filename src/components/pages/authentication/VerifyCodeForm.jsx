import { styled, Typography, Link, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import ReactCodeInput from 'react-verification-code-input';
import { useSnackbar } from 'notistack';
import useQuery from '../../../utils/RouteQuery';
import { forgot, verify } from '../../../redux/actions';
import { PATH_AUTH } from '../../../router/paths';

function VerifyCodeForm(props) {
  // constants
  const { onGetEmail } = props;
  const query = useQuery();
  const uidQuery = query.get('uid') || '';
  const emailQuery = query.get('email') || '';
  const bufUid = Buffer.from(uidQuery, 'base64');
  const bufEmail = Buffer.from(emailQuery, 'base64');
  const uid = bufUid.toString('ascii');
  const email = bufEmail.toString('ascii');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [seconds, setSeconds] = useState(0);

  const CodeInput = styled(ReactCodeInput)(({ theme }) => ({
    width: '100% !important',
    '& .styles_react-code-input__CRulA': {
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& input': {
      width: 'calc(calc(100% / 6) - 5px) !important',
      border: `1px solid ${theme.palette.grey[500_32]} !important`,
      borderRadius: `${theme.shape.borderRadiusSm}px !important`,
      background: `${theme.palette.background.paper} !important`,
      outline: 'none',
      height: '48px  !important',
      boxShadow: 'none  !important',
      textAlign: 'center !important',
      lineHeight: '48px  !important',
      padding: '0px !important',
      ...theme.typography.h5,
      color: `${theme.palette.text.primary} !important`,
    },
    '& input:focus': {
      border: `2px solid ${theme.palette.primary.main} !important`,
      caretColor: `${theme.palette.primary.main} !important`,
    },
    '& input:hover': {
      border: `1px solid ${theme.palette.text.primary} !important`,
      caretColor: `${theme.palette.primary.main} !important`,
    },
  }));

  // effects
  useEffect(() => {
    if (!query.has('email') || !query.has('uid')) {
      navigate(PATH_AUTH.forgotPassword);
    }
    onGetEmail(email);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    verify({ uid, code })
      .then((data) => {
        setLoading(false);
        enqueueSnackbar(data.detail, { variant: 'success' });
        const bufUid = Buffer.from(`${data.uid}`);
        const bufToken = Buffer.from(data.token);
        navigate(`${PATH_AUTH.resetPassword}?uid=${bufUid.toString('base64')}&token=${bufToken.toString('base64')}`);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const resendEmail = () => {
    setSeconds(60);

    const countdown = setInterval(
      () =>
        setSeconds((prevState) => {
          const value = prevState - 1;
          if (value === 0) {
            clearInterval(countdown);
          }
          return value;
        }),
      1000
    );
    forgot(email).then(() => {
      enqueueSnackbar('Resend success', { variant: 'success' });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <CodeInput
          values={code.split('')}
          onChange={(value) => {
            setCode(value);
          }}
          required
          placeholder={['-', '-', '-', '-', '-', '-']}
          type="number"
          fields={6}
        />
        <Typography variant="body2">
          Don’t have a code? &nbsp;
          <Link
            variant="subtitle2"
            sx={{ cursor: 'pointer' }}
            color={seconds > 0 ? 'gray' : 'primary'}
            underline="none"
            onClick={() => seconds === 0 && resendEmail()}
          >
            Resend code {seconds > 0 && `(${seconds})s`}
          </Link>
        </Typography>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Verify
        </LoadingButton>
      </Stack>
    </form>
  );
}

export default VerifyCodeForm;
