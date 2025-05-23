import { NavLink as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { Box, Link, ListItemText } from '@mui/material';
//
import Iconify from '../../common/Iconify';
import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from './style';
import { isExternalLink } from '..';
import Label from '../../common/Label';

// ----------------------------------------------------------------------

export function NavItemRoot({ item, isCollapse, open = false, active, onOpen }) {
  const { title, path, icon, info, children } = item;
  const badge = useSelector((state) => state.badge);

  var totalBadge = 0;
  if (item.badge) {
    totalBadge = Object.values(badge[item.badge]).reduce((acc, value) => acc + value, 0);
  }

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle disableTypography primary={title} isCollapse={isCollapse} />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
      {totalBadge !== 0 && (
        <Label color="error" variant="filled" sx={{ borderRadius: '100px' }}>
          {totalBadge}
        </Label>
      )}
    </>
  );

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  );
}

// ----------------------------------------------------------------------

export function NavItemSub({ item, open = false, active = false, onOpen }) {
  const { title, path, info, children } = item;

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  );

  if (children) {
    return (
      <ListItemStyle
        onClick={() => {
          onOpen();
        }}
        activeSub={active}
        subItem
      >
        {renderContent}
      </ListItemStyle>
    );
  }

  return isExternalLink(path) ? (
    <ListItemStyle component={Link} href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle component={RouterLink} to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  );
}

export function DotIcon({ active }) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.disabled',
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          ...(active && {
            transform: 'scale(2)',
            bgcolor: 'primary.main',
          }),
        }}
      />
    </ListItemIconStyle>
  );
}

export function ArrowIcon({ open }) {
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      sx={{ width: 16, height: 16, ml: 1 }}
    />
  );
}
