import * as React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Alert component, customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-alert/
 * @returns said alert component.
 */
function MaterialAlert({
    vertical, // vertical anchor position
    horizontal, // horizontal anchor position
    message, // the message to be displayed with the alert
    handleAlertClosed, // function that handles what to do when the alert is closed (either by a timeout or by the user)
    className,
}) {
    // X icon - closes the alert
    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleAlertClosed}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        // the main alert component (i.e. the "snackbar") that houses the X button and any text you wish to include
        <Snackbar
            className={className}
            open
            anchorOrigin={{ vertical, horizontal }}
            onClose={handleAlertClosed}
            message={message}
            action={action}
            key={vertical + horizontal}
            autoHideDuration={3000}
        >
        </Snackbar>
    );
}

MaterialAlert.propTypes = {
    vertical: PropTypes.string,
    horizontal: PropTypes.string,
    message: PropTypes.string,
    handleAlertClosed: PropTypes.func,
    className: PropTypes.string,
}

MaterialAlert.defaultProps = {
    vertical: "top",
    horizontal: "center",
    message: "",
    handleAlertClosed: () => { },
    className: "success-alert",
}

export default MaterialAlert;
