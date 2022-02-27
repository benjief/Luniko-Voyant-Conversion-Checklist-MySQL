import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function MaterialMultiSelect(
  {
    label = "",
    placeholder = "",
    multiSelectOptions = [],
    selectedValues = [],
    limitTags = 1,
    required = false
  }
) {

  const handleOnChange = (object) => {
    console.log(object);
    if (object[0]) {
      let tempArray = [];
      for (let i = 0; i < object.length; i++) {
        tempArray.push(object[i].value);
      }
      selectedValues(tempArray);
    }
  }

  return (
    <Autocomplete
      // Override of option equality is needed for MUI to properly compare options and values
      // isOptionEqualToValue={(option, value) => option.id === value.id}
      multiple
      limitTags={limitTags}
      // id="tags-outlined"
      options={multiSelectOptions}
      getOptionLabel={(option) => option.label}
      // defaultValue={[top100Films[13]]}
      filterSelectedOptions
      onChange={(event, object) => handleOnChange(object)}
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