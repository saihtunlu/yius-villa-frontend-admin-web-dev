import { ReactNode, useState } from 'react';
import { LoadingButton } from '@mui/lab';

// @mui
import { MenuItem, ListItemText, MenuItemProps, Button } from '@mui/material';
import Iconify from './Iconify';
import MenuPopover from './MenuPopover';

export default function SelectMenu({ actions, value, onChange, loading = false }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <LoadingButton
        loading={loading}
        variant="outlined"
        color="black"
        onClick={handleOpen}
        endIcon={<Iconify icon={'icon-park-outline:down'} />}
      >
        {value}
      </LoadingButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -1,
          width: 160,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        {actions.map((action, index) => (
          <MenuItem
            key={`${index}-more-menu-item`}
            {...action.props}
            onClick={() => {
              handleClose();
              onChange(action);
            }}
          >
            <ListItemText primary={action} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
