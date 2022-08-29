import * as React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';

function MaterialCheckBox({
    className,
    label,
    forceOff,
    userChecked,
    defaultChecked,
    disabled,
}) {
    const [checked, setChecked] = React.useState(defaultChecked);

    const handleOnChange = (status) => {
        setChecked(status);
        userChecked(status);
    }

    React.useEffect(() => {
        if (forceOff) {
            setChecked(false);
            userChecked(false);
        }
    }, [forceOff, userChecked]);

    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    className={className}
                    disabled={disabled}
                    disableRipple
                    color="primary"
                    icon={<CircleOutlined />}
                    checkedIcon={<CheckCircle />}
                    checked={checked}
                    onChange={(event, status) => handleOnChange(status)}
                />}
                label={label} />
        </FormGroup>
    );
}

MaterialCheckBox.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    forceOff: PropTypes.bool,
    userChecked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    disabled: PropTypes.bool,
}

MaterialCheckBox.defaultProps = {
    className: "",
    label: "",
    forceOff: false,
    userChecked: false,
    defaultChecked: false,
    disabled: false,
}

export default MaterialCheckBox;