import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';

export default function MaterialCheckBox({
    label = "",
    checked = false,
    defaultChecked = false
}) {
    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    color="primary"
                    icon={<CircleOutlined />}
                    checkedIcon={<CheckCircle />}
                    defaultChecked={defaultChecked}
                    onChange={(event, status) => checked(status)}
                />}
                label={label} />
        </FormGroup>
    );
}