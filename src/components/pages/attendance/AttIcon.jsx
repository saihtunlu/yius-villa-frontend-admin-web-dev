import { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { alpha, Box, Popper, Stack, styled, useTheme } from '@mui/material';
import { AnimatePresence, m } from 'framer-motion';

import Iconify from '../../common/Iconify';
import { varFade, varZoom } from '../../animate';
import cssStyles from '../../../utils/cssStyles';
import { fTime } from '../../../utils/formatTime';
import Avatar from '../../common/Avatar';

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
  minWidth: '200px',
  paddingBottom: '1px',
}));

export default function AttIcon({ icon, color, bgColor, data, user }) {
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
    <div>
      <Box
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          background: bgColor || (isLight ? theme.palette.grey[200] : theme.palette.grey[600]),
          borderRadius: '100%',
          width: '30px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Iconify color={color || (isLight ? theme.palette.grey[600] : theme.palette.grey[200])} icon={icon} />
      </Box>

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
            <Stack
              sx={{ p: 1.2, borderBottom: '1px solid ' + theme.palette.divider }}
              direction={'row'}
              alignItems={'center'}
            >
              <Avatar
                user={{
                  avatar: user.photo,
                  first_name: user.name,
                }}
                sx={{ width: '20px', height: '20px' }}
              />

              <Typography variant="overline" sx={{ pl: 1 }}>
                {user.name}
              </Typography>
            </Stack>

            <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={'2'} alignItems={'center'}>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  background: color || (isLight ? theme.palette.grey[600] : theme.palette.grey[200]),
                  borderRadius: '100%',
                }}
              />
              <Typography variant="body2" sx={{ pl: 1 }}>
                {data.status}
              </Typography>
            </Stack>

            <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={0.5} alignItems={'center'}>
              <Typography variant="caption" sx={{}}>
                {data.date}
              </Typography>
            </Stack>

            {data.check_in_time && (
              <Stack sx={{ px: 2, pt: 2 }} direction={'row'} spacing={1} alignItems={'center'}>
                <Typography variant="caption" sx={{ pr: 1 }}>
                  {fTime(data.check_in_time)}
                </Typography>
                -
                <Typography variant="caption" sx={{}}>
                  {data.check_out_time ? fTime(data.check_out_time) : 'No Check Out'}
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
                maxWidth: '250px',
              }}
            >
              <Typography variant="caption" sx={{}}>
                {data.remarks || 'Remarks'}
              </Typography>
            </Stack>
          </RootStyle>
        </Popper>
      </AnimatePresence>
    </div>
  );
}
