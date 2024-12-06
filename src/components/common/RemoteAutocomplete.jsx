import { useEffect, useState } from 'react';
import { Autocomplete, Chip, createFilterOptions, TextField } from '@mui/material';
import axios from '../../utils/axios';

const filter = createFilterOptions();

const RemoteAutocomplete = ({ remote, label, required, value = '', multiple = false, create = false, onChange }) => {
  const [options, setOptions] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedMultiData, setSelectedMultiData] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);

  useEffect(() => {
    var selData = [];
    if (selectedMultiData.length > 0) {
      selectedValue.forEach((val) => {
        var check = selectedMultiData.filter((data) => data.name === val)[0];
        if (check) {
          selData.push(check);
        }
      });
      onChange(selectedValue, selData);
    }

    return () => {};
  }, [selectedMultiData, selectedValue]);

  const handleSearch = async (query) => {
    const url = remote + '?query=' + query;
    try {
      const { data } = await axios.get(url);
      setOptions(data.map((val) => val.name));
      setSearchResult(data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
  return (
    <Autocomplete
      value={value}
      multiple={multiple}
      onChange={(_, value) => {
        if (multiple) {
          value.forEach((val) => {
            const filterData = searchResult.filter((v) => v?.name === val)[0];
            if (filterData) {
              setSelectedMultiData((pre) => [...pre, filterData]);
            } else if (create) {
              setSelectedMultiData((pre) => [...pre, { name: val }]);
            }
          });
          setSelectedValue(value);
        } else {
          const selectedData = searchResult.filter((v) => v?.name === value)[0];
          onChange(value, selectedData);
        }
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
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={remote}
      options={options}
      getOptionLabel={(option) => {
        return option;
      }}
      renderOption={(props, option) => {
        const d = new Date().getTime();
        const text = d.toString();
        const key = props.id + text;
        return (
          <li {...props} key={key}>
            {option}
          </li>
        );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            size="small"
            sx={{
              borderRadius: '8px ',
            }}
            label={option}
          />
        ))
      }
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(event) => {
            handleSearch(event.target.value);
          }}
          label={label}
          required={required}
        />
      )}
    />
  );
};

export default RemoteAutocomplete;
