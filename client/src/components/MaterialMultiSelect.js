import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function MaterialMultiSelect(
  {
    field,
    label,
    placeholder,
    defaultValue,
    multiSelectOptions,
    selectedValues,
    limitTags,
    required,
    invalidOptions,
  }
) {

  const [values, setValues] = React.useState(defaultValue);
  const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState("");

  const checkForLabelInValues = React.useCallback((label) => {
    for (let i = 0; i < values.length; i++) {
      if (values[i].label === label) {
        return true;
      }
    }
    return false;
  }, [values])

  const setDisabledOptions = React.useCallback((option) => {
    if (!values.length) {
      return false;
    } else {
      if (option.label === "N/A") {
        return !checkForLabelInValues(option);
      } else {
        return checkForLabelInValues("N/A");
      }
    }
  }, [checkForLabelInValues, values.length])

  const handleOnChange = React.useCallback((value) => {
    if (required) {
      if (value) {
        setIsErrorEnabled(false);
        setDisplayedHelperText("");
      } else {
        setIsErrorEnabled(true);
        setDisplayedHelperText("Required Field");
      }
    }
    if (!value) {
      selectedValues({ field: field, value: [] });
    }
  }, [field, required, selectedValues])

  const handleOnBlur = React.useCallback(() => {
    if (required && !values.length) {
      setIsErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }, [required, values.length])

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
      options={multiSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
      getOptionDisabled={(option) => {
        return setDisabledOptions(option);
      }}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      onChange={(event, valuesArray) => {
        setValues(valuesArray);
        selectedValues({ field: field, value: valuesArray });
        handleOnChange(valuesArray);
      }}
      onBlur={handleOnBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={isErrorEnabled}
          helperText={displayedHelperText} />
      )} />
  );
}

MaterialMultiSelect.propTypes = {
  field: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.array,
  multiSelectOptions: PropTypes.array,
  selectedValues: PropTypes.func,
  limitTags: PropTypes.number,
  required: PropTypes.bool,
  invalidOptions: PropTypes.array,
}

MaterialMultiSelect.defaultProps = {
  field: "",
  label: "",
  placeholder: "",
  defaultValue: [],
  multiSelectOptions: [],
  selectedValues: () => { },
  limitTags: 1,
  required: false,
  invalidOptions: [],
}

export default MaterialMultiSelect;