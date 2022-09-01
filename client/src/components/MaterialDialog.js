import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * A dialog button/popup combination customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-dialog/.
 * @returns said dialog.
 */
function MaterialDialog({
    className,
    exteriorButton, // button users will click on to display the dialog contained in this component
    inactiveButtonText, // text displayed inside of the dialog popup for the button used to close said dialog popup
    displayActiveButton, // whether or not an active button (i.e. a button that calls the function below) should be displayed inside of the dialog popup
    activeButtonFunction, // function to be called when the user clicks on the active button inside of the dialog popup
    activeButtonText, // text displayed inside of the dialog popup for the active button that calls a function
    dialogTitle, // title text displayed inside of the dialog popup
    dialogDescription, // description text displayed inside of the dialog popup
    isDialogDisabled, // whether or not the dialog is disabled
}) {
    const [open, setOpen] = React.useState(false);

    /**
     * Opens the dialog popup.
     */
    const handleClickOpen = () => {
        if (!isDialogDisabled) {
            setOpen(true);
        }
    };

    /**
     * Closes the dialog popup.
     */
    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Closes the dialog popup before calling the active button function (if it's set be displayed).
     */
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
