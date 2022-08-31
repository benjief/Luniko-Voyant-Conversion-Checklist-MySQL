import * as React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';

/**
 * A checkbox customized from the original Material UI component that can be found here: https://mui.com/material-ui/react-checkbox/.
 * @returns said checkbox.
 */
function MaterialCheckBox({
    className,
    label, // text that is displayed beside the checkbox
    isForcedOff, // whether or not the checkbox should be forced off
    userChecked, // callback function that handles the state of the checkbox (i.e. checked/unchecked, or true/false)
    defaultChecked, // whether or not the checkbox should be checked upon loading
    isDisabled, // whether or not the checkbox is disabled
}) {
    const [checked, setChecked] = React.useState(defaultChecked);

    const handleOnChange = (checked) => {
        setChecked(checked);
        userChecked(checked);
    }

    React.useEffect(() => {
        if (isForcedOff && checked) {
            setChecked(false);
            userChecked(false);
        }
    }, [checked, isForcedOff, userChecked]);

    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    className={className}
                    disabled={isDisabled}
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
    isForcedOff: PropTypes.bool,
    userChecked: PropTypes.func,
    defaultChecked: PropTypes.bool,
    isDisabled: PropTypes.bool,
}

MaterialCheckBox.defaultProps = {
    className: "",
    label: "",
    isForcedOff: false,
    userChecked: () => { },
    defaultChecked: false,
    isDisabled: false,
}

export default MaterialCheckBox;
