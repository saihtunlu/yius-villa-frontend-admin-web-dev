import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { List, Collapse } from '@mui/material';
import { useSelector } from 'react-redux';

import { NavItemRoot, NavItemSub } from './NavItem';
import { getActive } from '..';

export function NavListRoot({ list, isCollapse }) {
  const { pathname } = useLocation();
  var currentPath = list.path;
  const check = list.path.includes('?');
  if (check) {
    currentPath = currentPath.split('?')[0];
  }
  const active = getActive(currentPath, pathname);
  const navigate = useNavigate();
  const [open, setOpen] = useState(active);
  const user = useSelector((state) => state.auth.user);

  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active}
          open={open}
          onOpen={() => {
            setOpen(!open);
            // navigate(list.path);
          }}
        />

        {!isCollapse && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {(list.children || []).map(
                (item, index) => item.show(user) && <NavListSub key={item.title + index} list={item} />
              )}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return <NavItemRoot item={list} active={active} isCollapse={isCollapse} />;
}

// ----------------------------------------------------------------------

function NavListSub({ list }) {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(active);

  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemSub item={list} onOpen={() => setOpen(!open)} open={open} active={active} />

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map(
              (item, index) =>
                item.show(user) && (
                  <NavItemSub key={item.title + index} item={item} active={getActive(item.path, pathname)} />
                )
            )}
          </List>
        </Collapse>
      </>
    );
  }

  return <NavItemSub item={list} active={active} />;
}
