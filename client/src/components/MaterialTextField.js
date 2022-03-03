import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MaterialTextField({
  className = "",
  label = "",
  helperText = "",
  characterLimit = 500,
  placeholder = "",
  defaultValue = "",
  inputValue = "",
  multiline = false,
  type = "text",
  required = false,
  showCharCounter = false,
  limitRangeOfInputs = false,
  upperLimitValue = 0,
  lowerLimitValue = 0
}) {
  const [value, setValue] = React.useState("");
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  // const [errorMsg, setErrorMsg] = React.useState("");
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(defaultValue.length);

  const handleOnChange = (value) => {
    if (value) {
      if (type === "email") {
        checkEmailValidity(value);
      } else if (type === "password") {
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
  }

  const handleOnBlur = () => {
    if (required && value === "") {
      setErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }

  const checkEmailValidity = (email) => {
    if (email.match(/[^@]+@[^@]+\./)) {
      handleValidValue(email);
    } else {
      setDisplayedHelperText("Please enter a valid email address");
      handleEmptyValue(email);
    }
  }

  const checkPasswordValidity = (password) => {
    if (password.length > 5) {
      handleValidValue(password);
    } else {
      setDisplayedHelperText("Passwords must be at least 6 characters long");
      handleEmptyValue(password);
    }
  }

  const checkNumberValidity = (number) => {
    if (limitRangeOfInputs) {
      console.log("inside if");
      if (lowerLimitValue && !upperLimitValue) {
        console.log("lower limit: " + lowerLimitValue);
        if (number >= lowerLimitValue) {
          handleValidValue(number);
        } else {
          setDisplayedHelperText("Number is too low");
          handleInvalidNumber(number);
        }
      } else if (!lowerLimitValue && upperLimitValue) {
        console.log("checking upper limit of " + upperLimitValue);
        if (number <= upperLimitValue) {
          handleValidValue(number);
        } else {
          setDisplayedHelperText("Number is too high");
          handleInvalidNumber(number);
        }
      } else if (lowerLimitValue && upperLimitValue) {
        if (lowerLimitValue <= number && number <= upperLimitValue) {
          handleValidValue(number);
        } else {
          setDisplayedHelperText("Number outside of valid range");
          handleInvalidNumber(number);
        }
      } else {
        handleValidValue(number);
      }

    }
  }

  const handleInvalidNumber = (number) => {
    setValue(null);
    inputValue(null);
    console.log("setting error enabled");
    setErrorEnabled(true);
  }

  const handleEmptyValue = (value) => {
    setValue("");
    inputValue("");
    if (value) {
      setInputLength(value.length);
    }
    if (required) {
      console.log("setting error enabled");
      setErrorEnabled(true);
    }
  }

  const handleValidValue = (value) => {
    setValue(value);
    inputValue(value);
    setInputLength(value.length);
    setErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }

  return (
    <Box
      className={className}
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off">
      <div className="material-text-field">
        <TextField
          label={label}
          defaultValue={defaultValue}
          type={type}
          onChange={(event) => handleOnChange(event.target.value)}
          onBlur={(event) => handleOnBlur(event.target.value)}
          multiline={multiline}
          error={errorEnabled}
          required={required}
          inputProps={{
            maxLength: characterLimit
          }}
          helperText={showCharCounter ? !errorEnabled ? displayedHelperText !== ""
            ? [displayedHelperText, ". Limit: ", inputLength, "/", characterLimit] : ["Limit: ", inputLength, "/", characterLimit]
            : displayedHelperText
            : displayedHelperText} />
      </div>
    </Box>
  );
}
