import { Box, Stack, Tab, Tabs, Button, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import Barcode from 'react-barcode';
import Iconify from '../../common/Iconify';

export default function BarcodePrint({ value, onChangeValue, price, regularPrice }) {
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
        sx={{
          position: 'relative',
        }}
        width={'100%'}
      >
        <Barcode value={value} width={1} height={55} fontSize={10} />
        {regularPrice !== 0 && (
          <Typography
            align="center"
            fontSize={12}
            variant="span"
            sx={{
              position: 'absolute',
              margin: 0,
              textDecoration: 'line-through',
              marginTop: '-4mm',
              zIndex: 1,
              fontWeight: 700,
              textAlign: 'center',
              left: 0,
              right: 0,
            }}
          >
            {regularPrice}Ks
          </Typography>
        )}
        <Typography
          align="center"
          fontSize={14}
          variant="span"
          sx={{
            position: 'absolute',
            margin: 0,
            marginTop: '-1mm',
            zIndex: 1,
            fontWeight: 700,
            textAlign: 'center',
            left: 0,
            right: 0,
          }}
        >
          {price}Ks
        </Typography>
      </Stack>

      <Stack spacing={2.5} direction={'row'} alignItems={'center'} width={'100%'}>
        <TextField
          fullWidth
          label="Barcode"
          sx={{ cursor: 'not-allowed' }}
          value={value}
          // disabled
          // onChange={onChangeValue}
        />

        <Tooltip title="Print barcode">
          <IconButton aria-label="print-barcode" sx={{ width: 45, height: 45 }} onClick={reactToPrintFn}>
            <Iconify icon={'solar:printer-minimalistic-bold-duotone'} />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
