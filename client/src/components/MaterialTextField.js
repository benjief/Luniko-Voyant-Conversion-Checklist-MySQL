import * as React from 'react';
import { useValidationError } from '../pages/ConversionChecklistPages/Context/ValidationErrorContext';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const sx = {
  '& .MuiTextField-root': { m: 1, width: '25ch' }, // TODO: make sure you understand this! move all constants outside functions
}

/**
 * Text field that currently allows for the input of text, email addresses and numbers. Customized from the original Material UI component, which can be found here: https://mui.com/material-ui/react-text-field/.
 * @returns said text field.
 */
function MaterialTextField({
  field, // name of the field being input
  className,
  label,  // text displayed inside of the text input before the user has input anything
  helperText, // text to be displayed underneath the input in case of an error; TODO: figure this out
  characterLimit, // character limit to be imposed on the text input
  placeholder, // text displayed inside of the text input after the user has entered something
  defaultValue, // input to be held by the component upon initial render
  inputValue, // callback function that provides input to the component containing this component
  multiline, // whether or not this input is multiline
  type, // the type of input being entered (e.g. "text" or "number")
  required, // whether or not this is a required field
  showCharCounter, // whether or not a character counter is displayed underneath the input field
  requiresTextValidation, // whether or not text validation should be enabled
  isTextValidationCaseSensitive, // whether or not text validation (if enabled) is case sensitive
  invalidInputs, // array of invalid inputs (these should be the same type of input as the field itself)
  invalidInputMsg, // message to be displayed under the field if the user enters invalid input
  isAuthenticationField, // whether or not the field needs to be authenticated (e.g. if input already exists in the database and can't be used)
  minValue, // minimum allowed value for number inputs
  maxValue, // maximum allowed value for number inputs
  negativeNumbersAllowed, // whether or not negative numbers are allowed for number inputs
  zerosAllowed, // whether or not zero is allowed for number inputs
  fractionsAllowed, // whether or not non-whole numbers are allowed for number inputs
  isDisabled, // whether or not the field is disabled
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(type !== "number" ? defaultValue?.length : 0);
  const authenticationError = useValidationError();

  /**
   * Handles empty input. Sets the input value to the passed empty input and returns an object with this input's field and an empty string value to the parent component.
   * @param value - empty input.
   */
  const handleEmptyValue = React.useCallback((value) => {
    // console.log(value);
    setValue(value);
    inputValue({ field: field, value: "" });
    setInputLength(0);
    if (required) {
      setIsErrorEnabled(true);
    }
  }, [field, inputValue, required])

  /**
   * Handles valid input. Sets the input value to the passed input and returns an object with this input's field and a value containing the input to the parent component. If showCharCounter is set to true, the input character length is updated. Additionally, any displayed error message is removed.
   * @param {type} value - valid user-entered input.
   */
  const handleValidValue = React.useCallback((value) => {
    setValue(value);
    inputValue({ field: field, value: value });
    if (showCharCounter) {
      setInputLength(value.length);
    }
    setIsErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }, [field, helperText, inputValue, showCharCounter])

  /** 
   * Handles invalid number input. Sets the input value to the passed input and returns an object with this input's field and a value containing the input to the parent component. An error message is then displayed.
   * @param {number} value - invalid user-entered input.
   * @param {string} helperText - text to be displayed in below the input field.
  */
  const handleInvalidNumber = React.useCallback((number, helperText) => {
    setValue(number);
    inputValue({ field: field, value: number });
    setDisplayedHelperText(helperText);
    setIsErrorEnabled(true);
  }, [field, inputValue])

  /**
   * Determines whether or not input text matches strings in invalidInputs. If it does (this depends on the value of the isTextValidationCaseSensitive prop), an error message is displayed. The error message displayed will be the value of the invalidInputMsg prop, if it isn't the empty string. If it is empty, "Invalid input" will be displayed. If the input is determined to be valid, handleValidValue is called with said input.
   * @param {string} input - user-entered input to be checked for validiy.
   */
  const checkTextInputValidity = React.useCallback((input) => {
    let comparisonInput = isTextValidationCaseSensitive ? input : input.toLowerCase();
    if (invalidInputs.includes(comparisonInput.trim())) {
      invalidInputMsg.length
        ? setDisplayedHelperText(invalidInputMsg)
        : setDisplayedHelperText("Invalid input");
      // invalid inputs are treated as empty
      handleEmptyValue(comparisonInput);
    } else {
      handleValidValue(input);
    }
  }, [handleEmptyValue, handleValidValue, invalidInputMsg, invalidInputs, isTextValidationCaseSensitive])

  /**
   * Determines whether or not input text matches the pattern for a valid email address. If it doesn't, an error message is displayed. If the input is determined to be a valid email address, handleValidValue is called with said input.
   * @param {string} email - user-entered input to be matched against email structure.
   */
  const checkEmailValidity = React.useCallback((email) => {
    if (email.match(/[^@]+@[^@]+\.+[^@]/)) {
      handleValidValue(email);
    } else {
      setDisplayedHelperText("Please enter a valid email address");
      // invalid inputs are treated as empty
      handleEmptyValue(email);
    }
  }, [handleEmptyValue, handleValidValue])

  // TODO: get a general password field to work
  // const checkPasswordValidity = React.useCallback((password) => {
  //   if (password.length > 5) {
  //     handleValidValue(password);
  //   } else {
  //     setDisplayedHelperText("Passwords must be at least 6 characters long");
  //     handleEmptyValue(password);
  //   }
  // }, [handleEmptyValue, handleValidValue])

  /**
   * Determines whether or not an input number abides by all the criteria set by this field's number-related props. If the number violates some criterion, the appropriate error message is displayed. If the number abides by all of the set criteria, handleValidValue is called with said number.
   */
  const checkNumberValidity = React.useCallback((number) => {
    if (!negativeNumbersAllowed && number < 0) {
      handleInvalidNumber(number, "Negative numbers aren't allowed");
    } else if (number === 0 && !zerosAllowed) {
      handleInvalidNumber(number, "Number must be > 0");
    } else if (number > maxValue) {
      handleInvalidNumber(number, "Number too high");
    } else if (number < minValue) {
      handleInvalidNumber(number, "Number too low");
    } else {
      handleValidValue(number);
    }
  }, [handleInvalidNumber, handleValidValue, maxValue, minValue, negativeNumbersAllowed, zerosAllowed])

  /**
   * Handles inputs that are authenticated by a parent component (or page). For example, if this field is used to retrieve data corresponding to a specific database record, and that record doesn't exist in the database, an error message is displayed. If it does, any displayed error message is removed. Verification of this field occurs in one of this field's parent components (could be anywhere down the line).
   */
  React.useEffect(() => {
    if (isAuthenticationField) {
      if (authenticationError.length) { // context variable 
        setIsErrorEnabled(true);
        setDisplayedHelperText(authenticationError);
      } else {
        setIsErrorEnabled(false);
        setDisplayedHelperText("");
      }
    }
  }, [isAuthenticationField, authenticationError, isErrorEnabled, value])

  /**
   * Prevents users from submitting a form by pressing enter after filling in this field. This functionality causes lots of problems for me.
   */
  const handleSubmit = React.useCallback((event) => {
    event.preventDefault()
  }, [])

  /**
   * Handles changing user-entered input. If the input is not empty, redirects said input to the appropriate validation function, or handleValidValue if the input doesn't require any validation. If the input is empty and this field is required, displayedHelperText is set to "Required field", and handleEmptyValue is called (which will actually display that helper text in an error message).
   * @param {event} event - the event that triggers this function call.
   */
  const handleOnChange = React.useCallback(
    (event) => {
      const value = event.target.value

      if (value.trim().length) {
        if (type === "text" && requiresTextValidation) {
          checkTextInputValidity(value);
        } else if (type === "email") {
          checkEmailValidity(value);
        } /*else if (type === "password" && requiresTextValidation) {
          checkPasswordValidity(value);
      }*/ else if (type === "number") {
          checkNumberValidity(parseInt(value));
        } else {
          handleValidValue(value);
        }
      } else {
        if (required) {
          setDisplayedHelperText("Required Field");
        }
        handleEmptyValue(value);
      }
    },
    [checkEmailValidity, checkNumberValidity, checkTextInputValidity, handleEmptyValue, handleValidValue, required, requiresTextValidation, type]
  )

  /**
    * When the user clicks outside this field, if the field is required and contains no input, an error message is displayed. If the field isn't required, nothing happens.
   * @param {event} event - the event that triggers this function call.
   */
  const handleOnBlur = React.useCallback(
    (event) => {
      if (required && !event.target.value.length) {
        setIsErrorEnabled(true);
        setDisplayedHelperText("Required Field");
      }
    }, [required]
  )

  /**
   * Handles all keydown events for this component. If the event is inputting a number, the number e is blocked from being recognized as such (i.e. it cannot be input). If fractions are not allowed, "." is blocked from being input.
   * @param {event} event - the keydown event that triggers this function call.
   */
  const handleOnKeyDown = React.useCallback((event) => {
    if (type === "number") {
      if (["e", "E"].includes(event.key)) {
        event.preventDefault();
      }
      if (!fractionsAllowed) {
        if (["."].includes(event.key)) {
          event.preventDefault();
        }
      }
    }
  }, [fractionsAllowed, type])

  /**
   * This is really here just for proof of concept.
   */
  const inputProps = React.useMemo(() => ({ // like useCallback, but for any variable - only returns a new object when the value of characterLimit changes
    maxLength: characterLimit
  }), [characterLimit]) // TODO: apply this technique more widely!

  return (
    <Box
      onSubmit={handleSubmit}
      className={className}
      component="form"
      sx={sx}
      noValidate
      autoComplete="off">
      <div className="material-text-field">
        <TextField
          onKeyDown={handleOnKeyDown}
          label={label}
          defaultValue={defaultValue}
          type={type}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          multiline={multiline}
          error={isErrorEnabled}
          required={required}
          placeholder={placeholder}
          disabled={isDisabled}
          inputProps={inputProps}
          helperText={showCharCounter ? !isErrorEnabled ? displayedHelperText !== ""
            ? [displayedHelperText, ". Limit: ", inputLength, "/", characterLimit].join("") : ["Limit: ", inputLength, "/", characterLimit].join('')
            : displayedHelperText
            : displayedHelperText} />
      </div>
    </Box>
  );
}

MaterialTextField.propTypes = {
  field: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  characterLimit: PropTypes.number,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  inputValue: PropTypes.func,
  multiline: PropTypes.bool,
  type: PropTypes.string,
  required: PropTypes.bool,
  showCharCounter: PropTypes.bool,
  requiresTextValidation: PropTypes.bool,
  isValidationCaseSensitive: PropTypes.bool,
  invalidInputs: PropTypes.array,
  invalidInputMsg: PropTypes.string,
  isAuthenticationField: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  negativeNumbersAllowed: PropTypes.bool,
  zerosAllowed: PropTypes.bool,
  fractionsAllowed: PropTypes.bool,
  isDisabled: PropTypes.bool,
}

MaterialTextField.defaultProps = {
  field: "",
  className: "",
  label: "",
  helperText: "",
  characterLimit: 500,
  placeholder: "",
  defaultValue: "",
  inputValue: () => { },
  multiline: false,
  type: "text",
  required: false,
  showCharCounter: false,
  requiresTextValidation: false,
  isTextValidationCaseSensitive: true,
  invalidInputs: [],
  invalidInputMsg: "",
  isAuthenticationField: false,
  minValue: Number.MIN_SAFE_INTEGER,
  maxValue: Number.MAX_SAFE_INTEGER,
  negativeNumbersAllowed: true,
  zerosAllowed: true,
  fractionsAllowed: true,
  isDisabled: false,
}

export default MaterialTextField;
