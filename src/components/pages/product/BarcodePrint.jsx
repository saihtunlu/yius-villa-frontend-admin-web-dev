import { Box, Stack, Tab, Tabs, Button, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import Barcode from 'react-barcode';
import Iconify from '../../common/Iconify';

export default function BarcodePrint({ value, onChangeValue, price }) {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <Stack
        id="print-area"
        className="print-barcode"
        justifyContent={'center'}
        direction={'column'}
        alignItems={'center'}
        ref={contentRef}
        width={'100%'}
      >
        <Barcode value={value} width={1} height={60} fontSize={10} />
        <Typography align="center" fontSize={12}>
          {price}Ks
        </Typography>
      </Stack>

      <Stack spacing={2.5} direction={'row'} alignItems={'center'} width={'100%'}>
        <TextField fullWidth label="Barcode" value={value} onChange={onChangeValue} />

        <Tooltip title="Print barcode">
          <IconButton aria-label="print-barcode" sx={{ width: 45, height: 45 }} onClick={reactToPrintFn}>
            <Iconify icon={'solar:printer-minimalistic-bold-duotone'} />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
