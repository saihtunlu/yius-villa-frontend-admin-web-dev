import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
// material
import { useTheme, styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  Typography,
  InputAdornment,
  OutlinedInput,
  Menu,
  Button,
  MenuItem,
  Stack,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import useResponsive from '../../hooks/useResponsive';
import Iconify from './Iconify';
// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2.5) + ' !important',
  background: theme.palette.background.paper,
}));

export default function ProductListToolbar({
  numSelected,
  filterName,
  sortList,
  onFilterName,
  selectedSorting,
  onSelectSorting,
  actions,
  input,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterName_, setFilterName_] = useState(filterName);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event, value) => {
    if (value !== 'backdropClick') {
      onSelectSorting(value);
    }
    setAnchorEl(null);
  };

  const isLight = theme.palette.mode === 'light';

  const handleKeyDown = (e) => {
    console.log('🚀 ~ handleKeyDown ~ e:', e);
    // Check if Enter key (key code 13 or 'Enter')
    if (e.keyCode === 13) {
      // Trigger search or apply filter when Enter is pressed
      onFilterName(filterName_); // Call the function to apply the filter
    }
  };

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: isLight ? 'primary.main' : 'text.primary',
          bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
        }),
        height: 96,
        marginBottom: 0,
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction={'row'} spacing={2.5}>
          <TextField
            value={filterName_}
            sx={{ minWidth: '280px' }}
            onChange={(e) => setFilterName_(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search ..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={'mynaui:search'} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {input && input}
        </Stack>
      )}

      {numSelected > 0 ? (
        <Stack direction={'row'} spacing={1}>
          {actions.map((node) => node)}
        </Stack>
      ) : (
        sortList && (
          <Stack spacing={1.5} direction={'row'} justifyContent={'flex-end'}>
            <Box>
              <Tooltip title="Sort by">
                <IconButton onClick={handleClick}>
                  <Iconify icon={'solar:sort-vertical-bold-duotone'} />
                </IconButton>
              </Tooltip>

              <Menu
                id="sort-by"
                MenuListProps={{
                  'aria-labelledby': 'sort-by',
                }}
                keepMounted
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {},
                  },
                }}
              >
                {sortList.map((option, index) => (
                  <MenuItem
                    key={option.value + index}
                    selected={option.value === selectedSorting}
                    onClick={(event) => handleClose(event, option.value)}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Stack>
        )
      )}
    </RootStyle>
  );
}
