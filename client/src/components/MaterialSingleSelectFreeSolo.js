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
// import { v4 as uuidv4 } from "uuid";
import "../styles/DialogComponents.css";

const filter = createFilterOptions();

function MaterialSingleSelectFreeSolo(
    {
        field,
        className,
        label,
        placeholder,
        defaultValue,
        singleSelectOptions,
        invalidOptions,
        selectedValue,
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

    const handleClose = () => {
        setDialogValue({
            firstName: "",
            lastName: "",
        });

        toggleOpen(false);
        setIsFirstNameErrorEnabled(false);
        setFirstNameDisplayedHelperText("");
        setIsLastNameErrorEnabled(false);
        setLastNameDisplayedHelperText("");
        setIsAddButtonDisabled(true);
    };

    const [dialogValue, setDialogValue] = React.useState({
        firstName: "",
        lastName: "",
    });

    const checkInputValueAgainstOptions = React.useCallback((inputValue) => {
        let matchingOptions = [];
        if (inputValue.trim() !== "" && singleSelectOptions.length) {
            matchingOptions = singleSelectOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingOptions.length ? false : true;
    }, [singleSelectOptions])

    const checkInputValueAgainstInvalidOptions = React.useCallback((inputValue) => {
        let matchingInvalidOptions = [];
        if (inputValue.trim() !== "" && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingInvalidOptions.length ? false : true;
    }, [invalidOptions])

    const checkExistingOptionsAgainstInvalidOptions = (existingOption) => {
        let matchingInvalidOptions = [];
        if (existingOption.value && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val => {
                return val.value === existingOption.value
            }));
        }
        return matchingInvalidOptions.length ? true : false;
    }

    const getOptionWithLabel = React.useCallback((optionName) => {
        let matchingOptions = [];
        if (optionName && singleSelectOptions.length) {
            matchingOptions = singleSelectOptions.filter((val) => {
                return val.label === optionName;
            });
        }
        return matchingOptions.length ? matchingOptions[0] : "";
    }, [singleSelectOptions])

    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        let fullName = [dialogValue.firstName, dialogValue.lastName].join(" ");

        // prevents duplicate values from being added
        if (checkInputValueAgainstOptions(fullName)
            && checkInputValueAgainstInvalidOptions(fullName)) {
            let selectedObject = { label: fullName, value: -1 }
            let returnedObject = { field: field, value: selectedObject }
            setValue(selectedObject);
            selectedValue(returnedObject);
        } else if (!checkInputValueAgainstOptions(fullName)) {
            setValue(getOptionWithLabel(fullName));
            selectedValue({ field: field, value: getOptionWithLabel(fullName) });
        }
        handleClose();
    }, [checkInputValueAgainstInvalidOptions, checkInputValueAgainstOptions, dialogValue.firstName, dialogValue.lastName, field, getOptionWithLabel, selectedValue])

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
        if (!value) {
            selectedValue({ field: field, value: { label: "", value: null } });
        }
    }, [field, required, selectedValue])

    const handleOnBlur = React.useCallback(() => {
        if (required && !value && !open) {
            setIsErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }, [open, required, value])

    const handleOnChangeNameDialog = (property, value) => {
        let complementProperty = property === "firstName" ? "lastName" : "firstName";

        setDialogValue(
            prev => ({ ...prev, [property]: value })
        );

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

    const handleOnBlurNameDialog = (property) => {
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

    const setNameDialogError = (property, booleanValue) => {
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

    const handleDialogErrors = (firstName, lastName) => {
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
                // isOptionEqualToValue={(option, value) => {
                //     console.log("is option equal to value:", option, value);
                //     return value.length ? option.value === value.value : true;
                // }}
                disablePortal
                value={value}
                // defaultValue={actualDefaultValue.value}
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
                    handleOnChange(value);
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

MaterialSingleSelectFreeSolo.propTypes = {
    field: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.object,
    singleSelectOptions: PropTypes.array,
    invalidOptions: PropTypes.array,
    selectedValue: PropTypes.func,
    required: PropTypes.bool,
}

MaterialSingleSelectFreeSolo.defaultProps = {
    field: "",
    className: "",
    label: "",
    placeholder: "",
    defaultValue: null,
    singleSelectOptions: [{ label: "", value: null }],
    invalidOptions: [],
    selectedValue: () => { },
    required: false,
}

export default MaterialSingleSelectFreeSolo;
