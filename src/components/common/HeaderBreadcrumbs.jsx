import { ReactNode } from 'react';
import { isString } from 'lodash';
// material
import { Box, Typography, Link, Stack, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//
import Breadcrumbs from './Breadcrumbs';
import Iconify from './Iconify';

export default function HeaderBreadcrumbs({
  links,
  action,
  heading,
  moreLink = '' || [],
  status,
  hideBack = false,
  sx,
  ...other
}) {
  const navigate = useNavigate();
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            {!hideBack && (
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="m15 5l-6 7l6 7"
                  />
                </svg>
              </IconButton>
            )}

            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Breadcrumbs links={links} {...other} />
            {status && status.map((item) => item)}
          </Stack>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link noWrap key={href} href={href} variant="body2" target="_blank" sx={{ display: 'table' }}>
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
