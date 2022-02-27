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

export default function FreeSoloCreateOptionDialog(
    {
        label = "",
        placeholder = "",
        multiSelectOptions = [],
        selectedValues = [],
        limitTags = 1,
        required = false
    }) {
    const [values, setValues] = React.useState([]);
    const [open, toggleOpen] = React.useState(false);

    const handleClose = () => {
        setDialogValue({
            label: '',
            value: '',
        });

        toggleOpen(false);
    };

    const [dialogValue, setDialogValue] = React.useState({
        label: '',
        value: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        let tempArray = values;
        tempArray.push({
            label: dialogValue.label,
            value: parseInt(dialogValue.value, 10),
        });
        // console.log(tempArray);
        setValues(tempArray);
        selectedValues(values);

        handleClose();
    };

    const checkForNewValue = (valuesArray) => {
        if (valuesArray.length) {
            let selection = valuesArray[valuesArray.length - 1];
            console.log(valuesArray);
            for (let i = 0; i < multiSelectOptions.length; i++) {
                return selection.label === multiSelectOptions[i].label
                    || selection.inputValue === multiSelectOptions[i].label
                    ? false
                    : true;
            }
        }
        return false;
    }

    // React.useEffect(() => {
    //     console.log(values);
    // })

    return (
        <React.Fragment>
            <Autocomplete
                multiple
                value={values}
                limitTags={limitTags}
                onChange={(event, valuesArray) => { // TODO: change newValue to something else
                    let isNewValue = checkForNewValue(valuesArray);
                    if (isNewValue) {
                        let newValue = valuesArray[valuesArray.length - 1];
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                toggleOpen(true);
                                setDialogValue({
                                    label: newValue,
                                    value: '',
                                });
                            });
                        } else if (newValue && newValue.inputValue) {
                            toggleOpen(true);
                            setDialogValue({
                                label: newValue.inputValue,
                                value: '',
                            });
                        }
                    }
                    else {
                        setValues(valuesArray);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Add "${params.inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                id="free-solo-dialog-demo"
                options={multiSelectOptions}
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
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label={label}
                        placeholder={placeholder}
                        required={required}
                    />}
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add a new film</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Did you miss any film in our list? Please, add it!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            value={dialogValue.label}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    label: event.target.value,
                                })
                            }
                            label="title"
                            type="text"
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            value={dialogValue.value}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    value: event.target.value,
                                })
                            }
                            label="year"
                            type="number"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment >
    );
}
