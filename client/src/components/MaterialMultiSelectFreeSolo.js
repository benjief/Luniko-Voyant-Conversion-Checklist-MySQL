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

function MaterialMultiSelectFreeSolo(
    {
        field,
        className,
        label,
        placeholder,
        defaultValue,
        multiSelectOptions,
        invalidOptions,
        selectedValues,
        limitTags,
        required,
    }) {
    const [values, setValues] = React.useState(defaultValue);
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
        if (inputValue.trim().length && multiSelectOptions.length) {
            let matchingOptions = multiSelectOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
            return matchingOptions.length ? false : true;
        }
    }, [multiSelectOptions])

    const checkInputValueAgainstSelectedValues = React.useCallback((inputValue) => {
        let matchingSelectedValues = [];
        if (inputValue.trim() !== "" && multiSelectOptions.length) {
            matchingSelectedValues = values.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingSelectedValues.length ? false : true;
    }, [multiSelectOptions.length, values])


    const checkInputValueAgainstInvalidOptions = React.useCallback((inputValue) => {
        let matchingInvalidOptions = [];
        if (inputValue.trim() !== "" && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val) => {
                return val.label.toLowerCase() === inputValue.toLowerCase();
            });
        }
        return matchingInvalidOptions.length ? false : true;
    }, [invalidOptions])

    const checkExistingOptionsAgainstInvalidOptions = React.useCallback((existingOption) => {
        let matchingInvalidOptions = [];
        if (existingOption.value && invalidOptions.length) {
            matchingInvalidOptions = invalidOptions.filter((val) => {
                return val.value === existingOption.value;
            })
        }
        return matchingInvalidOptions.length ? true : false;
    }, [invalidOptions])

    const getOptionWithLabel = React.useCallback((optionName) => {
        let matchingOptions = [];
        if (optionName && multiSelectOptions.length) {
            matchingOptions = multiSelectOptions.filter((val) => {
                return val.label === optionName;
            });
        }
        return matchingOptions.length ? matchingOptions[0] : "";
    }, [multiSelectOptions])

    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        let fullName = [dialogValue.firstName, dialogValue.lastName].join(" ");

        // prevents duplicate values from being added
        if (checkInputValueAgainstOptions(dialogValue.firstName + " " + dialogValue.lastName)
            && checkInputValueAgainstSelectedValues(dialogValue.firstName + " " + dialogValue.lastName)
            && checkInputValueAgainstInvalidOptions(dialogValue.firstName + " " + dialogValue.lastName)) {
            setValues(prev => {
                let copyOfValues = [...prev];
                copyOfValues.push({ label: fullName, value: -1 });
                selectedValues({ field: field, value: copyOfValues });
                return copyOfValues;
            });
            // This makes sure the entered value isn't illegal or already selected before adding it to the list of selected values
        } else if (!checkInputValueAgainstOptions(fullName)) {
            setValues(prev => {
                let copyOfValues = [...prev];
                copyOfValues.push(getOptionWithLabel(fullName));
                selectedValues({ field: field, value: copyOfValues });
                return copyOfValues;
            });
        }
        handleClose();
    }, [checkInputValueAgainstInvalidOptions, checkInputValueAgainstOptions, checkInputValueAgainstSelectedValues, dialogValue.firstName, dialogValue.lastName, field, getOptionWithLabel, selectedValues]);

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
            selectedValues({ field: field, value: [] });
        }
    }, [field, required, selectedValues])

    const handleOnBlur = React.useCallback(() => {
        if (required && (!values || values === []) && !open) {
            setIsErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }, [open, required, values])

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

    React.useEffect(() => {
        const getObjectsForInvalidOptions = () => { // TODO: make this more efficient (or think of a completely different way of doing it)
            for (let i = 0; i < invalidOptions.length; i++) {
                if (!invalidOptions[i].label) {
                    for (let j = 0; j < multiSelectOptions.length; j++) {
                        if (multiSelectOptions[j].value === invalidOptions[i]) {
                            invalidOptions[i] = multiSelectOptions[j];
                        }
                    }
                }
            }
        }

        getObjectsForInvalidOptions();
    }, [invalidOptions, multiSelectOptions]);

    return (
        <React.Fragment>
            <Autocomplete
                isOptionEqualToValue={(option, value) => {
                    return value !== "" ? option.value === value.value : true;
                }}
                disablePortal
                multiple
                value={values}
                // defaultValue={defaultValue}
                limitTags={limitTags}
                onBlur={handleOnBlur}
                onChange={(event, valuesArray) => {
                    let newValue = valuesArray[valuesArray.length - 1];
                    if (typeof newValue === "string") {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            let firstName = newValue.split(" ")[0];
                            let lastName = (newValue.split(" ").slice(1)).join(" ");
                            handleDialogErrors(firstName, lastName);
                        });
                    } else if (newValue && newValue.inputValue) {
                        // console.log(newValue.inputValue);
                        let firstName = newValue.inputValue.split(" ")[0];
                        let lastName = (newValue.inputValue.split(" ").slice(1)).join(" ");
                        handleDialogErrors(firstName, lastName);
                    } else {
                        setValues(valuesArray);
                        selectedValues({ field: field, value: valuesArray });
                    }
                    handleOnChange(valuesArray);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue.trim().length
                        && checkInputValueAgainstOptions(params.inputValue)
                        && checkInputValueAgainstSelectedValues(params.inputValue)
                        && checkInputValueAgainstInvalidOptions(params.inputValue)) {
                        filtered.push({
                            inputValue: params.inputValue.trimStart().trimEnd(),
                            label: `Add "${params.inputValue.trimStart().trimEnd()}"`,
                        });
                    }
                    return filtered;
                }}
                options={multiSelectOptions.sort((a, b) => (a.label > b.label) ? 1 : -1)}
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
                            Someone missing? Please, add them!
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

MaterialMultiSelectFreeSolo.propTypes = {
    field: PropTypes.string,
    className: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.array,
    multiSelectOptions: PropTypes.array,
    invalidOptions: PropTypes.array,
    selectedValues: PropTypes.func,
    limitTags: PropTypes.number,
    required: PropTypes.bool,
}

MaterialMultiSelectFreeSolo.defaultProps = {
    field: "",
    className: "",
    label: "",
    placeholder: "",
    defaultValue: [],
    multiSelectOptions: [],
    invalidOptions: [],
    selectedValues: () => { },
    limitTags: 1,
    required: false,
}

export default MaterialMultiSelectFreeSolo;
