//
import { useState, useRef, useEffect } from 'react';
// @mui
import {
  Card,
  Button,
  Container,
  DialogTitle,
  useTheme,
  Typography,
  Grid2 as Grid,
  Box,
  Dialog,
  Skeleton,
  Popper,
  styled,
  Stack,
  alpha,
} from '@mui/material';
import { AnimatePresence, m } from 'framer-motion';
import moment from 'moment';

import Avatar from '../../common/Avatar';
import { varFade } from '../../animate';
import cssStyles from '../../../utils/cssStyles';
import { fTime } from '../../../utils/formatTime';
import TextMaxLine from '../../common/TextMaxLine';

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper, opacity: 0.72 }),
  backgroundImage: `url(/assets/img/cyan-blur.png), url(/assets/img/red-blur.png)`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: '50%, 50%',
  transition: ' box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundPosition: 'right top, left bottom',
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
    0.16
  )}`,
  minWidth: '300px',
  paddingBottom: '1px',
}));

const EventItem = ({ event }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Stack key={event.id}>
      <Stack
        direction={'row'}
        spacing={1}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          p: 1,
          backgroundColor: event.backgroundColor || theme.palette.primary,
          color: event.textColor || '#ffffff',
          boxShadow: `0px 8px 16px 0px ${event.backgroundColor}33`,
          borderRadius: theme.shape.borderRadius + 'px',
        }}
      >
        <Avatar
          users={[
            ...event.extendedProps.attendees.map((user) => ({
              avatar: user.photo,
              first_name: user.name,
            })),
          ]}
          borderColor={event.backgroundColor}
          multiple
        />

        <TextMaxLine line={1} variant="body2">
          {event.title}
        </TextMaxLine>
      </Stack>

      <AnimatePresence>
        <Popper id="att-icon-popover" open={open} anchorEl={anchorEl}>
          <RootStyle
            {...varFade({
              distance: 120,
              durationIn: 0.32,
              durationOut: 0.24,
              easeIn: 'easeInOut',
            }).in}
          >
            <Stack sx={{ p: 1.2, borderBottom: '1px solid ' + theme.palette.divider }} alignItems={'center'}>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {moment(event.start).format('DD MMM YYYY')} - {moment(event.end).format('DD MMM YYYY')}
              </Typography>
            </Stack>
            <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={0.5} alignItems={'center'}>
              {event.extendedProps.attendees.map((user, index) => {
                return (
                  <Avatar
                    key={index + 'avatar'}
                    user={{
                      avatar: user.photo,
                      first_name: user.name,
                    }}
                    sx={{ width: '35px', height: '35px' }}
                  />
                );
              })}
            </Stack>
            <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={'2'} alignItems={'center'}>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  background: event.backgroundColor || (isLight ? theme.palette.grey[600] : theme.palette.grey[200]),
                  borderRadius: '100%',
                }}
              />
              <Typography variant="body2" sx={{ pl: 1 }}>
                {event.title}
              </Typography>
            </Stack>
            {!event.allDay && (
              <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={1} alignItems={'center'}>
                <Typography variant="caption" sx={{ pr: 1 }}>
                  {fTime(event.start)}
                </Typography>
                -
                <Typography variant="caption" sx={{}}>
                  {fTime(event.end)}
                </Typography>
              </Stack>
            )}

            <Stack
              sx={{
                p: 1,
                border: `0.1rem dashed ${theme.palette.divider}`,
                borderRadius: theme.spacing(1),
                margin: '10px',
                marginBottom: '9px',
              }}
            >
              <Typography variant="caption">{event.extendedProps.description}</Typography>
            </Stack>
          </RootStyle>
        </Popper>
      </AnimatePresence>
    </Stack>
  );
};

export default EventItem;
