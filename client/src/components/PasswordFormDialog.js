import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import "../styles/DialogComponents.css";

export default function PasswordFormDialog({
    content = "",
    label = "",
    password = "",
    unlocked = false
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [submitDisabled, setSubmitDisabled] = React.useState(true);
    const [errorEnabled, setErrorEnabled] = React.useState(false);
    const errorMsg = "Invalid password"

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleOnChange = (value) => {
        setValue(value);
        setErrorEnabled(false);
    }

    const handleSubmit = () => {
        if (value === password) {
            unlocked(true);
            handleClose();
        } else {
            setErrorEnabled(true);
        }
    }

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        value.trim() !== ""
            ? setSubmitDisabled(false)
            : setSubmitDisabled(true);
    })

    return (
        <div className="password-form-dialog-container">
            <CircleOutlined onClick={handleClickOpen} />
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button> */}
            <Dialog className="dialog-component" open={open} onClose={handleClose}>
                {/* <DialogTitle>Subscribe</DialogTitle> */}
                <DialogContent>
                    <DialogContentText style={{ marginBottom: "10px" }}>
                        {content}
                    </DialogContentText>
                    <TextField
                        onChange={(event) => handleOnChange(event.target.value)}
                        error={errorEnabled}
                        helperText={errorEnabled ? errorMsg : ""}
                        // autoFocus
                        margin="dense"
                        // id="name"
                        label={label}
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button disabled={submitDisabled} onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
