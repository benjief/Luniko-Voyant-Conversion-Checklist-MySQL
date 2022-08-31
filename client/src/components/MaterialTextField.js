import * as React from 'react';
import { useValidationError } from '../pages/ConversionChecklistPages/Context/ValidationErrorContext';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const sx = {
  '& .MuiTextField-root': { m: 1, width: '25ch' }, // TODO: make sure you understand this! move all constants outside functions
}

function MaterialTextField({
  field,
  className,
  label,
  helperText,
  characterLimit,
  placeholder,
  defaultValue,
  inputValue,
  multiline,
  type,
  required,
  showCharCounter,
  requiresTextValidation,
  isTextValidationCaseSensitive,
  invalidInputs,
  invalidInputMsg,
  authenticationField,
  minValue,
  maxValue,
  negativeNumbersAllowed,
  zerosAllowed,
  fractionsAllowed,
  disabled = false,
}) {
  const [value, setValue] = React.useState(defaultValue);
  const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(type !== "number" ? defaultValue?.length : 0);
  const authenticationError = useValidationError();

  const handleEmptyValue = React.useCallback((value) => {
    setValue(value);
    inputValue({ field: field, value: "" });
    // if (showCharCounter && value) {
    setInputLength(0); // TODO: test this - seems to work in specific data inputted by user scenario, but not sure about other text fields
    // }
    if (required) {
      setIsErrorEnabled(true);
    }
  }, [field, inputValue, required])

  const handleValidValue = React.useCallback((value) => {
    setValue(value);
    inputValue({ field: field, value: value });
    if (showCharCounter) {
      setInputLength(value.length);
    }
    setIsErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }, [field, helperText, inputValue, showCharCounter])

  const handleInvalidNumber = React.useCallback((number, helperText) => {
    setValue(number);
    inputValue({ field: field, value: number });
    setDisplayedHelperText(helperText);
    setIsErrorEnabled(true);
  }, [field, inputValue])

  const checkTextInputValidity = React.useCallback((input) => {
    let comparisonInput = isTextValidationCaseSensitive ? input : input.toLowerCase();
    if (invalidInputs.includes(comparisonInput.trim())) {
      invalidInputMsg === ""
        ? setDisplayedHelperText("Invalid input")
        : setDisplayedHelperText(invalidInputMsg);
      handleEmptyValue(comparisonInput);
    } else {
      handleValidValue(input);
    }
  }, [handleEmptyValue, handleValidValue, invalidInputMsg, invalidInputs, isTextValidationCaseSensitive])

  const checkEmailValidity = React.useCallback((email) => {
    if (email.match(/[^@]+@[^@]+\.+[^@]/)) {
      handleValidValue(email);
    } else {
      setDisplayedHelperText("Please enter a valid email address");
      handleEmptyValue(email);
    }
  }, [handleEmptyValue, handleValidValue])

  const checkPasswordValidity = React.useCallback((password) => {
    if (password.length > 5) {
      handleValidValue(password);
    } else {
      setDisplayedHelperText("Passwords must be at least 6 characters long");
      handleEmptyValue(password);
    }
  }, [handleEmptyValue, handleValidValue])

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

  React.useEffect(() => {
    if (authenticationField) {
      if (authenticationError.length) {
        setIsErrorEnabled(true);
        setDisplayedHelperText(authenticationError);
      } else {
        setIsErrorEnabled(false);
        setDisplayedHelperText("");
        // }
      }
    }
  }, [authenticationField, authenticationError, isErrorEnabled, value]) // TODO: check need for firstRender

  const handleOnSubmit = React.useCallback(
    (event) => {
      event.preventDefault()
    },
    [],
  )

  const handleOnChange = React.useCallback(
    (event) => {
      const value = event.target.value

      if (value.trim() !== "") {
        if (type === "text" && requiresTextValidation) {
          checkTextInputValidity(value);
        } else if (type === "email") {
          checkEmailValidity(value);
        } else if (type === "password" && requiresTextValidation) {
          checkPasswordValidity(value);
        } else if (type === "number") {
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
    [checkEmailValidity, checkNumberValidity, checkPasswordValidity, checkTextInputValidity,
      handleEmptyValue, handleValidValue, required, requiresTextValidation, type]
  )

  const handleOnBlur = React.useCallback(
    (event) => {
      if (required && event.target.value === "") {
        setIsErrorEnabled(true);
        setDisplayedHelperText("Required Field");
      }
    }, [required]
  )

  const handleOnKeyDown = React.useCallback(
    (event) => {
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
    },
    [fractionsAllowed, type]
  )

  const inputProps = React.useMemo(() => ({ // like useCallback, but for any variable - only returns a new object when the value of characterLimit changes
    maxLength: characterLimit
  }), [characterLimit])


  return (
    <Box
      onSubmit={handleOnSubmit}
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
          disabled={disabled}
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
  authenticationField: PropTypes.bool,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  negativeNumbersAllowed: PropTypes.bool,
  zerosAllowed: PropTypes.bool,
  fractionsAllowed: PropTypes.bool,
  disabled: PropTypes.bool,
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
  authenticationField: false,
  minValue: Number.MIN_SAFE_INTEGER,
  maxValue: Number.MAX_SAFE_INTEGER,
  negativeNumbersAllowed: true,
  zerosAllowed: true,
  fractionsAllowed: true,
  disabled: false,
}

export default MaterialTextField;
