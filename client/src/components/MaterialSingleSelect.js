import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function MaterialSingleSelect(
    {
        field,
        label,
        placeholder,
        defaultValue,
        singleSelectOptions,
        selectedValue,
        isDisabled,
        required,
    }

) {
    const [value, setValue] = React.useState(defaultValue.value !== null ? defaultValue : null);
    const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
    const [displayedHelperText, setDisplayedHelperText] = React.useState("");

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
    }, [required])

    const handleOnBlur = React.useCallback(() => {
        if (required && (value === "")) {
            setIsErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }, [required, value])

    return (
        <Autocomplete
            // Override of option equality is needed for MUI to properly compare options and values
            isOptionEqualToValue={(option, value) => {
                return value !== "" ? option.value === value.value : true;
            }}
            value={value}
            disablePortal
            disabled={isDisabled}
            options={singleSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
            sx={{ width: "100%", marginBottom: "10px" }}
            onChange={(event, value) => {
                setValue(value);
                selectedValue({ field: field, value: value ? value : { label: "", value: null } });
                handleOnChange(value);
            }}
            onBlur={handleOnBlur}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={isErrorEnabled}
                    helperText={displayedHelperText} />
            } />
    );
}

MaterialSingleSelect.propTypes = {
    field: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.object,
    singleSelectOptions: PropTypes.array,
    selectedValue: PropTypes.func,
    isDisabled: PropTypes.bool,
    required: PropTypes.bool,
}

MaterialSingleSelect.defaultProps = {
    field: "",
    label: "",
    placeholder: "",
    defaultValue: null,
    singleSelectOptions: [],
    selectedValue: () => { },
    isDisabled: false,
    required: false,
}

export default MaterialSingleSelect;