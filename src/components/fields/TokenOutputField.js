import React from 'react';
import {
    TextField,
    InputAdornment,
    Typography,
} from '@material-ui/core';


export default function TokenInputField(props) {
    return (
        <TextField id="recieve-input" label="recieve" variant="outlined" defaultValue="0" fullWidth InputProps={{
            endAdornment:
                <InputAdornment position="end">
                    <Typography>DITTO</Typography>
                </InputAdornment>,
            readOnly: true,
            value: props.dittoOutputAmount,
            disabled: props.loading
        }} />
    );
}

