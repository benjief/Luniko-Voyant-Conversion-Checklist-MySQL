import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function MaterialSingleSelect(
    {
        id = "",
        label = "",
        placeholder = "",
        defaultValue = "",
        singleSelectOptions = [],
        selectedValue = "",
        isDisabled = false,
        required = false
    }
) {
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");

    const handleOnChange = (object) => {
        if (object) {
            console.log(object);
            selectedValue(object);
            setErrorEnabled(false);
            setErrorMsg("");
        } else {
            selectedValue("");
            if (required) {
                setErrorEnabled(true);
                setErrorMsg("Required Field");
            }
        }
    }

    return (
        <Autocomplete
            // Override of option equality is needed for MUI to properly compare options and values
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disablePortal
            disabled={isDisabled}
            options={singleSelectOptions}
            defaultValue={defaultValue}
            sx={{ width: "100%", marginBottom: "10px" }}
            onChange={(event, object) => handleOnChange(object)}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={errorEnabled}
                    helperText={errorMsg} />
            }
        />
    );
}