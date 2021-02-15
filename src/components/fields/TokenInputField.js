import React from 'react';
import {
    TextField,
    InputAdornment,
    Select,
    MenuItem
} from '@material-ui/core';


export default function TokenInputField(props) {
    return (
        <TextField id="swap-input" label={`${props.loading ? '' : 'swap'}`} type="number" variant="outlined" InputProps={{
            endAdornment:
                <InputAdornment position="end">
                    <Select
                        value={props.selectedToken}
                        onChange={props.handleTokenChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'available tokens' }}
                    >
                        {
                            props.inputTokens.map((token) => {
                                return (
                                    <MenuItem value={token}>{token.symbol}</MenuItem>
                                );
                            })
                        }
                    </Select>
                </InputAdornment>,
            onChange: (e) => {
                props.handleInputAmount(e.target.value);
            },
            inputProps: { min: 0 },
            disabled: props.loading || props.swapState === 'swapLoading'
        }} />
    );
}

