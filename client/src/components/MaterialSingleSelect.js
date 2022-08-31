import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

/**
 * A single value selector component customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-autocomplete/.
 * @returns said selector.
 */
function MaterialSingleSelect(
    {
        className,
        field, // name of the field being selected
        label, // text displayed inside of the selector before the user has input anything
        placeholder, // text displayed inside of the selector after the user has input something
        defaultValue, // value to be selected by the component upon initial render
        singleSelectOptions, // selectable options
        selectedValue, // callback function that provides selected value to the component containing this component
        isDisabled, // whether or not the selector is disabled
        required, // whether or not this is a required field
    }

) {
    const [value, setValue] = React.useState(defaultValue.value !== null ? defaultValue : null);
    const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
    const [displayedHelperText, setDisplayedHelperText] = React.useState("");

    /**
     * Handles error messages for changing input. If input is required and the user doesn't input anything, or they remove said input, an error message will be displayed. If input isn't required and the user doesn't input anything, no error message is displayed.
     */
    const handleErrorMessage = React.useCallback((value) => {
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

    /**
     * Handles a blur event. When the user clicks outside the selector just after it has been active, if the selector contains a required field and the input is empty, an error message is displayed. If the input for a required field isn't empty, or the field isn't required, nothing happens.
     */
    const handleOnBlur = React.useCallback(() => {
        if (required && (value === "")) {
            setIsErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }, [required, value])

    return (
        <Autocomplete
            className={className}
            // override of option equality is needed for MUI component to properly compare options and values
            isOptionEqualToValue={(option, value) => {
                return value !== "" ? option.value === value.value : true;
            }}
            value={value}
            disablePortal // handles proper option popover placement 
            disabled={isDisabled}
            options={singleSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
            sx={{ width: "100%", marginBottom: "10px" }}
            onChange={(event, value) => {
                setValue(value); // when values are input, component value is set to that input
                selectedValue({ field: field, value: value ? value : { label: "", value: null } }); // selected value for the field this component represents is sent back to the parent component through a callback function (note: no input value is an object with an empty string label and null value)
                handleErrorMessage(value);
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
    className: PropTypes.string,
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
    className: "",
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