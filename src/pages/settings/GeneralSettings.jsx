import { useEffect, useState } from 'react';
import { Grid2 as Grid, Box, Tab, Tabs } from '@mui/material';
import { connect } from 'react-redux';

import { capitalCase } from 'change-case';
import { useNavigate } from 'react-router-dom';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import StoreGeneralForm from '../../components/pages/settings/StoreGeneralForm';
import useQuery from '../../utils/RouteQuery';
import SettingSkeleton from '../../components/skeleton/SettingSkeleton';
import PayrollTemplates from '../../components/pages/settings/PayrollTemplates';
import StorePaymentMethods from '../../components/pages/settings/StorePaymentMethods';
import PackingSlipTemplates from '../../components/pages/settings/PackingSlipTemplates';
import VoucherTemplate from '../../components/pages/settings/VoucherTemplate';
import SaleSlipTemplates from '../../components/pages/settings/SaleSlipTemplates';

import RoleList from '../../components/pages/settings/RoleList';
import Iconify from '../../components/common/Iconify';
import { INITIAL_STORE } from '../../redux/slices/store';
import WebsiteContacts from '../../components/pages/settings/WebsiteContacts';

const StoreSettings = (props) => {
  const { store } = props;
  const [currentTab, setCurrentTab] = useState('general');
  const navigate = useNavigate();
  const query = useQuery();
  const tab = query.get('tab');
  const SETTING_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'solar:shop-bold-duotone'} />,
      component: <StoreGeneralForm />,
    },
    {
      value: 'Website Contacts',
      icon: <Iconify icon={'fluent:plug-connected-20-filled'} />,
      component: store.id ? <WebsiteContacts /> : <SettingSkeleton />,
    },

    {
      value: 'Payment Methods',
      icon: <Iconify icon={'solar:card-bold-duotone'} />,
      component: store.id ? <StorePaymentMethods /> : <SettingSkeleton />,
    },
    {
      value: 'Payroll Templates',
      icon: <Iconify icon={'solar:dollar-bold-duotone'} />,
      component: <PayrollTemplates />,
    },
    {
      value: 'Packing Slip Templates',
      icon: <Iconify icon={'solar:box-bold-duotone'} />,
      component: <PackingSlipTemplates />,
    },
    {
      value: 'Voucher Templates',
      icon: <Iconify icon={'solar:gallery-bold-duotone'} />,
      component: <VoucherTemplate />,
    },
    {
      value: 'Sale Slip Templates',
      icon: <Iconify icon={'solar:printer-minimalistic-bold-duotone'} />,
      component: <SaleSlipTemplates />,
    },
    {
      value: 'Role',
      icon: <Iconify icon={'solar:shield-user-bold-duotone'} />,
      component: <RoleList />,
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
    <Page title={'Store settings page'} roleBased role={{ name: 'General Setting', type: 'read' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Settings'}
            hideBack
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Settings',
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
              navigate(PATH_DASHBOARD.settings.general + '?tab=' + value);
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
  store: state.auth?.user?.store || INITIAL_STORE,
});

export default connect(mapStateToProps)(StoreSettings);
