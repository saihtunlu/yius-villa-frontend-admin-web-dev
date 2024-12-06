import { Grid2 as Grid } from '@mui/material';
import { connect } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import PayRollForm from '../../components/pages/payroll/PayRollForm';

export const INITIAL_PAYROLL = {
  employee: {
    name: '',
    started_date: null,
    status: 'Active',
    basic_salary: null,
    position: { name: '' },
    department: { name: '' },
    emergency_phone: null,
    phone: '',
    employee_address: {
      address: '',
      city: '',
      state: '',
    },
    note: '',
    dob: null,
    nrc_no: '',
    gender: '',
    photo: null,
  },
  status: 'Draft',
  pay_period_start: null,
  pay_period_end: null,
  items: [
    {
      amount: 0,
      description: '',
      type: '',
    },
  ],
  total: 0,
  note: '',
};

const CreatePayroll = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    setLoading(true);
    axios
      .post('employee/payroll/', { data })
      .then(({ data }) => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        navigate(PATH_DASHBOARD.payroll.edit(data.id));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Page title={'Create Payroll Page'} roleBased role={{ name: 'Payroll', type: 'create' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Create Payroll'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Payroll',
                href: PATH_DASHBOARD.payroll.list,
              },
              { name: 'New Payroll' },
            ]}
          />
          <PayRollForm initialData={INITIAL_PAYROLL} loading={loading} onSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(CreatePayroll);
