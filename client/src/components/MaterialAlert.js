import * as React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function MaterialAlert({
    vertical,
    horizontal,
    message,
    handleAlertClosed,
    className,
}) {

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
