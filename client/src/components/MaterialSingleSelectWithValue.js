import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function MaterialSingleSelectWithValue(
    {
        label = "",
        placeholder = "",
        defaultValue = "",
        value = "",
        singleSelectOptions = [],
        selectedValue = "",
        isDisabled = false,
        required = false
    }

) {
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [displayedValue, setDisplayedValue] = React.useState(defaultValue);

    const handleOnChange = (object) => {
        if (object) {
            setDisplayedValue(object.label);
            selectedValue(object.value);
            setErrorEnabled(false);
            setErrorMsg("");
        } else {
            setDisplayedValue("");
            selectedValue("");
            if (required) {
                setErrorEnabled(true);
                setErrorMsg("Required Field");
            }
        }
    }

    const handleOnBlur = () => {
        if (required && (value === "" && defaultValue == "")) {
            setErrorEnabled(true);
            setErrorMsg("Required Field");
        }
    }

    return (
        <Autocomplete
            // Override of option equality is needed for MUI to properly compare options and values
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disablePortal
            disabled={isDisabled}
            // id="combo-box-demo"
            options={singleSelectOptions}
            defaultValue={defaultValue}
            value={displayedValue}
            sx={{ width: "100%", marginBottom: "10px" }}
            onChange={(event, object) => handleOnChange(object)}
            onBlur={handleOnBlur}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={errorEnabled}
                    helperText={errorMsg}
                />}
        />
    );
}