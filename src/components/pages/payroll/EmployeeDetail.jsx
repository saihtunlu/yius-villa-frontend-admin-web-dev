import { Icon } from '@iconify/react';
import edit2Fill from '@iconify/icons-eva/edit-2-fill';
// material
import {
  Grid2 as Grid,
  Stack,
  Button,
  TextField,
  CardHeader,
  Typography,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  styled,
  IconButton,
  useTheme,
  OutlinedInput,
  List,
  ListSubheader,
  Divider,
  InputAdornment,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tooltip,
} from '@mui/material';
import searchFill from '@iconify/icons-eva/search-fill';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Avatar from '../../common/Avatar';
import Iconify from '../../common/Iconify';
import SearchNotFound from '../../common/SearchNotFound';
import TextMaxLine from '../../common/TextMaxLine';

const IconStyle = styled(Icon)(({ theme }) => ({
  color: 'text.disabled',
}));

const ListWrapperStyle = styled(Paper)(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  // border: `solid 1px ${theme.palette.divider}`,
  overflow: 'hidden',
}));

export default function EmployeeDetail({ initialData, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialData);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const isEmptySearchResult = searchResult.length === 0;

  const theme = useTheme();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setData(initialData);
    return () => {};
  }, [initialData]);

  useEffect(() => {
    getEmployee();
    return () => {};
  }, [query]);

  const getEmployee = () => {
    setLoading(true);

    var url = `employee/search/?query=${query}`;
    axios.get(url).then(({ data }) => {
      setSearchResult(data);
      setLoading(false);
    });
  };

  return (
    <>
      <Stack
        spacing={1.5}
        style={{
          position: 'relative',
          // background: theme.palette.background.neutral,
          // borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(2.5),
        }}
      >
        <Stack sx={{}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Employee Information
          </Typography>
          <Tooltip title={'Select Employee'}>
            <IconButton sx={{}} aria-label="delete" onClick={handleClickOpen}>
              <Iconify icon={initialData.employee?.name ? 'solar:pen-new-round-bold-duotone' : 'mynaui:plus-solid'} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="subtitle3" sx={{ marginTop: '0px !important' }}>
          {initialData.employee?.name || '-'}
        </Typography>
        <Typography variant="caption">{initialData.employee?.position?.name || '-'}</Typography>

        <Typography variant="caption">{initialData.employee?.phone || '-'}</Typography>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="discount-dialog"
        aria-describedby="discount-dialog-description"
      >
        <DialogTitle variant="subtitle1" sx={{ p: 0 }} id="discount-dialog">
          <Typography sx={{ px: 2.5, pt: 2.5, pb: 1.25, fontWeight: 700 }}>Employee</Typography>
          <Stack sx={{ background: theme.palette.background.neutral, px: 2.5, py: 1.25 }}>
            <TextField
              value={query}
              fullWidth
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Search ..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconStyle icon={searchFill} width={22} height={22} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ width: 400, p: 2.5, paddingTop: theme.spacing(1.25) + ' !important' }}>
          <Grid container spacing={0} sx={{}}>
            <Grid size={12}>
              {!loading && isEmptySearchResult ? (
                <SearchNotFound hideCaption />
              ) : (
                <ListWrapperStyle>
                  <List
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                      padding: '0px !important',
                    }}
                  >
                    {searchResult.map((employee, index) => {
                      const labelId = `search-result-employee-${index}`;
                      return (
                        <ListItem
                          key={labelId}
                          sx={{
                            borderRadius: theme.shape.borderRadius + 'px',
                            overflow: 'hidden',
                          }}
                          disablePadding
                        >
                          <ListItemButton
                            sx={{ px: theme.spacing(1), py: 1 }}
                            role={undefined}
                            onClick={() => {
                              onUpdate(employee);
                              setOpen(false);
                            }}
                            dense
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{ width: 40, height: 40 }}
                                user={{
                                  first_name: employee?.name,
                                  avatar: employee.photo,
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              id={labelId}
                              primary={<Typography variant="subtitle2">{employee.name}</Typography>}
                              secondary={
                                <TextMaxLine line={1} variant="caption" sx={{ color: 'text.secondary' }}>
                                  {employee.department?.name} - {employee.position?.name}
                                </TextMaxLine>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </ListWrapperStyle>
              )}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
