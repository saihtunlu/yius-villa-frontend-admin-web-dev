import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid2,
  ImageList,
  ImageListItem,
  useTheme,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  alpha,
  Box,
  styled,
} from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import expandFill from '@iconify/icons-eva/expand-fill';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';

import Scrollbar from './Scrollbar';
import UploadMultiFile from './UploadMultiFile';
import { getImages, removeImage, uploadImages } from '../../redux/actions';
import LightboxModal from './LightboxModal';
import Img from './Img';
import { varBounce, varFade, varZoom } from '../animate';
import Iconify from './Iconify';

const SingleRootStyle = styled('div')(({ theme, sx }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  ...sx,
}));

const ButtonStyle = styled('div')(({ theme, sx }) => ({
  zIndex: 0,
  width: '100%',
  height: '100%',
  outline: 'none',
  display: 'flex',
  overflow: 'hidden',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': { width: '100%', height: '100%' },
  '&:hover': {
    cursor: 'pointer',
    '& .placeholder': {
      zIndex: 9,
    },
  },
  ...sx,
}));

const PlaceholderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': { opacity: 0.72 },
}));

const Media = ({ imagesState, initialSelected, onChange, single, caption, profile = false }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [selected, setSelected] = useState([]);
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState({
    count: 0,
    current_page: 1,
    next: 1,
    previous: null,
    total_pages: 1,
    results: [],
  });
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedLightBoxImage, setSelectedLightBoxImage] = useState(0);
  const theme = useTheme();
  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    setImages(imagesState);
    return () => {};
  }, [imagesState]);

  useEffect(() => {
    const initialData = initialSelected.map((img) => ({
      full_url: img.image,
    }));

    setSelected(initialData);

    setImages((prevState) => {
      // Create a new array with updated `isSelected` values without mutating `prevState`
      const updatedImages = prevState.results.map((img) => {
        const isSelected = initialData.some((img2) => img.full_url === img2.full_url);
        return { ...img, isSelected };
      });

      return { ...prevState, results: updatedImages };
    });
  }, [imagesState, initialSelected]);
  // handlers
  const handleClickOpen = () => () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeTap = (event, newValue) => {
    setTab(newValue);
  };

  const checkFiles = (files) => {
    // Allowed file extensions
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif'];
    // Max file size in bytes (3 MB)
    const maxSize = 3 * 1024 * 1024;

    var message = '';
    var isValid = true;

    files.forEach((file) => {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Validate file type
      if (!allowedExtensions.includes(fileExtension)) {
        message = 'Invalid file type. Allowed types are: .jpeg, .jpg, .png, .gif';
        enqueueSnackbar(message, { variant: 'error' });
        isValid = false;
      }

      // Validate file size
      if (file.size > maxSize) {
        message = 'File is too large. Maximum size is 3 MB.';
        enqueueSnackbar(message, { variant: 'error' });
        isValid = false;
      }
    });
    return isValid;
  };
  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      if (checkFiles(acceptedFiles)) {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }
    },
    [setFiles]
  );
  const handleRemoveAll = () => {
    setFiles([]);
  };
  const handleUpload = () => {
    setUploading(true);
    uploadImages(files)
      .then(() => {
        setTab(0);
        setFiles([]);
        setUploading(false);
      })
      .catch(() => {
        setUploading(false);
      });
  };
  const handleChoose = () => {
    const selectedImages = images.results.filter((img) => img.isSelected);
    onChange(selectedImages);
    setOpen(false);
  };
  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };
  const handleDeleteFiles = () => {
    setRemoving(true);
    var data = [];
    images.results.forEach((image) => {
      if (image.isSelected) {
        data.push(image.id);
      }
    });
    removeImage(data)
      .then(() => {
        setRemoving(false);
      })
      .catch(() => {
        setRemoving(false);
      });
  };
  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };
  const imagesLightbox = images.results.map((image) => image.full_url);

  const handleOpenLightbox = (index) => {
    setSelectedLightBoxImage(index);
    setOpenLightbox(true);
  };

  const hasFiles = files.length > 0;
  const selectedImages = images.results.filter((img) => img.isSelected);

  return (
    <div>
      {single ? (
        <Stack alignItems={'center'} direction={'row'} justifyContent={'flex-start'}>
          <Stack justifyContent={'flex-start'} spacing={2}>
            <SingleRootStyle sx={{ borderRadius: profile ? '100%' : theme.shape.borderRadius + 'px' }}>
              <ButtonStyle
                sx={{ borderRadius: profile ? '100%' : theme.shape.borderRadius + 'px' }}
                onClick={handleClickOpen()}
              >
                {selected[0] && (
                  <Img
                    fullLink
                    lightbox
                    src={selected[0]?.full_url}
                    alt={`selected-image-single`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                <PlaceholderStyle
                  className="placeholder"
                  sx={{
                    ...(selected[0] && {
                      opacity: 0,
                      color: 'common.white',
                      bgcolor: 'grey.900',
                      '&:hover': { opacity: 0.72 },
                    }),
                  }}
                >
                  <Iconify icon={'solar:camera-bold-duotone'} width={35} height={35} />
                  <Typography variant="caption">{selected[0] ? 'Update photo' : 'Upload photo'}</Typography>
                </PlaceholderStyle>
              </ButtonStyle>
            </SingleRootStyle>
            {caption && (
              <Typography textAlign={'center'} variant="caption" color="text.secondary">
                {caption}
              </Typography>
            )}
          </Stack>
        </Stack>
      ) : (
        <Scrollbar
          sx={{
            width: 1,
            border: '1px solid ' + theme.palette.divider,
            borderRadius: theme.shape.borderRadiusSm + 'px',
            padding: 1.5,
            display: 'flex',
            flexDirection: 'row',
            '& .simplebar-content': {
              width: 1,
              display: 'flex',
              flexDirection: 'row',
            },
          }}
        >
          {selected.map((img, index) => {
            return (
              <Box
                key={`${index}-selected-image`}
                sx={{
                  p: 0,
                  m: 0.5,
                  width: 100,
                  minWidth: 100,
                  height: 100,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'inline-flex',
                }}
              >
                <Img
                  fullLink
                  lightbox
                  src={img.full_url}
                  alt={`selected-image-${index}`}
                  sx={{ objectFit: 'cover' }}
                  ratio="1/1"
                />
                <Box sx={{ top: 6, right: 6, position: 'absolute' }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setSelected((preState) => {
                        preState.splice(index, 1);
                        onChange(preState);
                        return [...preState];
                      })
                    }
                    sx={{
                      p: '2px',
                      color: 'common.white',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      },
                    }}
                  >
                    <Icon icon={closeFill} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
          <Box
            sx={{
              p: 0,
              m: 0.5,
              minWidth: 100,
              height: 100,
              borderRadius: 1.5,
              overflow: 'hidden',
              position: 'relative',
              display: 'inline-flex',
            }}
          >
            <Button
              onClick={handleClickOpen()}
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                padding: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: theme.shape.borderRadiusSm + 'px',
                border: '2px dashed ' + theme.palette.divider,
                color: 'text.secondary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
                '&:hover .MuiSvgIcon-root': {
                  color: theme.palette.primary.main,
                },
                '&:hover .MuiTypography-root': {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Stack alignItems={'center'}>
                <Iconify icon={'solar:camera-bold-duotone'} width={35} height={35} />
                <Typography variant="caption" color={theme.palette.text.disabled}>
                  Choose Image
                </Typography>
              </Stack>
            </Button>
          </Box>
        </Scrollbar>
      )}

      <Dialog
        open={open}
        fullWidth
        maxWidth={'lg'}
        id="media-library-dialog"
        onClose={handleClose}
        aria-labelledby="media-title"
        aria-describedby="media-description"
      >
        <DialogTitle variant="subtitle1" id="media-library">
          Media library
        </DialogTitle>
        <DialogContent dividers sx={{ py: 0, minHeight: 'calc(100vh - 200px)' }}>
          <Tabs
            value={tab}
            onChange={handleChangeTap}
            aria-label="media tabs"
            sx={{
              position: 'sticky',
              top: 0,
              background: theme.palette.background.paper,
              zIndex: 1,
            }}
          >
            <Tab disableTouchRipple label="Select from library" {...a11yProps(0)} />
            <Tab label="Upload new" disableTouchRipple {...a11yProps(1)} />
          </Tabs>
          {tab === 0 && (
            <Grid2 container spacing={0}>
              <Grid2
                size={{ md: 8, lg: 9 }}
                sx={{
                  borderRight: {
                    lg: '1px solid ' + theme.palette.divider,
                  },
                }}
              >
                <ImageList
                  sx={{
                    width: '100%',
                    height: 'calc(100vh - 255px)',
                    my: 0,
                    py: 2.5,
                    pr: 2.5,
                  }}
                  cols={7}
                >
                  {images.results.map((item, index) => {
                    return (
                      <ImageListItem
                        key={item.full_url + index}
                        sx={{
                          '&:hover .expend-lightbox': {
                            opacity: 1,
                          },
                        }}
                      >
                        <IconButton
                          className="expend-lightbox"
                          sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 1,
                            p: 1,
                            borderRadius: '10px',
                            opacity: 0,
                          }}
                          size="small"
                          color="primary"
                          onClick={() => handleOpenLightbox(index)}
                        >
                          <Icon icon={expandFill} width={20} height={20} />
                        </IconButton>
                        <Button
                          variant={item.isSelected ? 'contained' : 'text'}
                          onClick={() => {
                            if (!single) {
                              setImages((preState) => {
                                var newState = JSON.parse(JSON.stringify(preState));
                                newState.results[index].isSelected = !newState.results[index].isSelected;
                                return newState;
                              });
                            } else {
                              setImages((preState) => {
                                var newState = JSON.parse(JSON.stringify(preState));
                                newState.results.forEach((img, index2) => (img.isSelected = index2 === index));
                                return newState;
                              });
                            }
                          }}
                          sx={{
                            p: '3px',
                            borderRadius: theme.shape.borderRadiusSm + 'px',
                            lineHeight: 0,
                          }}
                        >
                          <Img
                            fullLink
                            src={item.full_url}
                            alt={item.full_url}
                            sx={{
                              cursor: 'pointer',
                              borderRadius: theme.shape.borderRadius + 'px',

                              objectFit: 'cover',
                            }}
                            ratio="1/1"
                          />
                        </Button>
                      </ImageListItem>
                    );
                  })}

                  <ImageListItem cols={7} sx={{ mt: 3 }}>
                    <Stack justifyContent={'center'} direction={'row'} alignItems={'center'}>
                      <Tooltip title="Load More images">
                        <IconButton
                          onClick={() => {
                            getImages(images.next);
                          }}
                        >
                          <Iconify icon={'si:expand-more-alt-fill'} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ImageListItem>
                </ImageList>
              </Grid2>
              <Grid2
                size={{
                  xs: 12,
                  md: 4,
                  lg: 3,
                }}
                sx={{
                  order: { lg: 1, md: 1, sm: -1, xs: -1 },
                }}
              >
                <Stack
                  direction={'row'}
                  sx={{ pb: 2.5 }}
                  mx={2.5}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography variant="subtitle3">({selectedImages.length}) Selected</Typography>
                  {selectedImages.length > 0 && (
                    <Tooltip title="Delete selected images">
                      <IconButton onClick={handleDeleteFiles} disabled={removing}>
                        <Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                <ImageList
                  sx={{
                    width: '100%',
                    my: 0,
                    px: 2.5,
                  }}
                  cols={3}
                  rowHeight={'auto'}
                >
                  {selectedImages.map((item, index) => {
                    return (
                      <ImageListItem component={m.div} key={item.full_url + index} {...varFade().in}>
                        <Img
                          fullLink
                          src={item.full_url}
                          alt={item.full_url}
                          sx={{
                            borderRadius: theme.shape.borderRadius + 'px',
                            objectFit: 'cover',
                          }}
                          ratio="1/1"
                        />
                      </ImageListItem>
                    );
                  })}
                </ImageList>
              </Grid2>
            </Grid2>
          )}
          {tab === 1 && (
            <Grid2 container spacing={0} sx={{ overflowX: 'hidden' }}>
              <Grid2 size={12}>
                <UploadMultiFile
                  accept="image/*"
                  files={files}
                  onDrop={handleDropMultiFile}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                  sx={{ my: 2.5 }}
                />
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        {tab === 0 && (
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color={'black'}>
              Cancel
            </Button>
            <Button variant={'contained'} color={'black'} onClick={handleChoose}>
              Choose
            </Button>
          </DialogActions>
        )}
        {tab === 1 && (
          <DialogActions>
            <Button onClick={handleRemoveAll} variant="outlined" color={'black'} disabled={!hasFiles}>
              Remove all
            </Button>
            <LoadingButton
              variant={'contained'}
              loading={uploading}
              color={'black'}
              onClick={handleUpload}
              disabled={!hasFiles}
            >
              Upload
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedLightBoxImage]}
        photoIndex={selectedLightBoxImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
        setPhotoIndex={setSelectedLightBoxImage}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    imagesState: state.images,
  };
};
export default connect(mapStateToProps)(Media);
