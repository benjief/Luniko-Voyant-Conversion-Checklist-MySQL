import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Popper } from '@mui/material';

export default function MaterialSingleSelect(
    {
        className = "",
        label = "",
        placeholder = "",
        defaultValue = "",
        singleSelectOptions = [],
        selectedValue = "",
        isDisabled = false,
        required = false,
    }

) {
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");

    const customPopper = function (props) {
        return <Popper
            {...props}
            placement="bottom"
            disablePortal={true}
            container={document.getElementsByClassName("MuiPaper-root")[0]}
            modifiers={[
                {
                    name: 'flip',
                    enabled: false,
                    options: {
                        altBoundary: false,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
                {
                    name: 'preventOverflow',
                    enabled: false,
                    options: {
                        altAxis: false,
                        altBoundary: false,
                        tether: false,
                        rootBoundary: 'document',
                        padding: 8,
                    },
                },
            ]}
        ></Popper>
    };

    const handleOnChange = (object) => {
        if (object) {
            selectedValue(object.value);
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
            className={className}
            // Override of option equality is needed for MUI to properly compare options and values
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disablePortal
            PopperComponent={customPopper}
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