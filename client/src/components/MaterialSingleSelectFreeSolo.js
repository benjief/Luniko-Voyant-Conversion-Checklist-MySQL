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

export default function MaterialSingleSelectFreeSolo(
    {
        className = "",
        label = "",
        placeholder = "",
        singleSelectOptions = [],
        invalidOptions = [],
        selectedValue = {},
        required = false
    }) {
    const [value, setValue] = React.useState("");
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
            && checkInputValueAgainstInvalidOptions(dialogValue.firstName + " " + dialogValue.lastName)) {
            let tempObject = { label: dialogValue.firstName + " " + dialogValue.lastName, value: -1 }
            setValue(tempObject);
            selectedValue(tempObject);
        }
        handleClose();
    };


    const handleOnChange = (value) => {
        if (required) {
            if (value) {
                setErrorEnabled(false);
                setDisplayedHelperText("");
            } else {
                setErrorEnabled(true);
                setDisplayedHelperText("Required Field");
            }
        }
        if (!value) {
            selectedValue({});
        }
    }

    const handleOnBlur = () => {
        if (required && !value && !open) {
            setErrorEnabled(true);
            setDisplayedHelperText("Required Field");
        }
    }

    // const checkValueAgainstOptions = (value) => {
    //     if (value) {
    //         for (let i = 0; i < singleSelectOptions.length; i++) {
    //             if ((value.label.toLowerCase() === singleSelectOptions[i].label.toLowerCase()
    //                 || value.inputValue.toLowerCase() === singleSelectOptions[i].label.toLowerCase())) {
    //                 return false;
    //             }
    //         }
    //         return true;
    //     }
    // }

    const checkInputValueAgainstOptions = (inputValue) => {
        if (inputValue !== "" && singleSelectOptions.length) {
            for (let i = 0; i < singleSelectOptions.length; i++) {
                if (inputValue.toLowerCase() === singleSelectOptions[i].label.toLowerCase()) {
                    return false;
                }
            }
            return true;
        }
        return true;
    }

    const checkInputValueAgainstInvalidOptions = (inputValue) => {
        // console.log(invalidOptions);
        if (inputValue !== "" && invalidOptions.length) {
            for (let i = 0; i < invalidOptions.length; i++) {
                if (invalidOptions[i].label.toLowerCase() === inputValue.toLowerCase()) {
                    return false;
                }
            }
            return true;
        }
        return true;
    }

    // const checkInputValueAgainstSelectedValue = (inputValue) => {
    //     if (inputValue !== "" && value) {
    //         if (inputValue === value.label) {
    //             return false;
    //         }
    //         return true;
    //     } else {
    //         return true;
    //     }
    // }

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
                console.log(dialogValue.firstName);
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
            setFirstNameDisplayedHelperText("Required value");
        } else {
            setFirstNameDisplayedHelperText("");
        }
    }

    const setLastNameDialogError = (booleanValue) => {
        setLastNameErrorEnabled(booleanValue);
        if (booleanValue) {
            setLastNameDisplayedHelperText("Required value");
        } else {
            setLastNameDisplayedHelperText("");
        }
    }

    return (
        <React.Fragment>
            <Autocomplete
                value={value}
                onBlur={handleOnBlur}
                onChange={(event, value) => {
                    // let isNewValue = checkValueAgainstOptions(value);
                    // if (isNewValue) {
                    if (typeof value === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            let firstName = value.split(" ")[0];
                            let lastName = concatenateLastName(value.split(" ").slice(1));
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
                    } else if (value && value.inputValue) {
                        let firstName = value.inputValue.split(" ")[0];
                        let lastName = concatenateLastName(value.inputValue.split(" ").slice(1));
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
                        setValue(value);
                        selectedValue(value);
                    }
                    handleOnChange(value);
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== ''
                        && checkInputValueAgainstOptions(params.inputValue)
                        && checkInputValueAgainstInvalidOptions(params.inputValue)) {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Add "${params.inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={singleSelectOptions}
                getOptionDisabled={(option) =>
                    invalidOptions.includes(option)
                }
                getOptionLabel={(option) => {
                    // console.log(singleSelectOptions);
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
                            Is someone missing? Please, add them!
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
