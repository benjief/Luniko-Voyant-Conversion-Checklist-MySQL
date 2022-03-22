import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function PositionedSnackbar({
    vertical = "top",
    horizontal = "center",
    message = "",
    closed = false
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
                open
                anchorOrigin={{ vertical, horizontal }}
                onClose={handleClose}
                message={message}
                action={action}
                key={vertical + horizontal}
                autoHideDuration={4000}
            />
        </div>
    );
}
