import { ReactNode } from 'react';
import { isString } from 'lodash';
// material
import { Box, Typography, Link, Stack } from '@mui/material';
//
import Breadcrumbs from './Breadcrumbs';

export default function HeaderBreadcrumbs({ links, action, heading, moreLink = '' || [], status, sx, ...other }) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {heading}
          </Typography>
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
