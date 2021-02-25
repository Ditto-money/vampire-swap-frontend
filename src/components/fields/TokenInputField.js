import React, { useState } from 'react';
import {
    TextField,
    InputAdornment,
    Select,
    MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';



const useStyles = makeStyles(theme => {
    return {
        availableBalanceButton: {
            width: 5,
            whiteSpace: 'initial',
            fontSize: 'medium',
            marginRight: '10px'
        }
    };
});



export default function TokenInputField(props) {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState();
    console.log(props.inputTokenAmount);

    return (
        <TextField id="swap-input" label={`${props.loading ? '' : 'swap'}`} type="number" variant="outlined" InputLabelProps={{ shrink: true }} fullWidth InputProps={{
            endAdornment:
                <InputAdornment position="end">
                    {!props.loading &&
                        <Button className={classes.availableBalanceButton} color="secondary" onClick={() => { props.handleInputAmount(Math.floor(props.selectedToken.balance).toString()); setInputValue(Math.floor(props.selectedToken.balance).toString()); }}>
                            Max
                        </Button>
                    }
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
                setInputValue(e.target.value);
            },
            inputProps: { min: 0 },
            disabled: props.loading || props.swapState === 'swapLoading',
            value: inputValue,
            placeholder: 'Amount to swap',
        }} />
    );
}

