import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// material
import {
  Box,
  Card,
  Button,
  Typography,
  CardProps,
  Stack,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  TableHead,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'notistack';

// @types
import { connect } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { isInteger } from 'lodash';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Iconify from '../../common/Iconify';

const INITIAL_ROLE = {
  name: '',
  permissions: [
    {
      name: 'Order',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Product',
      create: true,
      update: true,
      delete: true,
      read: true,
    },

    {
      name: 'Employee',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Attendance',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Payroll',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'User',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Calendar',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Finance',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'General Setting',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
    {
      name: 'Coupon',
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  ],
};
function RoleList() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const theme = useTheme();
  const [roles, setRoles] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedRole, setSelectedRole] = useState(INITIAL_ROLE);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setSelectedRole(INITIAL_ROLE);
    setOpen(false);
  };

  const handleDeleteRole = (id) => {
    setDeleting(true);
    const url = 'role/?id=' + id;

    axios
      .delete(url)
      .then(() => {
        getRoles();
        setDeleting(false);
        setOpen(false);
        setSelectedRole(INITIAL_ROLE);
      })
      .catch(() => {
        setDeleting(false);
        setOpen(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);
    const url = 'role/';
    var fetch = axios.put;
    if (isCreating) {
      fetch = axios.post;
    }

    fetch(url, { data: selectedRole })
      .then(() => {
        getRoles();
        setSubmitting(false);
        setOpen(false);
        setSelectedRole(INITIAL_ROLE);
      })
      .catch(() => {
        setSubmitting(false);
        setOpen(false);
      });
  };

  useEffect(() => {
    getRoles();
    return () => {};
  }, []);

  // actions

  const getRoles = () => {
    var url = `roles/`;
    axios.get(url).then(({ data }) => {
      setRoles(data);
      setIsReady(true);
    });
  };

  return (
    <>
      <Card>
        <Stack spacing={2.5} sx={{ p: 2.5 }} alignItems="flex-start">
          <Typography variant="subtitle1">Roles</Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
              },

              width: '100%',
            }}
          >
            {roles.map((role, index) => (
              <Stack
                key={`${index}-payment-method`}
                sx={{
                  p: 2,
                  width: '100%',
                  // margin: '10px',
                  bgcolor: 'background.neutral',
                  borderRadius: theme.shape.borderRadius + 'px',
                }}
                spacing={2}
                direction={'row'}
              >
                <Stack>
                  <Typography variant="subtitle1" gutterBottom>
                    {role.name}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      color="error"
                      size="small"
                      startIcon={<Iconify icon={'solar:trash-bin-minimalistic-bold-duotone'} />}
                      onClick={() => {
                        handleDeleteRole(role.id);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Iconify icon={'solar:pen-new-round-bold-duotone'} />}
                      onClick={() => {
                        setIsCreating(false);
                        setSelectedRole(role);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Box>

          <Button
            size="small"
            onClick={() => {
              setIsCreating(true);
              setSelectedRole(INITIAL_ROLE);
              setOpen(true);
            }}
            startIcon={<Iconify icon="mynaui:plus-solid" />}
          >
            Add new role
          </Button>
        </Stack>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'sm'}
        scroll="paper"
        aria-labelledby="store-payment-method-dialog"
        aria-describedby="store-payment-method-dialog-description"
      >
        <DialogTitle variant="subtitle1" id="store-payment-method-dialog">
          {!isCreating ? selectedRole.name : 'New Role'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ maxHeight: 'calc(80vh - 100px)', pb: 0 }}>
            <Stack spacing={2.5} sx={{}}>
              <TextField
                sx={{ width: '100%' }}
                label={'Name'}
                value={selectedRole.name}
                required
                placeholder="Enter role name"
                onChange={(event) => {
                  setSelectedRole((preState) => {
                    return { ...preState, name: event.target.value };
                  });
                }}
              />

              <TableContainer sx={{ maxHeight: '400px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Create</TableCell>
                      <TableCell>Read</TableCell>
                      <TableCell>Update</TableCell>
                      <TableCell>Delete</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedRole?.permissions?.map((row, index) => {
                      return (
                        <TableRow hover key={`${row.id}+${index}`}>
                          <TableCell align="left">{row.name || '-'}</TableCell>

                          <TableCell align="left">
                            <Checkbox
                              checked={row.create}
                              onChange={(event) => {
                                setSelectedRole((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.permissions[index].create = event.target.checked;
                                  return newState;
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Checkbox
                              onChange={(event) => {
                                setSelectedRole((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.permissions[index].read = event.target.checked;
                                  return newState;
                                });
                              }}
                              checked={row.read}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Checkbox
                              onChange={(event) => {
                                setSelectedRole((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.permissions[index].update = event.target.checked;
                                  return newState;
                                });
                              }}
                              checked={row.update}
                            />
                          </TableCell>
                          <TableCell align="left">
                            <Checkbox
                              onChange={(event) => {
                                setSelectedRole((preState) => {
                                  var newState = JSON.parse(JSON.stringify(preState));
                                  newState.permissions[index].delete = event.target.checked;
                                  return newState;
                                });
                              }}
                              checked={row.delete}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="black" variant="outlined">
              Cancel
            </Button>
            <LoadingButton loading={submitting} variant={'contained'} color="black" type="submit" autoFocus>
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  roles: state.payment,
});

export default connect(mapStateToProps)(RoleList);
