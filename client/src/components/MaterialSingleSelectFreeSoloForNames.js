import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import "../styles/DialogComponents.css";

const filter = createFilterOptions();

function MaterialSingleSelectFreeSoloForNames(
    {
        className,
        field, // name of the field being selected
        label, // text displayed inside of the selector before the user has input anything
        placeholder, // text displayed inside of the selector after the user has input something
        defaultValue, // value to be selected by the component upon initial render
        singleSelectOptions, // selectable options
        invalidOptions, // array of options that aren't valid (e.g. if a user has chosen an option in some other, mutually exclusive field that invalidates options in this one)
        selectedValue, // callback function that provides selected value to the component containing this component
        isDisabled, // whether or not the selector is disabled
        required,
    }) {
    const [value, setValue] = React.useState(defaultValue.value !== null ? defaultValue : null);
    const [open, toggleOpen] = React.useState(false);
    const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
    const [displayedHelperText, setDisplayedHelperText] = React.useState("");
    const [isFirstNameErrorEnabled, setIsFirstNameErrorEnabled] = React.useState(false);
    const [isLastNameErrorEnabled, setIsLastNameErrorEnabled] = React.useState(false);
    const [firstNameDisplayedHelperText, setFirstNameDisplayedHelperText] = React.useState("");
    const [lastNameDisplayedHelperText, setLastNameDisplayedHelperText] = React.useState("");
    const [isAddButtonDisabled, setIsAddButtonDisabled] = React.useState(true);
    const [dialogValue, setDialogValue] = React.useState({
        firstName: "",
        lastName: "",
    });

    /**
     * Closes the dialog popup. After this happens, dialog values are set to empty strings, and any error messages that may have been present are cleared. In other words, the dialog is reset for the next time it is opened.
     */
    const handleClose = () => {
        toggleOpen(false);
        setDialogValue({
            firstName: "",
            lastName: "",
        });
        setIsFirstNameErrorEnabled(false);
        setFirstNameDisplayedHelperText("");
        setIsLastNameErrorEnabled(false);
        setLastNameDisplayedHelperText("");
        setIsAddButtonDisabled(true);
    };

    /**
     * Determines whether the input value is present in the singleSelectOptions array. Only lower case labels between options (objects with value and label props) are compared.
     * @param {object} inputValue - the input object being compared to objects set as options.
     * @returns false if the input value is matched against any of this selector's options, true otherwise.
     */
    const checkInputValueAgainstOptions = React.useCallback((inputValue) => {
        let matchingOptions = [];
        if (inputValue.trim() !== "" && singleSelectOptions.length) {
            matchingOptions = singleSelectOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingOptions.length ? false : true;
    }, [singleSelectOptions])

    /**
     * Determines whether the input value is present in the invalidOptions array. Only lower case labels between options (objects with value and label props) are compared. In this case, comparing values wouldn't work, since this is a free solo component, and any input that wasn't fetched from the database will have the same value (namely, -1).
     * @param {object} inputValue - the input object being compared to objects in the invalidOptions array.
     * @returns false if the input value is matched against any of this selector's invalid options, true otherwise.
     */
    const checkInputValueAgainstInvalidOptions = React.useCallback((inputValue) => {
        let matchingInvalidOptions = [];
        if (inputValue.trim() !== "" && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingInvalidOptions.length ? false : true;
    }, [invalidOptions])

    /**
     * Determines whether an existing option is present in the invalidOptions array. Only values between options (objects with value and label props) are compared.
     * @param {object} existingOption - the object being compared to objects deemed to be invalid.
     * @returns true if the existing option is matched against any of this selector's invalid options, false otherwise.
     */
    const checkExistingOptionsAgainstInvalidOptions = (existingOption) => {
        let matchingInvalidOptions = [];
        if (existingOption.value && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val => {
                return val.value === existingOption.value
            }));
        }
        return matchingInvalidOptions.length ? true : false;
    }

    /**
     * If a user inputs the name of an already-existing option into the dialog popup (i.e. it already exists in singleSelectOptions), that option is retrieved and selected, rather than creating a duplicate of that option (with the same label/different value).
     * @param {string} optionLabel - the label of the object to be located and returned.
     * @returns the object in singleSelectOptions with a matching label, if it exists; an empty string if not.
     */
    const getOptionWithLabel = React.useCallback((optionName) => {
        let matchingOptions = [];
        if (optionName && singleSelectOptions.length) {
            matchingOptions = singleSelectOptions.filter((val) => {
                return val.label === optionName;
            });
        }
        return matchingOptions.length ? matchingOptions[0] : "";
    }, [singleSelectOptions])

    /**
     * Handles submission of user input from the dialog popup. Calls functions that determine if said input already exists in this selector's options/invalid options. Essentially, if the user attemps to create a new option with the same label as one that already exists, or is invalid (i.e. having already been selected in this selector or having already been selected inside of a separate, mutually exclusive field). If a valid new option is input, its value is set to -1, a flag that is used by the main page to write new options to the database when a form is submitted. If the user enters a valid, already-existing option, that option is retrieved and added to the selected input.
     * @param {event} event - the submission event triggering this function call.
     */
    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        let fullName = [dialogValue.firstName, dialogValue.lastName].join(" ");

        // input is NOT already in options and isn't in invalid options - input = new option
        if (checkInputValueAgainstOptions(fullName)
            && checkInputValueAgainstInvalidOptions(fullName)) {
            let selectedObject = { label: fullName, value: -1 }
            let returnedObject = { field: field, value: selectedObject }
            setValue(selectedObject);
            selectedValue(returnedObject);
            // input IS already in options and isn't in invalid options - input = existing option
        } else if (!checkInputValueAgainstOptions(fullName)) {
            setValue(getOptionWithLabel(fullName));
            selectedValue({ field: field, value: getOptionWithLabel(fullName) });
        }
        handleClose();
    }, [checkInputValueAgainstInvalidOptions, checkInputValueAgainstOptions, dialogValue.firstName, dialogValue.lastName, field, getOptionWithLabel, selectedValue])

    /**
     * Handles error messages for changing input. If input is required and the user doesn't input anything, or they remove existing input, an error message will be displayed. If input isn't required and the user doesn't input anything, the value for the field is set to an object with a null value and empty string label, and no error message is displayed.
     * @param {value} - the selected value.
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
        if (!value) {
            selectedValue({ field: field, value: { label: "", value: null } });
        }
    }, [field, required, selectedValue])

    /**
     * Handles a blur event. When the user clicks outside the selector just after it has been active, if the selector contains a required field and the input is empty, an error message is displayed. If the input for a required field isn't empty, or the field isn't required, nothing happens.
     */
    const handleOnBlur = React.useCallback(() => {
        if (required && !value && !open) {
            setIsErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }, [open, required, value])

    /**
     * Handles changing inputs to the first and last name fields inside the dialog popup. The dialog value is set to whatever is input by the user. Then, further functions are called to handle the display of error messages (depending on whether or not the field is empty). Additionally, if one or more of the dialog fields is empty, the submit button is disabled. If both dialog fields contain input values, the submit button is enabled. It should be noted that this function assumes that both dialog popup fields are required. This should be made more general in the future.
     * @param {string} property - "firstName" if the first name dialog box is being changed; "lastName" if the last name dialog box is being changed.
     * @param {string} value - the value input by the user.
     */
    const handleOnChangeNameDialog = (property, value) => { // TODO: abstract this function
        // both dialog input fields must be dealt with, regardless of which one is being changed
        let complementProperty = property === "firstName" ? "lastName" : "firstName";

        setDialogValue(
            prev => ({ ...prev, [property]: value })
        );

        // handles error message display
        if (!value.trim().length) {
            property === "firstName"
                ? setNameDialogError(property, true)
                : setNameDialogError(property, true);
            setIsAddButtonDisabled(true);
        } else {
            property === 'firstName'
                ? setNameDialogError(property, false)
                : setNameDialogError(property, false);

            if (dialogValue[complementProperty].trim().length) {
                setIsAddButtonDisabled(false);
            }
        }
    }

    /**
     * Handles a blur event for a required dialog popup field. When the user clicks outside this field, further functions are called to handle the display of error messages (depending on whether or not the field is empty). Additionally, if one or more of the dialog fields is empty, the submit button is disabled. If both dialog fields contain input values, the submit button is enabled.
     * @param {string} property - "firstName" if the first name dialog box is being changed; "lastName" if the last name dialog box is being changed.
     */
    const handleOnBlurNameDialog = (property) => { // TODO: abstract this function
        // both dialog input fields must be dealt with, regardless of which one is being changed
        let complementProperty = property === "firstName" ? "lastName" : "firstName";

        if (!dialogValue[property].trim().length) {
            property === "firstName"
                ? setNameDialogError(property, true)
                : setNameDialogError(property, true);
            setIsAddButtonDisabled(true);
        } else {
            property === "firstName"
                ? setNameDialogError(property, false)
                : setNameDialogError(property, false);
            if (dialogValue[complementProperty].trim().length) {
                setIsAddButtonDisabled(false);
            }
        }
    }

    /**
     * Displays (or hides) an error message below dialog popup fields. Said error message is "Required Field," but this could be made more flexible in the future.
     * @param {string} property - "firstName" if the first name dialog box is being changed; "lastName" if the last name dialog box is being changed.
     * @param {boolean} booleanValue - true if the error message should be displayed; false if the error message should be hidden.
     */
    const setNameDialogError = (property, booleanValue) => { // TODO: abstract this function
        property === "firstName"
            ? setIsFirstNameErrorEnabled(booleanValue)
            : setIsLastNameErrorEnabled(booleanValue);
        if (booleanValue) {
            property === "firstName"
                ? setFirstNameDisplayedHelperText("Required Field")
                : setLastNameDisplayedHelperText("Required Field");
        } else {
            property === "firstName"
                ? setFirstNameDisplayedHelperText("")
                : setLastNameDisplayedHelperText("");
        }
    }

    /**
     * Handles the display of error messages and enabling/disabling of the submit button for this component's dialog popup, when a user enters an option that doesn't already exist. For example, if the user enters "Firstname" and attempts to add this option, the last name field in the dialog popup, when it opens, will have an error message displayed below it. In addition, the submit button will be disabled. This operates very similarly to the functions above, but deals with the case of a popup dialog that isn't yet open.
     * @param {string} firstName - input for the first name field.
     * @param {string} lastName - input for the last name field.
     */
    const handleDialogErrors = (firstName, lastName) => { // TODO: abstract this function
        !firstName.trim().length ? setNameDialogError("firstName", true) : setNameDialogError("firstName", false);
        !lastName.trim().length ? setNameDialogError("lastName", true) : setNameDialogError("lastName", false);
        !firstName.trim().length || !lastName.trim().length ? setIsAddButtonDisabled(true) : setIsAddButtonDisabled(false);
        toggleOpen(true);
        setDialogValue({
            firstName: firstName,
            lastName: lastName,
        });
    }

    return (
        <React.Fragment>
            <Autocomplete
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={isDisabled}
                disablePortal // handles proper option popover placement 
                value={value}
                onBlur={handleOnBlur}
                onChange={(event, value) => {
                    if (typeof value === "string") {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            let firstName = value.split(" ")[0];
                            let lastName = (value.split(" ").slice(1)).join(" ");
                            handleDialogErrors(firstName, lastName)
                        });
                    } else if (value && value.inputValue) {
                        let firstName = value.inputValue.split(" ")[0];
                        let lastName = (value.inputValue.split(" ").slice(1)).join(" ");
                        handleDialogErrors(firstName, lastName);
                    } else {
                        setValue(value);
                        selectedValue({ field: field, value: value });
                    }
                    handleErrorMessage(value);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue.trim() !== ''
                        && checkInputValueAgainstOptions(params.inputValue)
                        && checkInputValueAgainstInvalidOptions(params.inputValue)) {
                        filtered.push({
                            inputValue: params.inputValue.trimStart().trimEnd(),
                            label: `Add "${params.inputValue.trimStart().trimEnd()}"`,
                        });
                    }
                    return filtered;
                }}
                options={singleSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
                getOptionDisabled={(option) => {
                    return checkExistingOptionsAgainstInvalidOptions(option);
                }}
                getOptionLabel={(option) => option.label || ""}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                freeSolo
                filterSelectedOptions
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label={label}
                        placeholder={placeholder}
                        required={required}
                        helperText={isErrorEnabled ? displayedHelperText : null}
                        error={isErrorEnabled}
                    />}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                className={"dialog-component"}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add Personnel</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Is someone missing? Please, add them!
                        </DialogContentText>
                        <TextField
                            // autoFocus
                            margin="dense"
                            id="first-name"
                            value={dialogValue.firstName}
                            error={isFirstNameErrorEnabled}
                            required={true}
                            onBlur={() => handleOnBlurNameDialog("firstName")}
                            onChange={(event) =>
                                handleOnChangeNameDialog("firstName", event.target.value)}
                            inputProps={{
                                maxLength: 45
                            }}
                            label="first name"
                            type="text"
                            variant="standard"
                            helperText={isFirstNameErrorEnabled ? firstNameDisplayedHelperText : null}
                        />
                        <TextField
                            margin="dense"
                            id="last-name"
                            value={dialogValue.lastName}
                            error={isLastNameErrorEnabled}
                            required={true}
                            onBlur={() => handleOnBlurNameDialog("lastName")}
                            onChange={(event) =>
                                handleOnChangeNameDialog("lastName", event.target.value)}
                            inputProps={{
                                maxLength: 45
                            }}
                            label="last name"
                            type="text"
                            variant="standard"
                            helperText={isLastNameErrorEnabled ? lastNameDisplayedHelperText : null}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={isAddButtonDisabled}>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    );
}

MaterialSingleSelectFreeSoloForNames.propTypes = {
    field: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.object,
    singleSelectOptions: PropTypes.array,
    invalidOptions: PropTypes.array,
    selectedValue: PropTypes.func,
    isDisabled: PropTypes.bool,
    required: PropTypes.bool,
}

MaterialSingleSelectFreeSoloForNames.defaultProps = {
    field: "",
    className: "",
    label: "",
    placeholder: "",
    defaultValue: null,
    singleSelectOptions: [{ label: "", value: null }],
    invalidOptions: [],
    selectedValue: () => { },
    isDisabled: false,
    required: false,
}

export default MaterialSingleSelectFreeSoloForNames;
