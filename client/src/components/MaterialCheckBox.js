import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';

export default function MaterialCheckBox({
    label = "",
    forceOff = false,
    userChecked = false,
    defaultChecked = false
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
    });

    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
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