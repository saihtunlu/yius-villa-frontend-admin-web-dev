import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

// @mui
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  Switch,
  useTheme,
  InputLabel,
  FormControl,
  Typography,
  FormControlLabel,
  FormLabel,
  styled,
  RadioGroup,
  Autocomplete,
  createFilterOptions,
  DialogContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { DatePicker, DateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';

// components
import Iconify from '../../common/Iconify';
import { ColorSinglePicker } from '../../common/color-utils';
import RemoteAutocomplete from '../../common/RemoteAutocomplete';

// ----------------------------------------------------------------------
const filter = createFilterOptions();

const COLOR_OPTIONS = [
  '#6D53A5', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

export default function CalendarForm({ initialData, onDelete, onSubmit, onCancel, isCreating, loading, deleting }) {
  const [data, setData] = useState(initialData);
  const theme = useTheme();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
    >
      <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', background: theme.palette.background.neutral, mt: 1.25 }}>
        <Stack spacing={2.5} sx={{}}>
          <RemoteAutocomplete
            multiple
            value={data.attendees.map((val) => val.name)}
            onChange={(_, data) => {
              if (data) {
                setData((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.attendees = data;
                  return { ...newState };
                });
              }
            }}
            remote="employee/search/"
            label={'Employee'}
          />
          <Autocomplete
            required
            options={['Off-Day']}
            renderInput={(params) => <TextField {...params} label="Title" />}
            value={data.title}
            onChange={(_, value) => {
              setData((preState) => {
                var newState = JSON.parse(JSON.stringify(preState));
                newState.title = value;
                return { ...newState };
              });
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option);
              if (inputValue !== '' && !isExisting) {
                filtered.push(inputValue);
              }
              return filtered;
            }}
          />
          <TextField
            multiline
            fullWidth
            rows={2}
            required
            label={'Description'}
            placeholder="..."
            value={data.description || ''}
            onChange={(event) => {
              setData((preState) => {
                var newState = JSON.parse(JSON.stringify(preState));
                newState.description = event.target.value;
                return { ...newState };
              });
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={data.allDay}
                onChange={() => {
                  setData((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.allDay = !newState.allDay;
                    return { ...newState };
                  });
                }}
              />
            }
            label="All Day"
          />

          <Stack spacing={2.5} width={'100%'} direction={'row'} sx={{}}>
            <MobileDateTimePicker
              sx={{ width: '100%' }}
              required
              value={data.start ? moment(data.start) : null}
              label="Start Date"
              onChange={(newValue) => {
                if (newValue) {
                  setData((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.start = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
                    return { ...newState };
                  });
                }
              }}
            />
            <MobileDateTimePicker
              required
              sx={{ width: '100%' }}
              label="End Date"
              value={data.end ? moment(data.end) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setData((preState) => {
                    var newState = JSON.parse(JSON.stringify(preState));
                    newState.end = moment(newValue).format('YYYY-MM-DD HH:mm:ss');
                    return { ...newState };
                  });
                }
              }}
            />
          </Stack>

          <FormControl>
            <FormLabel id="color-oicker">Color</FormLabel>
            <ColorSinglePicker
              required
              value={data.color}
              onChange={(event) => {
                setData((preState) => {
                  var newState = JSON.parse(JSON.stringify(preState));
                  newState.color = event.target.value;
                  return { ...newState };
                });
              }}
              colors={COLOR_OPTIONS}
            />
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Delete Event">
            <IconButton
              disabled={deleting}
              sx={{ minWidth: '22px !important' }}
              onClick={() => {
                onDelete(data.id);
              }}
            >
              <Iconify icon={deleting ? 'line-md:loading-loop' : 'solar:trash-bin-minimalistic-bold-duotone'} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="black" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" color="black" loading={loading}>
          Confirm
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
