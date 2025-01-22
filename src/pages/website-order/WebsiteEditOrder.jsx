import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Grid2 as Grid, MenuItem, Skeleton, Stack, useTheme } from '@mui/material';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { sentenceCase } from 'change-case';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image-more';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import OrderEditForm from '../../components/pages/website-order/OrderEditForm';
import Label from '../../components/common/Label';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import { INITIAL_ORDER } from '../../components/pages/order/OrderNewForm';
import Iconify from '../../components/common/Iconify';

const statusTitles = ['Active', 'Payment added', 'Payment verified', 'Parcel packaged', 'Cancelled', 'Refunded'];

const WebsiteEditOrder = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [printing, setPrinting] = useState(false);
  const [printContent, setPrintContent] = useState('');
  const [exporting, setExporting] = useState(false);
  const [printingSaleSlip, setPrintingSaleSlip] = useState(false);
  const [order, setOrder] = useState(INITIAL_ORDER);
  const [isReady, setIsReady] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState({
    status: '',
    payment_status: '',
    is_fulfilled: false,
    pending_task: '',
  });
  const params = useParams();
  const theme = useTheme();

  // effects
  useEffect(() => {
    if (params.id) {
      getOrder();
      // getVoucherContent(params.id);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrder = () => {
    const url = 'order/?id=' + params.id;
    axios.get(url).then(({ data }) => {
      setOrder(data);
      setStatus({
        status: data.status,
        payment_status: data.payment_status,
        is_fulfilled: data.is_fulfilled,
        pending_task: data.pending_task,
      });
      setIsReady(true);
    });
  };

  const printPackingSlip = () => {
    setPrinting(true);
    const url = `printing/order/?id=${order.id}&type=packing_slip`;
    axios
      .get(url)
      .then(({ data }) => {
        setPrintContent(data);
        getOrder();
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

  return (
    <Page title={"Edit Website Order Page | Yiu's Villa"} roleBased role={{ name: 'Order', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Edit an order'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Orders',
                href: PATH_DASHBOARD.websiteOrder.list,
              },
              { name: order.order_no || 'Order ID' },
            ]}
            action={
              <Stack direction={'row'} spacing={2}>
                <LoadingButton
                  variant="outlined"
                  loading={printing}
                  key={'Packing'}
                  color="black"
                  onClick={() => {
                    printPackingSlip();
                  }}
                  startIcon={<Iconify icon={'solar:printer-minimalistic-bold-duotone'} />}
                >
                  Print Packing Slip
                </LoadingButton>
              </Stack>
            }
          />

          {isReady ? <OrderEditForm initialOrder={order} /> : <EditorSkeleton />}

          {printContent && (
            <div ref={contentRef} className="print-are" dangerouslySetInnerHTML={{ __html: printContent }} />
          )}
        </Grid>
      </Grid>
    </Page>
  );
};
export default WebsiteEditOrder;
