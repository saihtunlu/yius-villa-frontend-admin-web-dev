import { memo } from 'react';
// @mui
import { Stack } from '@mui/material';
//
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

const hideScrollbar = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

function NavSectionHorizontal({ navConfig }) {
  return (
    <Stack direction="row" justifyContent="center" sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}>
      <Stack direction="row" sx={{ ...hideScrollbar, py: 1 }}>
        {navConfig.map((group, index_) => (
          <Stack key={`nav-subheader-${index_}`} direction="row" flexShrink={0}>
            {group.items.map((list, index) => (
              <NavListRoot key={`nav-list-root-${index}`} list={list} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default memo(NavSectionHorizontal);
