import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Grid2 as Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
  useThemeProps,
} from '@mui/material';
import { connect } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image-more';
import { LoadingButton } from '@mui/lab';

import Page from '../../components/common/Page';
import HeaderBreadcrumbs from '../../components/common/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../router/paths';
import EditEmployeeForm from '../../components/pages/employee/EditEmployeeForm';
import EditorSkeleton from '../../components/skeleton/EditorSkeleton';
import { INITIAL_EMPLOYEE } from '../../components/pages/employee/NewEmployeeForm';
import useQuery from '../../utils/RouteQuery';
import Img from '../../components/common/Img';
import Avatar from '../../components/common/Avatar';
import Iconify from '../../components/common/Iconify';

const EditEmployee = (props) => {
  const { store } = props;
  const [employee, setEmployee] = useState(INITIAL_EMPLOYEE);
  const [isReady, setIsReady] = useState(false);
  const theme = useTheme();
  const params = useParams();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [exporting, setExporting] = useState(false);

  const query = useQuery();
  const tab = query.get('tab');

  const getEmployee = (id) => {
    const url = 'employee/?id=' + id;
    axios.get(url).then(({ data }) => {
      setEmployee(data);
      setIsReady(true);
    });
  };

  // effects
  useEffect(() => {
    if (params.id) {
      getEmployee(params.id);
    }
    return () => {};
  }, [tab]);

  useEffect(() => {
    if (exporting) {
      setTimeout(() => {
        downloadImage();
      }, 1000);
    }
    return () => {};
  }, [exporting]);

  const downloadImage = async () => {
    const node = document.querySelector('#employee-id-card');
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
        link.download = `${employee.name}.png`; // Set the download file name
        link.click(); // Trigger the download
      })
      .catch(() => {})
      .finally(() => {
        setExporting(false);
      });
  };

  return (
    <Page title={'Edit Employee Page'} roleBased role={{ name: 'Employee', type: 'update' }}>
      <Grid container spacing={2.5}>
        <Grid size={12}>
          <HeaderBreadcrumbs
            heading={'Edit An Employee'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Employees',
                href: PATH_DASHBOARD.employee.list,
              },
              { name: employee.name },
            ]}
            action={
              <LoadingButton
                loading={exporting}
                variant="contained"
                color="black"
                onClick={() => {
                  setExporting(true);
                }}
                startIcon={<Iconify icon={'solar:gallery-download-bold-duotone'} />}
              >
                Export ID Card
              </LoadingButton>
            }
          />

          {isReady ? <EditEmployeeForm initialEmployee={employee} /> : <EditorSkeleton />}
        </Grid>
      </Grid>

      {exporting && (
        <Box
          id={'employee-id-card'}
          sx={{
            height: '355px',
            width: '211px',
            position: 'absolute',
            background: '#fff',
            overflow: 'hidden',
            top: '-100%',
          }}
        >
          <Stack
            sx={{ height: '100%', width: '100%', position: 'relative', pt: '10px' }}
            direction={'column'}
            spacing={1}
            alignItems={'center'}
          >
            <img alt="" crossOrigin="anonymous" src={store.logo + '?nocache=12345'} style={{ width: '115px' }} />
            <img
              alt=""
              crossOrigin="anonymous"
              src={employee.photo + '?nocache=31423'}
              style={{
                height: '110px',
                width: '110px',
                borderRadius: '100%',
                border: '5px solid #fff ',
                zIndex: 1,
              }}
            />
            <Stack alignItems={'center'} sx={{ width: '100%', zIndex: 1 }} spacing={0.5}>
              <Typography variant="subtitle1" sx={{ width: '100%', textAlign: 'center' }} color="#fff">
                {employee.name}
              </Typography>
              <Typography sx={{ fontSize: '9px !important', width: '100%', textAlign: 'center' }} color="#fff">
                {employee.position.name}
              </Typography>
            </Stack>

            {employee.em_id && (
              <>
                <Box
                  sx={{
                    borderRadius: '10px',
                    padding: '8px',
                    pb: '3px',
                    background: '#fff',
                    zIndex: 1,
                  }}
                >
                  <QRCodeSVG
                    value={employee.em_id} // The data to encode
                    size={85}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                  />
                </Box>
                <Typography
                  sx={{ fontSize: '8px !important', width: '100%', textAlign: 'center', zIndex: 1 }}
                  color="#fff"
                >
                  {employee.em_id}
                </Typography>
              </>
            )}
            <Box
              sx={{
                height: '400px',
                width: '100%',
                background: `linear-gradient(0deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                position: 'absolute',
                borderRadius: '25px',
                top: '35%',
                zIndex: 0,
              }}
            />
          </Stack>
        </Box>
      )}
    </Page>
  );
};
const mapStateToProp = (state) => {
  return {
    store: state.auth?.user?.store,
  };
};
export default connect(mapStateToProp)(EditEmployee);
