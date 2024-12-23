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

  const avatars = [
    'avatar-1.webp',
    'avatar-2.webp',
    'avatar-3.webp',
    'avatar-4.webp',
    'avatar-5.webp',
    'avatar-6.webp',
    'avatar-7.webp',
    'avatar-8.webp',
    'avatar-9.webp',
    'avatar-10.webp',
    'avatar-11.webp',
    'avatar-12.webp',
    'avatar-13.webp',
    'avatar-14.webp',
    'avatar-15.webp',
    'avatar-16.webp',
    'avatar-17.webp',
    'avatar-18.webp',
    'avatar-19.webp',
    'avatar-20.webp',
    'avatar-21.webp',
  ];

  // Get the current day of the year, cycle it into the array range (0-20)
  const currentDay = new Date().getDate(); // Get day of the month (1 to 31)
  const avatarIndex = currentDay % avatars.length; // Use modulus to ensure it always selects a valid index

  const defaultAvatar = `/assets/avatar/${avatars[avatarIndex]}`;

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
                src={data?.avatar ? data?.avatar : defaultAvatar}
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
          src={user?.avatar ? user?.avatar : defaultAvatar}
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
