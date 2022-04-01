import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from 'reactstrap';
import { green } from '@mui/material/colors';

export default function PositionedSnackbar({
    vertical = "top",
    horizontal = "center",
    message = "",
    closed = false,
    className = "success-alert"
}) {

    // const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        closed(true);
        // setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                className={className}
                open
                anchorOrigin={{ vertical, horizontal }}
                onClose={handleClose}
                message={message}
                action={action}
                key={vertical + horizontal}
                autoHideDuration={3000}
            >
            </Snackbar>
        </div>
    );
}
