import * as React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

/**
 * A multiple value selector component customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-autocomplete/.
 * @returns said selector.
 */
function MaterialMultiSelect(
  {
    field, // name of the field being selected
    className,
    label, // text displayed inside of the selector before the user has input anything
    placeholder, // text displayed inside of the selector after the user has input something
    defaultValue, // value(s) to be selected by the component upon initial render
    multiSelectOptions, // selectable options
    selectedValues, // callback function that provides selected value(s) to the component containing this component
    limitTags, // number of (selected options) displayed inside of this selector when the user clicks outside of it
    isDisabled, // whether or not the selector is disabled
    required, // whether or not this is a required field
    invalidOptions, // array of options that aren't valid (e.g. if a user has chosen an option that invalidates other options)
  }
) {

  const [values, setValues] = React.useState(defaultValue);
  const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState("");

  /**
   * Determines whether an existing option is present in the invalidOptions array. Only values between options (objects with value and label props) are compared.
   * @param {object} existingOption - the object being compared to objects deemed to be invalid.
   * @returns true if the existing option is matched against any of this selector's invalid options, false otherwise.
   */
  const checkExistingOptionsAgainstInvalidOptions = React.useCallback((existingOption) => {
    let matchingInvalidOptions = [];
    if (existingOption.value && invalidOptions.length) {
      matchingInvalidOptions = invalidOptions.filter((val) => {
        return val.value === existingOption.value;
      })
    }
    return matchingInvalidOptions.length ? true : false;
  }, [invalidOptions])

  /**
   * Handles error messages for changing input. If input is required and the user doesn't input anything, or they remove all inputs, an error message will be displayed. If input isn't required and the user doesn't input anything, the value for the field is set to an empty array and no error message is displayed.
   * @param {valueArray} - array containing selected value(s).
   */
  const handleErrorMessage = React.useCallback((valueArray) => {
    if (required) {
      console.log(valueArray);
      if (valueArray.length) {
        setIsErrorEnabled(false);
        setDisplayedHelperText("");
      } else {
        setIsErrorEnabled(true);
        setDisplayedHelperText("Required Field");
      }
    }
    if (!valueArray.length) {
      selectedValues({ field: field, value: [] });
    }
  }, [field, required, selectedValues])

  /**
   * Handles a blur event. When the user clicks outside the selector just after it has been active, if the selector contains a required field and the input is empty, an error message is displayed. If the input for a required field isn't empty, or the field isn't required, nothing happens.
   */
  const handleOnBlur = React.useCallback(() => {
    if (required && !values.length) {
      setIsErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }, [required, values.length])

  return (
    <Autocomplete
      className={className}
      // override of option equality is needed for MUI component to properly compare options and values
      isOptionEqualToValue={(option, value) => {
        return value !== "" ? option.value === value.value : true;
      }}
      multiple
      value={values}
      disablePortal // handles proper option popover placement 
      disabled={isDisabled}
      limitTags={limitTags}
      options={multiSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
      getOptionDisabled={(option) => {
        return checkExistingOptionsAgainstInvalidOptions(option);
      }}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      onChange={(event, valuesArray) => {
        setValues(valuesArray); // when values are input, component values are set to that input
        selectedValues({ field: field, value: valuesArray }); // selected values for the field this component represents are sent back to the parent component through a callback function
        handleErrorMessage(valuesArray); // handles error message functionality
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
  class: PropTypes.string,
  field: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.array,
  multiSelectOptions: PropTypes.array,
  selectedValues: PropTypes.func,
  limitTags: PropTypes.number,
  isDisabled: PropTypes.bool,
  required: PropTypes.bool,
  invalidOptions: PropTypes.array,
}

MaterialMultiSelect.defaultProps = {
  className: "",
  field: "",
  label: "",
  placeholder: "",
  defaultValue: [],
  multiSelectOptions: [],
  selectedValues: () => { },
  limitTags: 1,
  isDisabled: false,
  required: false,
  invalidOptions: [],
}

export default MaterialMultiSelect;
