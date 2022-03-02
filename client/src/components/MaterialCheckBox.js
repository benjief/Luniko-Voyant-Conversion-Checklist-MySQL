import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import CheckCircle from '@mui/icons-material/CheckCircle';

export default function MaterialCheckBox({
    label = "",
    checked = false
}) {
    return (
        <FormGroup>
            <FormControlLabel control={
                <Checkbox
                    color="primary"
                    icon={<CircleOutlined />}
                    checkedIcon={<CheckCircle />}
                    onChange={(event, checked) => console.log(checked)}
                    defaultChecked />}
                label={label} />
        </FormGroup>
    );
}