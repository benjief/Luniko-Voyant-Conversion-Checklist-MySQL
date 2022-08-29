import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import "../styles/DialogComponents.css";

function MaterialPasswordDialog({
    content,
    label,
    password,
    setIsCheckboxUnlocked,
    isDisabled,
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [isSubmitPasswordButtonDisabled, setIsSubmitPasswordButtonDisabled] = React.useState(true);
    const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
    const errorMsg = "Invalid password"

    const handleClickOpen = () => {
        if (!isDisabled) {
            setOpen(true);
        }
    };

    const handleOnChange = (value) => {
        setValue(value);
        setIsErrorEnabled(false);
    }

    const handleSubmit = () => {
        if (value === password) {
            setIsCheckboxUnlocked(true);
            handleClose();
        } else {
            setIsErrorEnabled(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
        setIsErrorEnabled(false);
    };

    React.useEffect(() => {
        value.trim() !== ""
            ? setIsSubmitPasswordButtonDisabled(false)
            : setIsSubmitPasswordButtonDisabled(true);
    }, [value])

    return (
        <div className="password-form-dialog-container">
            <button disabled={isDisabled}>
                <LockOpenTwoTone onClick={handleClickOpen} />
            </button>
            <Dialog className="dialog-component" open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText style={{ marginBottom: "10px" }}>
                        {content}
                    </DialogContentText>
                    <TextField
                        onChange={(event) => handleOnChange(event.target.value)}
                        error={isErrorEnabled}
                        helperText={isErrorEnabled ? errorMsg : ""}
                        margin="dense"
                        label={label}
                        type="password"
                        fullWidth
                        variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={isSubmitPasswordButtonDisabled} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

MaterialPasswordDialog.propTypes = {
    content: PropTypes.string,
    label: PropTypes.string,
    password: PropTypes.string,
    setIsCheckboxUnlocked: PropTypes.func,
    isDisabled: PropTypes.bool,
}

MaterialPasswordDialog.defaultProps = {
    content: "",
    label: "",
    password: "",
    setIsCheckboxUnlocked: () => { },
    isDisabled: true,
}

export default MaterialPasswordDialog;
