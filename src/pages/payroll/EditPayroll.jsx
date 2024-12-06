import { Grid2 as Grid, Stack } from '@mui/material';
import { connect } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useReactToPrint } from 'react-to-print';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import PayRollForm from '../../components/pages/payroll/PayRollForm';
import { INITIAL_PAYROLL } from './CreatePayroll';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';
import Iconify from '../../components/common/Iconify';
import Print from '../../components/common/Print';

const EditPayroll = () => {
  const params = useParams();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [printing, setPrinting] = useState(false);
  const [printContent, setPrintContent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [data, setData] = useState({});

  // effects
  useEffect(() => {
    if (params.id) {
      getPayroll(params.id);
    }
    return () => {};
  }, []);

  const getPrintingTemplate = () => {
    setPrinting(true);
    const url = `printing/payroll/?id=${params.id}`;
    axios
      .get(url)
      .then(({ data }) => {
        setPrintContent(data);
        setTimeout(() => {
          setPrinting(false);
          reactToPrintFn();
          setPrintContent('');
        }, 100);
      })
      .catch(() => {
        setPrinting(false);
        setPrintContent('');
      });
  };

  const getPayroll = (id) => {
    const url = 'employee/payroll/?id=' + id;
    axios.get(url).then(({ data }) => {
      setData(data);
      setIsReady(true);
    });
  };

  const handleSubmit = (data) => {
    setLoading(true);
    axios
      .put('employee/payroll/', { data })
      .then((data) => {
        setLoading(false);
        enqueueSnackbar('Create success', { variant: 'success' });
        // navigate(PATH_DASHBOARD.order.edit(data.id));
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <Page title={'Edit Payroll Page'} roleBased role={{ name: 'Payroll', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            action={
              <Stack direction={'row'} spacing={2}>
                <LoadingButton
                  variant="outlined"
                  loading={printing}
                  color="black"
                  onClick={() => {
                    getPrintingTemplate();
                  }}
                  startIcon={<Iconify icon={'solar:printer-minimalistic-bold-duotone'} />}
                >
                  Print
                </LoadingButton>
              </Stack>
            }
            heading={'Edit Payroll'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Payroll',
                href: PATH_DASHBOARD.payroll.list,
              },
              { name: `#${data?.id || '-'}` },
            ]}
          />

          {isReady ? (
            <PayRollForm initialData={data} edit loading={loading} onSubmit={handleSubmit} />
          ) : (
            <EditorSkeleton />
          )}

          {printContent && <div ref={contentRef} dangerouslySetInnerHTML={{ __html: printContent }} />}
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(EditPayroll);
