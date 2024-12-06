import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';
import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import NewEmployeeForm from '../../components/pages/employee/NewEmployeeForm';

const CreateEmployee = () => {
  return (
    <Page title={'Create Employee Page'} roleBased role={{ name: 'Employee', type: 'create' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Create An Employee'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Employee List',
                href: PATH_DASHBOARD.employee.list,
              },
              { name: 'New Employee' },
            ]}
          />
          <NewEmployeeForm />
        </Grid>
      </Grid>
    </Page>
  );
};

export default CreateEmployee;
