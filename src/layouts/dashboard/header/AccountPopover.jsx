import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Avatar from '../../../components/common/Avatar';
import { IconButtonAnimate } from '../../../components/animate';
import MenuPopover from '../../../components/common/MenuPopover';
import { PATH_DASHBOARD, PATH_AUTH } from '../../../router/paths';
import { handleLogOut } from '../../../redux/slices/auth';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  // {
  //   label: 'Home',
  //   linkTo: '/',
  // },
  {
    label: 'Profile',
    linkTo: PATH_DASHBOARD.settings.account,
  },
  {
    label: 'Settings',
    linkTo: PATH_DASHBOARD.settings.general,
  },
];

function AccountPopover({ user }) {
  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout_ = async () => {
    try {
      await handleLogOut();
      navigate(PATH_AUTH.login, { replace: true });

      if (isMountedRef.current) {
        handleClose();
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar animate user={user} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          pb: 1,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.first_name} ${user?.last_name}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />

        <Stack sx={{}}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed', mt: 1, mb: 1 }} />

        <MenuItem onClick={handleLogout_} sx={{ m: '8px !important' }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth?.user,
  };
};
export default connect(mapStateToProps)(AccountPopover);
