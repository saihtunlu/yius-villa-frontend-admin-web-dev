import { Icon } from '@iconify/react';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
// material
import {
  Grid2 as Grid,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  IconButton,
  useTheme,
  OutlinedInput,
  List,
  ListSubheader,
  Divider,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import searchFill from '@iconify/icons-eva/search-fill';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Avatar from '../../common/Avatar';
import Iconify from '../../common/Iconify';
import SearchNotFound from '../../common/SearchNotFound';
import TextMaxLine from '../../common/TextMaxLine';

const IconStyle = styled(Icon)(({ theme }) => ({
  color: 'text.disabled',
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  // border: `solid 1px ${theme.palette.divider}`,
  overflow: 'hidden',
}));

export default function PayrollItem({ initialData, onUpdateAmount, onUpdateType, onUpdateDescription, onRemove }) {
  const [data, setData] = useState(initialData);

  const theme = useTheme();

  useEffect(() => {
    setData(initialData);
    return () => {};
  }, [initialData]);

  return (
    <>
      <Stack
        spacing={2.5}
        direction={{
          sm: 'column',
          md: 'row',
          lg: 'row',
        }}
        sx={{
          borderBottom: `0.1rem dashed ${theme.palette.divider}`,
          py: 2.5,
        }}
        alignItems={'center'}
      >
        <TextField
          label="Description"
          sx={{ width: 'calc(60% - 60px)' }}
          value={data.description}
          onChange={(event) => onUpdateDescription(event.target.value)}
        />

        <FormControl sx={{ width: '20%' }}>
          <InputLabel id="payroll-type-select-label">Type</InputLabel>
          <Select
            labelId="payroll-type-select-label-id"
            id="payroll-type-select-id"
            value={data.type || ''}
            label="Type"
            onChange={(event) => {
              onUpdateType(event.target.value);
            }}
          >
            {['Allowance', 'Deduction'].map((val, index) => (
              <MenuItem key={`${index}-state`} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          sx={{ width: '20%' }}
          label="Amount"
          slotProps={{
            input: {
              sx: {
                color: data.type === 'Allowance' ? theme.palette.success.main : theme.palette.error.main,
              },
              endAdornment: <InputAdornment position="end">Ks</InputAdornment>,
              type: 'number',
              inputMode: 'numeric',
              inputProps: { min: 0 },
            },
          }}
          value={data.amount}
          onChange={(event) => onUpdateAmount(event.target.value)}
        />
        <Tooltip title="Remove">
          <IconButton onClick={onRemove} sx={{ width: '45px', height: '45px' }}>
            <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
}
