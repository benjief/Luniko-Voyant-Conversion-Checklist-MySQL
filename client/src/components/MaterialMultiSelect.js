import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

/**
 * A multiple select component customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-select/.
 * @returns said selector.
 */
function MaterialMultiSelect(
  {
    field, // name of the field being selected
    label, // text displayed inside of the selector before the user has input anything
    placeholder, // text displayed inside of the selector after the user has input something
    defaultValue, // values to be selected by the component upon initial render
    multiSelectOptions, // selectable options
    selectedValues, // callback function that provides selected value(s) to the component containing this component
    limitTags, // number of (selected options) displayed inside of this selector when the user clicks outside of it
    required, // whether or not this is a required field
  }
) {

  const [values, setValues] = React.useState(defaultValue);
  const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState("");

  /**
   * 
   */
  const checkForLabelInValues = React.useCallback((label) => {
    let matchingLabels = values.filter((val => {
      return val.label === label;
    }));
    return matchingLabels.length ? true : false;
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
}

export default MaterialMultiSelect;