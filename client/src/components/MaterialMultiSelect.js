import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function MaterialMultiSelect({
  label = "",
  placeholder = "",
  defaultValue = [],
  multiSelectOptions = [],
  selectedValues = [],
  limitTags = 1,
  required = false,
  invalidOptions = []
}) {

  const [values, setValues] = React.useState(defaultValue);
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleOnChange = (object) => {
    if (object.length) {
      setValues(object);
      selectedValues(object);
      setErrorEnabled(false);
      setErrorMsg("");
    } else {
      setValues([]);
      selectedValues([]);
      if (required) {
        setErrorEnabled(true);
        setErrorMsg("Required Field");
      }
    }
  }

  const handleOnBlur = () => {
    if (required && values === []) {
      setErrorEnabled(true);
      setErrorMsg("Required Field");
    }
  }

  const checkForLabelInValues = (label) => {
    for (let i = 0; i < values.length; i++) {
      if (values[i].label === label) {
        return true;
      }
    }
    return false;
  }

  const setDisabledOptions = (option) => {
    if (!values.length) {
      return false;
    } else {
      if (option.label === "N/A") {
        return !checkForLabelInValues(option);
      } else {
        return checkForLabelInValues("N/A");
      }
    }
  }

  return (
    <Autocomplete
      // Override of option equality is needed for MUI to properly compare options and values
      isOptionEqualToValue={(option, value) => {
        return value !== "" ? option.value === value.value : true;
      }}
      multiple
      value={values}
      disablePortal
      limitTags={limitTags}
      // id="tags-outlined"
      options={multiSelectOptions}
      getOptionDisabled={(option) => {
        return setDisabledOptions(option);
      }}
      getOptionLabel={(option) => option.label}
      // defaultValue={[top100Films[13]]}
      filterSelectedOptions
      onChange={(event, object) => handleOnChange(object)}
      onBlur={handleOnBlur}
      renderInput={(params) => (
        <TextField
          // color='warning'
          {...params}
          required={required}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}