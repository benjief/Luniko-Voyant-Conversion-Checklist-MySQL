import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function MaterialMultiSelect({
  label = "",
  placeholder = "",
  multiSelectOptions = [],
  selectedValues = [],
  limitTags = 1,
  required = false
}) {

  const [values, setValues] = React.useState([]);
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleOnChange = (object) => {
    if (object.length) {
      console.log(object);
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

  return (
    <Autocomplete
      // Override of option equality is needed for MUI to properly compare options and values
      // isOptionEqualToValue={(option, value) => option.id === value.id}
      multiple
      values={values}
      disablePortal
      limitTags={limitTags}
      // id="tags-outlined"
      options={multiSelectOptions}
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