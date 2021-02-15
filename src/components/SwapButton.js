import React from 'react';
import {
    Button,
} from '@material-ui/core';


export default function SwapButton(props) {
    switch (props.swapState) {
        case 'initial':
            return <Button onClick={() => props.approveSwap()}>Approve Swap</Button>;
        case 'approvingSwap':
            return <Button>Approving Swap</Button>;
        case 'swapApproved':
            return <Button onClick={() => props.swap()}>Swap for Ditto</Button>;
        case 'swapLoading':
            return <Button>Swapping</Button>;
        case 'swapComplete':
            return <Button>Swap Complete</Button>;
        case 'error':
            return <p>Error occured</p>;
        default:
            return null;
    }
}
