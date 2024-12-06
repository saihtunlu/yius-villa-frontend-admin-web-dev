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
import OrderEditForm from '../../components/pages/order/OrderEditForm';
import Label from '../../components/common/Label';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import { INITIAL_ORDER } from '../../components/pages/order/OrderNewForm';
import Iconify from '../../components/common/Iconify';
import SelectMenu from '../../components/common/SelectMenu';
import MenuPopover from '../../components/common/MenuPopover';

const statusTitles = ['Active', 'Cancelled', 'Completed', 'Refunded'];

const EditOrder = () => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [printing, setPrinting] = useState(false);
  const [printContent, setPrintContent] = useState('');
  const [exporting, setExporting] = useState(false);
  const [printingSaleSlip, setPrintingSaleSlip] = useState(false);
  const [voucherContent, setVoucherContent] = useState('');
  const [order, setOrder] = useState(INITIAL_ORDER);
  const [isReady, setIsReady] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState({
    status: '',
    payment_status: '',
    is_fulfilled: false,
    pending_task: '',
  });
  const params = useParams();
  const theme = useTheme();

  const { collapseClick, onToggleCollapse } = useCollapseDrawer();
  const actions = [
    {
      label: 'Export Voucher',
      func: () => getVoucherContent(),
      icon: <Iconify sx={{ mr: 1 }} icon={'solar:gallery-download-bold-duotone'} />,
    },
    {
      label: 'Print Packing Slip',
      func: () => printPackingSlip(),
      icon: <Iconify sx={{ mr: 1 }} icon={'solar:box-bold-duotone'} />,
    },
    {
      label: 'Print Order Slip',
      func: () => printSaleSlip(),
      icon: <Iconify sx={{ mr: 1 }} icon={'solar:printer-minimalistic-bold-duotone'} />,
    },
  ];

  useEffect(() => {
    // if (!collapseClick) {
    //   onToggleCollapse();
    // }
    return () => {
      // if (collapseClick) {
      //   onToggleCollapse();
      // }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapseClick]);

  // effects
  useEffect(() => {
    if (params.id) {
      getOrder(params.id);
      // getVoucherContent(params.id);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrder = (id) => {
    const url = 'sale/?sid=' + id;
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

  const handleUpdateStatus = (status) => {
    setUpdatingStatus(true);
    const url = 'sale/status/';
    axios
      .put(url, {
        data: {
          status,
          text: `Changed status to "${status}".`,
          id: order.id,
        },
      })
      .then(({ data }) => {
        enqueueSnackbar('Update status success', { variant: 'success' });
        setOrder(data);
        setUpdatingStatus(false);
      })
      .catch(() => {
        setUpdatingStatus(false);
      });
  };

  const printPackingSlip = () => {
    setPrinting(true);
    const url = `printing/sale/?sid=${order.id}&type=packing_slip`;
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

  const getVoucherContent = () => {
    setExporting(true);
    const url = `printing/sale/?sid=${order.id}&type=voucher`;
    axios
      .get(url)
      .then(({ data }) => {
        downloadImage(data);
      })
      .catch(() => {
        setExporting(false);
      });
  };

  const downloadImage = async (data) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data; // Inject the HTML content
    // Append the hidden element to the body temporarily
    document.body.appendChild(tempDiv);
    const node = tempDiv.querySelector('#export-voucher-content');

    const images = Array.from(node.getElementsByTagName('img'));
    const loadPromises = images.map((img) => {
      // If image is not loaded, wait for it to load
      if (!img.complete) {
        return new Promise((resolve) => {
          img.onload = resolve; // Resolve the promise when the image is loaded
          img.onerror = resolve; // Resolve on error as well
        });
      }
      // If image is already loaded, resolve immediately
      return Promise.resolve();
    });
    await Promise.all(loadPromises);

    if (node) {
      domtoimage
        .toPng(node, {
          width: node.clientWidth * 5,
          height: node.clientHeight * 5,
          style: {
            transform: 'scale(' + 5 + ')',
            transformOrigin: 'top left',
          },
        })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${order.customer.name}-${order.id}.png`; // Set the download file name
          link.click(); // Trigger the download
        })
        .catch((error) => {
          console.error('Error converting HTML to image:', error);
        })
        .finally(() => {
          // Clean up by removing the temporary element after conversion
          document.body.removeChild(tempDiv);
          setExporting(false);
        });
    } else {
      setExporting(false);

      console.error('The specified node (#content-to-download) was not found.');
    }
  };

  const printSaleSlip = () => {
    setPrintingSaleSlip(true);
    const url = `printing/sale/?sid=${order.id}&type=sale_slip`;
    axios
      .get(url)
      .then(({ data }) => {
        setPrintContent(data);
        setTimeout(() => {
          setPrintingSaleSlip(false);
          reactToPrintFn();
          setPrintContent('');
        }, 100);
      })
      .catch(() => {
        setPrintingSaleSlip(false);
        setPrintContent('');
      });
  };
  return (
    <Page title={"Edit Order Page | Yiu's Villa"} roleBased role={{ name: 'Order', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          {status.pending_task && (
            <Alert severity="warning" sx={{ mb: 2.5 }}>
              {status.pending_task}
            </Alert>
          )}
          <HeaderBreadcrumbs
            heading={'Edit an order'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Orders',
                href: PATH_DASHBOARD.order.list,
              },
              { name: order.sale_no || 'Order ID' },
            ]}
            action={
              <Stack direction={'row'} spacing={2}>
                <SelectMenu
                  value={order.status}
                  loading={updatingStatus}
                  actions={statusTitles}
                  color="black"
                  onChange={(val) => {
                    handleUpdateStatus(val);
                  }}
                />
                {/* <LoadingButton
                  variant="outlined"
                  key={'Voucher'}
                  loading={exporting}
                  color="black"
                  onClick={() => {
                    getVoucherContent();
                  }}
                  startIcon={<Iconify icon={'solar:gallery-download-bold-duotone'} />}
                >
                  Export Voucher
                </LoadingButton>

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
                </LoadingButton> */}
                <LoadingButton
                  variant="contained"
                  loading={printingSaleSlip || printing || exporting}
                  color="black"
                  key={'Order'}
                  endIcon={<Iconify icon={'solar:alt-arrow-down-linear'} />}
                  onClick={handleOpen}
                >
                  Actions
                </LoadingButton>

                <MenuPopover
                  open={Boolean(open)}
                  anchorEl={open}
                  onClose={handleClose}
                  aria-labelledby="order-action-title"
                  aria-describedby="order-action-description"
                  sx={{
                    mt: 1.5,
                    ml: 0.75,
                    width: 180,
                    '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
                  }}
                >
                  <Stack spacing={0.75}>
                    {actions.map((action) => (
                      <MenuItem
                        key={action.label}
                        onClick={() => {
                          action.func();
                          setOpen(null);
                        }}
                      >
                        {action.icon}

                        {action.label}
                      </MenuItem>
                    ))}
                  </Stack>
                </MenuPopover>
              </Stack>
            }
            status={
              isReady
                ? [
                    <Label
                      key="order-status"
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (status.status === 'Archived' && 'error') ||
                        (status.status === 'Draft' && 'warning') ||
                        'success'
                      }
                    >
                      {sentenceCase(status.status)}
                    </Label>,
                    <Label
                      key="order-payment-status"
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (status.payment_status === 'Unpaid' && 'error') ||
                        (status.payment_status === 'Partially Paid' && 'warning') ||
                        'success'
                      }
                    >
                      {sentenceCase(status.payment_status)}
                    </Label>,
                    <Label
                      key="order-fulfill-status"
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={(!status.is_fulfilled && 'warning') || 'success'}
                    >
                      {status.is_fulfilled ? 'Fulfilled' : 'Not Fulfilled'}
                    </Label>,
                  ]
                : [
                    <Skeleton
                      variant="rectangular"
                      sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
                      width={80}
                      height={28}
                      key="order-status-1"
                    />,
                    <Skeleton
                      sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
                      variant="rectangular"
                      width={80}
                      height={28}
                      key="order-status-2"
                    />,
                    <Skeleton
                      sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
                      variant="rectangular"
                      width={80}
                      height={28}
                      key="order-status-3"
                    />,
                  ]
            }
          />
          {isReady ? (
            <OrderEditForm
              initialOrder={order}
              onUpdateStatus={(status) => {
                setStatus(status);
              }}
            />
          ) : (
            <EditorSkeleton />
          )}

          {printContent && (
            <div ref={contentRef} className="print-are" dangerouslySetInnerHTML={{ __html: printContent }} />
          )}
        </Grid>
      </Grid>
    </Page>
  );
};
const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(EditOrder);
