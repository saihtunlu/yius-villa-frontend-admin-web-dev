import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import { connect } from 'react-redux';
import Avatar from '../../../components/common/Avatar';
import { PATH_DASHBOARD } from '../../../router/paths';
// hooks

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

function NavbarAccount({ isCollapse, user }) {
  return (
    <Link underline="none" color="inherit" component={RouterLink} to={PATH_DASHBOARD.settings.account}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <Avatar animate user={user} />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {user?.first_name + ' ' + user?.last_name}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.role?.name}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.auth?.user,
  };
};
export default connect(mapStateToProps)(NavbarAccount);
