import { ReactNode, useState } from 'react';
// @mui
import { MenuItem, IconButton, ListItemIcon, ListItemText, MenuItemProps } from '@mui/material';
import Iconify from './Iconify';
import MenuPopover from './MenuPopover';

export default function MoreMenu({ actions }) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

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
          px: 0,
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        {actions.map((action, index) => (
          <MenuItem key={`${index}-more-menu-item`} {...action.props}>
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.text} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}
