import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';
import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import NewUserForm from '../../components/pages/user/NewUserForm';

const CreateUser = () => {
  return (
    <Page title={'Create User Page'} roleBased role={{ name: 'User', type: 'create' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Create An User'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'User List',
                href: PATH_DASHBOARD.employee.list,
              },
              { name: 'New User' },
            ]}
          />
          <NewUserForm />
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(CreateUser);
