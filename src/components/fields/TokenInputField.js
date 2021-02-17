import React from 'react';
import {
    TextField,
    InputAdornment,
    Select,
    MenuItem
} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

const preventDecimalEntry = (e) => {
    if (e.key === '.') { e.preventDefault(); }
};


export default function TokenInputField(props) {
    return (
        <TextField id="swap-input" label={`${props.loading ? '' : 'swap'}`} type="number" variant="outlined" InputProps={{
            endAdornment:
                <InputAdornment position="end">
                    <FormControl disabled={props.loading || props.swapState === 'swapLoading'}>
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
                    </FormControl>

                </InputAdornment>,
            onChange: (e) => {
                props.handleInputAmount(e.target.value);
            },
            inputProps: { min: 0, onKeyPress: (e) => preventDecimalEntry(e) },
            disabled: props.loading || props.swapState === 'swapLoading'
        }} />
    );
}

