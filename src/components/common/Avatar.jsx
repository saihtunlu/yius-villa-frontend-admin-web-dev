// hooks
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { MEDIA_URL } from '../../config';
import createAvatar from '../../utils/createAvatar';
import MAvatar from './MAvatar';

export default function Avatar({
  user,
  users,
  animate = false,
  multiple = false,
  borderColor = 'transparent',
  ...other
}) {
  const theme = useTheme();

  if (multiple) {
    return (
      <Stack direction={'row'} sx={{ position: 'relative' }} alignItems={'center'}>
        {users.map(
          (data, index) =>
            index < 3 && (
              <MAvatar
                key={index + 'avatar'}
                sx={{
                  marginLeft: index !== 0 ? '-10px' : '0px',
                  width: '25px',
                  height: '25px',
                  border: '2px solid',

                  borderColor,
                }}
                src={data?.avatar ? data?.avatar : '/assets/img/default-avatar.png'}
                alt={data?.first_name}
                color={
                  data?.avatar && !data?.avatar.includes('default') ? 'default' : createAvatar(data?.first_name).color
                }
                {...other}
              >
                {data?.avatar && data?.avatar.includes('default') && createAvatar(data?.first_name).name}
              </MAvatar>
            )
        )}
        {users.length > 3 && <Typography variant="caption">+{users.length - 3}</Typography>}
      </Stack>
    );
  }
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1px',
      }}
    >
      {animate && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: 'rotate 5s linear infinite',
            borderRadius: '100%',
            background:
              'linear-gradient(90deg, rgba(98,63,163,0.8) 0%,rgba(221,129,176,0.8) 35%,  rgba(255,192,138,0.8) 100%)',
          }}
        />
      )}
      <Box
        sx={{
          background: theme.palette.background.default,
          padding: animate ? '1.5px' : '0px',
          borderRadius: '100%',
          zIndex: 1,
        }}
      >
        <MAvatar
          src={user?.avatar ? user?.avatar : '/assets/img/default-avatar.png'}
          alt={user?.first_name}
          color={user?.avatar && !user?.avatar.includes('default') ? 'default' : createAvatar(user?.first_name).color}
          {...other}
        >
          {user?.avatar && user?.avatar.includes('default') && createAvatar(user?.first_name).name}
        </MAvatar>
      </Box>
    </Box>
  );
}
