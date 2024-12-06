import { Grid2 as Grid } from '@mui/material';
import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';

import AttendanceSettingForm from '../../components/pages/attendance/AttendanceSettingForm';

const AttendanceSetting = () => {
  return (
    <Page title={'Attendance Setting Page'} roleBased role={{ name: 'Attendance', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Settings'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Attendance',
                href: PATH_DASHBOARD.attendance.list,
              },
              { name: 'Settings' },
            ]}
          />
          <AttendanceSettingForm />
        </Grid>
      </Grid>
    </Page>
  );
};

export default AttendanceSetting;
