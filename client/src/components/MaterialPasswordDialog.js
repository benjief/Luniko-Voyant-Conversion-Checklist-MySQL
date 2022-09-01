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

/**
 * A dialog lock icon/popup combination used for entering passwords and revealing a checkbox. Note that the checkbox comes from another component that houses this dialog. Customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-dialog/.
 * @returns said password dialog.
 */
function MaterialPasswordDialog({
    content, // text displayed in the body of the dialog popup, above the password input field
    label, // the label to be used for the password input field
    password, // the password used to unlock the checkbox
    setIsCheckboxUnlocked,  // a state-setting function for whether or not the checkbox's (housed in another component) isCheckboxUnlocked state variable is set to true
    isDisabled, // whether or not this password dialog is disabled
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [isSubmitPasswordButtonDisabled, setIsSubmitPasswordButtonDisabled] = React.useState(true);
    const [isErrorEnabled, setIsErrorEnabled] = React.useState(false);
    const errorMsg = "Invalid password"

    /**
     * Opens the dialog popup.
     */
    const handleClickOpen = () => {
        if (!isDisabled) {
            setOpen(true);
        }
    };

    /** 
     * Handles changes to the dialog's input field. The dialog popup's input value is set to any user-entered input and any displayed error messages are cleared.
     * @param {string} value - user-entered input
    */
    const handleOnChange = (value) => {
        setValue(value);
        setIsErrorEnabled(false);
    }

    /**
     * Handles password submission. If the user-entered input matches the password, the parent component's checkbox's isCheckBoxUnlocked state variable is set to true and the dialog popup is closed.
     */
    const handleSubmit = () => {
        if (value === password) {
            setIsCheckboxUnlocked(true);
            handleClose();
        } else {
            setIsErrorEnabled(true);
        }
    }

    /**
     *      * Closes the dialog popup.
     */
    const handleClose = () => {
        setOpen(false);
        setIsErrorEnabled(false);
    };

    /**
     * If user-entered input exists, the dialog popup's submit button is enabled. Otherwise, it is disabled.
     */
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
