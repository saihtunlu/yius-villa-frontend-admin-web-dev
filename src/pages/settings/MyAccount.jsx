import { useEffect, useState } from 'react';
import { Grid2 as Grid, Box, Tab, Tabs } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { capitalCase } from 'change-case';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import useQuery from '../../utils/RouteQuery';
import UserEditForm from '../../components/pages/settings/UserEditForm';
import ChangePasswordForm from '../../components/pages/settings/ChangePasswordForm';
import SettingSkeleton from '../../components/skeleton/SettingSkeleton';
import { INITIAL_USER } from '../../redux/reducer/auth';
import Iconify from '../../components/common/Iconify';

const MyAccount = (props) => {
  const { user } = props;
  const [currentTab, setCurrentTab] = useState('general');
  const navigate = useNavigate();
  const query = useQuery();
  const tab = query.get('tab');
  const SETTING_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'solar:user-bold-duotone'} />,
      component: user.id ? <UserEditForm initialUser={user} /> : <SettingSkeleton />,
    },
    {
      value: 'change password',
      icon: <Iconify icon={'solar:shield-keyhole-minimalistic-bold-duotone'} />,
      component: <ChangePasswordForm />,
    },
  ];

  // effects
  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
    return () => {};
  }, [tab]);

  return (
    <Page title={'My account page'}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'My Account'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Profile',
              },
              { name: capitalCase(currentTab) },
            ]}
          />
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => {
              navigate(PATH_DASHBOARD.settings.account + '?tab=' + value);
            }}
          >
            {SETTING_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          <Box sx={{ mb: 4 }} />

          {SETTING_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Grid>
      </Grid>
    </Page>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth?.user || INITIAL_USER,
});

export default connect(mapStateToProps)(MyAccount);
