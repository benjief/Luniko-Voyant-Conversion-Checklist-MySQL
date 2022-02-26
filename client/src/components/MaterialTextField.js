import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function MaterialTextField({
  inputNeedsValidating = false,
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
  validInputs = []
}) {
  const [errorEnabled, setErrorEnabled] = React.useState(false);
  // const [errorMsg, setErrorMsg] = React.useState("");
  const [displayedHelperText, setDisplayedHelperText] = React.useState(helperText);
  const [inputLength, setInputLength] = React.useState(defaultValue.length);

  React.useEffect(() => {

  })

  const handleOnChange = (value) => {
    console.log(value.length);
    if (value.length > 0) {
      handleValidValue(value);
    } else {
      if (required) {
        handleInvalidValue(value);
      }
    }
  }

  // const checkInputValidity = (input) => {
  //   if (input.length > 2) {
  //     handleValidValue(input);
  //   } else {
  //     setErrorMsg("Required Field");
  //     handleInvalidValue(input);
  //   }
  // }

  const handleInvalidValue = (value) => {
    inputValue("");
    setInputLength(value.length);
    if (required) {
      setErrorEnabled(true);
      setDisplayedHelperText("Required Field");
    }
  }

  const handleValidValue = (value) => {
    inputValue(value);
    setInputLength(value.length);
    setErrorEnabled(false);
    setDisplayedHelperText(helperText);
  }

  // React.useEffect(() => {
  //   console.log(errorMsg);
  //   console.log(displayedHelperText);
  // }, [errorMsg, displayedHelperText]);

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
          multiline={multiline}
          error={errorEnabled}
          required={required}
          placeholder={placeholder}
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
