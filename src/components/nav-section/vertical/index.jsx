// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
import { useSelector } from 'react-redux';

// type
//
import { NavListRoot } from './NavList';
import TextMaxLine from '../../common/TextMaxLine';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    width: '100%',
    WebkitBoxOrient: 'vertical',
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

export default function NavSectionVertical({ navConfig, isCollapse = false, sx, ...other }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <Box
      sx={{
        maxHeight: `calc(100vh - 190px)`,
        overflow: 'auto',
        ...sx,
      }}
      {...other}
    >
      {navConfig.map(
        (group, index) =>
          group.show(user) && (
            <List key={`${group.subheader + index}-drawer`} disablePadding sx={{ px: 2 }}>
              {!isCollapse && (
                <ListSubheaderStyle
                  sx={{
                    ...(isCollapse && {
                      width: '0%',
                    }),
                  }}
                >
                  <TextMaxLine variant="overline" line={1}>
                    {group.subheader}
                  </TextMaxLine>
                </ListSubheaderStyle>
              )}

              {group.items.map(
                (list, index) =>
                  list.show(user) && <NavListRoot key={list.title + index} list={list} isCollapse={isCollapse} />
              )}
            </List>
          )
      )}
    </Box>
  );
}
