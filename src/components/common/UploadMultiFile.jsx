import { isString } from 'lodash';
import { Icon } from '@iconify/react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import fileFill from '@iconify/icons-eva/file-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { AnimatePresence, m } from 'framer-motion';
import { alpha, Theme, styled } from '@mui/material/styles';
import { Box, List, Paper, ListItem, Typography, ListItemIcon, ListItemText, IconButton } from '@mui/material';

import UploadIllustration from '../../assets/illustrations/illustration_upload';
import { fData } from '../../utils/formatNumber';
import { varFade } from '../animate';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
  [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' },
}));

const getFileData = (file) => {
  if (typeof file === 'string') {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
  };
};
export default function UploadMultiFile({ error, files, onRemove, sx, ...other }) {
  const hasFile = files.length > 0;

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
  });

  const ShowRejectionItems = () => (
    <Paper
      variant="outlined"
      sx={{
        py: 1,
        px: 2,
        mt: 3,
        borderColor: 'error.light',
        bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
      }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = file;
        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {fData(size)}
            </Typography>
            {errors.map((e) => (
              <Typography key={e.code} variant="caption" component="p">
                - {e.message}
              </Typography>
            ))}
          </Box>
        );
      })}
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} accept=".jpeg,.jpg,.png,.gif" type="file" />

        <UploadIllustration sx={{ width: 220 }} />

        <Box sx={{ p: 3, ml: { md: 2 } }}>
          <Typography gutterBottom variant="h5">
            Drop or Select file
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drop files here or click&nbsp;
            <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
              browse
            </Typography>
            &nbsp;thorough your machine
          </Typography>
        </Box>
      </DropZoneStyle>

      {fileRejections.length > 0 && <ShowRejectionItems />}
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files.map((file) => {
            const { key, name, size } = getFileData(file);

            return (
              <ListItem
                key={key}
                component={m.div}
                {...varFade().inRight}
                sx={{
                  my: 1,
                  py: 0.75,
                  px: 2,
                  borderRadius: 1,
                  border: (theme) => `solid 1px ${theme.palette.divider}`,
                  bgcolor: 'background.paper',
                }}
                secondaryAction={
                  <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                    <Icon icon={closeFill} />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Icon icon={fileFill} width={28} height={28} />
                </ListItemIcon>
                <ListItemText
                  primary={isString(file) ? file : name}
                  secondary={isString(file) ? '' : fData(size || 0)}
                  primaryTypographyProps={{ variant: 'subtitle2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            );
          })}
        </AnimatePresence>
      </List>
    </Box>
  );
}
