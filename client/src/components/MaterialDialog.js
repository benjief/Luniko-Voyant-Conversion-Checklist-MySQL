import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function MaterialDialog({
    className,
    exteriorButton,
    inactiveButtonText,
    displayActiveButton,
    activeButtonFunction,
    activeButtonText,
    dialogTitle,
    dialogDescription,
    isDialogDisabled,
}) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        if (!isDialogDisabled) {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOnClickActiveButton = () => {
        handleClose();
        activeButtonFunction();
    }

    return (
        <div>
            <div className="material-dialog-exterior-button-container" onClick={handleClickOpen}>
                {exteriorButton}
            </div>
            <Dialog
                className={className}
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent id="alert-dialog-description">
                    {dialogDescription}
                </DialogContent>
                <DialogActions>
                    <Button className="material-dialog-inactive-button" onClick={handleClose} autoFocus>
                        {inactiveButtonText}
                    </Button>
                    {displayActiveButton
                        ? <Button className="material-dialog-active-button" onClick={handleOnClickActiveButton} autoFocus>
                            {activeButtonText}
                        </Button>
                        : <div></div>}
                </DialogActions>
            </Dialog>
        </div >
    );
}

MaterialDialog.propTypes = {
    className: PropTypes.string,
    exteriorButton: PropTypes.object,
    inactiveButtonText: PropTypes.string,
    displayActiveButton: PropTypes.bool,
    activeButtonFunction: PropTypes.func,
    activeButtonText: PropTypes.string,
    dialogTitle: PropTypes.string,
    dialogDescription: PropTypes.object,
    isDialogDisabled: PropTypes.bool,
}

MaterialDialog.defaultProps = {
    className: "",
    exteriorButton: {},
    inactiveButtonText: "",
    displayActiveButton: false,
    activeButtonFunction: () => { },
    activeButtonText: "",
    dialogTitle: "",
    dialogDescription: {},
    isDialogDisabled: false,
}

export default MaterialDialog;
