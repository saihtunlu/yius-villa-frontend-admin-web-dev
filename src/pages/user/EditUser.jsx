import { useEffect, useState } from 'react';
import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import EditUserForm from '../../components/pages/user/EditUserForm';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';

const EditUser = () => {
  const [user, setUser] = useState({});

  const [isReady, setIsReady] = useState(false);
  const params = useParams();

  const getUser = (id) => {
    const url = 'user/?id=' + id;
    axios.get(url).then(({ data }) => {
      setUser(data);
      setIsReady(true);
    });
  };

  // effects
  useEffect(() => {
    if (params.id) {
      getUser(params.id);
    }
    return () => {};
  }, [params]);

  return (
    <Page title={"Edit User Page | Yiu's Villa"} roleBased role={{ name: 'User', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Edit An User'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Users',
                href: PATH_DASHBOARD.user.list,
              },
              { name: user?.first_name || '-' },
            ]}
          />

          {isReady ? <EditUserForm user={user} /> : <EditorSkeleton />}
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(EditUser);
