import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filter = createFilterOptions();

export default function MaterialMultiSelectFreeSolo(
    {
        className = "",
        label = "",
        placeholder = "",
        multiSelectOptions = [],
        invalidOptions = [],
        selectedValues = [],
        limitTags = 1,
        required = false,
    }) {
    const [values, setValues] = React.useState([]);
    const [open, toggleOpen] = React.useState(false);
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const [displayedHelperText, setDisplayedHelperText] = React.useState("");
    const [firstNameErrorEnabled, setFirstNameErrorEnabled] = React.useState(false);
    const [lastNameErrorEnabled, setLastNameErrorEnabled] = React.useState(false);
    const [firstNameDisplayedHelperText, setFirstNameDisplayedHelperText] = React.useState("");
    const [lastNameDisplayedHelperText, setLastNameDisplayedHelperText] = React.useState("");
    const [addButtonDisabled, setAddButtonDisabled] = React.useState(true);

    const handleClose = () => {
        setDialogValue({
            firstName: '',
            lastName: '',
        });

        toggleOpen(false);
        setFirstNameErrorEnabled(false);
        setFirstNameDisplayedHelperText("");
        setLastNameErrorEnabled(false);
        setLastNameDisplayedHelperText("");
        setAddButtonDisabled(true);
    };

    const [dialogValue, setDialogValue] = React.useState({
        firstName: '',
        lastName: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // prevents duplicate values from being added
        if (checkInputValueAgainstOptions(dialogValue.firstName + " " + dialogValue.lastName)
            && checkInputValueAgainstSelectedValues(dialogValue.firstName + " " + dialogValue.lastName)
            && checkInputValueAgainstInvalidOptions(dialogValue.firstName + " " + dialogValue.lastName)) {
            let tempArray = values;
            tempArray.push({
                label: dialogValue.firstName + " " + dialogValue.lastName,
                value: -1,
            });
            setValues(tempArray);
            selectedValues(tempArray);
        }
        handleClose();
    };

    const handleOnChange = (object) => {
        if (required) {
            if (object) {
                setErrorEnabled(false);
                setDisplayedHelperText("");
            } else {
                setErrorEnabled(true);
                setDisplayedHelperText("Required Field");
            }
        }
        if (!object) {
            selectedValues([]);
        }
    }

    const handleOnBlur = () => {
        if (required && (!values || values === []) && !open) {
            setErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }

    // const checkValuesArrayAgainstOptions = (valuesArray) => {
    //     if (valuesArray.length) {
    //         let selection = valuesArray[valuesArray.length - 1];
    //         for (let i = 0; i < multiSelectOptions.length; i++) {
    //             if (/* selection.label.toLowerCase() === multiSelectOptions[i].label.toLowerCase()
    //                 || */ selection.inputValue && selection.inputValue.toLowerCase() === multiSelectOptions[i].label.toLowerCase()) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    // }

    const checkInputValueAgainstOptions = (inputValue) => {
        if (inputValue !== "" && multiSelectOptions.length) {
            for (let i = 0; i < multiSelectOptions.length; i++) {
                if (inputValue.toLowerCase() === multiSelectOptions[i].label.toLowerCase()) {
                    return false;
                }
            }
            return true;
        }
        return true;
    }

    const checkInputValueAgainstSelectedValues = (inputValue) => {
        if (inputValue !== "" && values.length) {
            for (let i = 0; i < values.length; i++) {
                if (inputValue.toLowerCase() === values[i].label.toLowerCase()) {
                    return false;
                }
            }
            return true;
        }
        return true;
    }

    const checkInputValueAgainstInvalidOptions = (inputValue) => {
        if (inputValue !== "" && invalidOptions.length) {
            for (let i = 0; i < invalidOptions.length; i++) {
                if (invalidOptions[i].label.toLowerCase() === inputValue.toLowerCase()) {
                    console.log("returned false");
                    return false;
                }
            }
            return true;
        }
        return true;
    }

    const concatenateLastName = (lastNameArray) => {
        let lastName = "";
        for (let i = 0; i < lastNameArray.length; i++) {
            i === lastNameArray.length - 1
                ? lastName += lastNameArray[i]
                : lastName += lastNameArray[i] + " ";
        }
        return lastName;
    }

    const handleOnChangeFirstNameDialog = (value) => {
        setDialogValue({
            ...dialogValue,
            firstName: value,
        })

        if (value === "") {
            setFirstNameDialogError(true);
            setAddButtonDisabled(true);
        } else {
            setFirstNameDialogError(false);
            if (dialogValue.lastName !== "") {
                setAddButtonDisabled(false);
            }
        }
    }

    const handleOnBlurFirstNameDialog = () => {
        if (dialogValue.firstName === "") {
            setFirstNameDialogError(true);
            setAddButtonDisabled(true);
        }
    }

    const handleOnChangeLastNameDialog = (value) => {
        setDialogValue({
            ...dialogValue,
            lastName: value,
        })

        if (value === "") {
            setLastNameDialogError(true);
            setAddButtonDisabled(true);
        } else {
            setLastNameDialogError(false);
            if (dialogValue.firstName !== "") {
                setAddButtonDisabled(false);
            }
        }
    }

    const handleOnBlurLastNameDialog = () => {
        if (dialogValue.lastName === "") {
            setLastNameDialogError(true);
            setAddButtonDisabled(true);
        }
    }

    const setFirstNameDialogError = (booleanValue) => {
        setFirstNameErrorEnabled(booleanValue);
        if (booleanValue) {
            setFirstNameDisplayedHelperText("Required Field");
        } else {
            setFirstNameDisplayedHelperText("");
        }
    }

    const setLastNameDialogError = (booleanValue) => {
        setLastNameErrorEnabled(booleanValue);
        if (booleanValue) {
            setLastNameDisplayedHelperText("Required Field");
        } else {
            setLastNameDisplayedHelperText("");
        }
    }

    return (
        <React.Fragment>
            <Autocomplete
                multiple
                value={values}
                limitTags={limitTags}
                onBlur={handleOnBlur}
                onChange={(event, valuesArray) => {
                    // let isNewValue = checkValuesArrayAgainstOptions(valuesArray);
                    // if (isNewValue) {
                    let newValue = valuesArray[valuesArray.length - 1];
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            let firstName = newValue.split(" ")[0];
                            let lastName = concatenateLastName(newValue.split(" ").slice(1));
                            if (lastName === "") {
                                setLastNameDialogError(true);
                            } else {
                                if (firstName !== "") {
                                    setAddButtonDisabled(false);
                                }
                            }
                            toggleOpen(true);
                            setDialogValue({
                                firstName: firstName,
                                lastName: lastName,
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        // console.log(newValue.inputValue);
                        // console.log(newValue.inputValue.split(" ")[0]);
                        // console.log(newValue.inputValue.split(" ").slice(1));
                        let firstName = newValue.inputValue.split(" ")[0];
                        let lastName = concatenateLastName(newValue.inputValue.split(" ").slice(1));
                        if (lastName === "") {
                            setLastNameDialogError(true);
                        } else {
                            if (firstName !== "") {
                                setAddButtonDisabled(false);
                            }
                        }
                        toggleOpen(true);
                        setDialogValue({
                            firstName: firstName,
                            lastName: lastName,
                        });
                    } else {
                        setValues(valuesArray);
                        selectedValues(valuesArray);
                    }
                    handleOnChange(valuesArray);
                }}
                filterOptions={(options, params) => {

                    const filtered = filter(options, params);

                    if (params.inputValue !== ""
                        && checkInputValueAgainstOptions(params.inputValue)
                        && checkInputValueAgainstSelectedValues(params.inputValue)
                        && checkInputValueAgainstInvalidOptions(params.inputValue)) {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Add "${params.inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={multiSelectOptions}
                getOptionDisabled={(option) =>
                    invalidOptions.includes(option)
                }
                getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.label;
                }}
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
                        helperText={errorEnabled ? displayedHelperText : null}
                        error={errorEnabled}
                    />}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                className={className}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add Personnel</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Someone missing? Please, add them!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="first-name"
                            value={dialogValue.firstName}
                            error={firstNameErrorEnabled}
                            required={true}
                            onBlur={handleOnBlurFirstNameDialog}
                            onChange={(event) =>
                                handleOnChangeFirstNameDialog(event.target.value)}
                            inputProps={{
                                maxLength: 45
                            }}
                            label="first name"
                            type="text"
                            variant="standard"
                            helperText={firstNameErrorEnabled ? firstNameDisplayedHelperText : null}
                            error={firstNameErrorEnabled}
                        />
                        <TextField
                            margin="dense"
                            id="last-name"
                            value={dialogValue.lastName}
                            error={lastNameErrorEnabled}
                            required={true}
                            onBlur={handleOnBlurLastNameDialog}
                            onChange={(event) =>
                                handleOnChangeLastNameDialog(event.target.value)}
                            inputProps={{
                                maxLength: 45
                            }}
                            label="last name"
                            type="text"
                            variant="standard"
                            helperText={lastNameErrorEnabled ? lastNameDisplayedHelperText : null}
                            error={lastNameErrorEnabled}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" disabled={addButtonDisabled}>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    );
}
