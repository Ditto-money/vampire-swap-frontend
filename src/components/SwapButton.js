import React from 'react';
import {
    Button,
} from '@material-ui/core';

import CachedIcon from '@material-ui/icons/Cached';
import CheckIcon from '@material-ui/icons/Check';
import SwapVertIcon from '@material-ui/icons/SwapVert';

import { withStyles } from '@material-ui/core/styles';

// const styles = theme => ({
//     loading: {
//         transition: theme.transitions.create(["transform"], {
//             duration: theme.transitions.duration.short
//         }),
//     },
//     dropdownOpen: {
//         transform: "rotate(-180deg)",
//     },
//     dropdownClosed: {
//         transform: "rotate(0)"
//     }
// })

const ColourButton = withStyles((theme) => ({
    root: {
        color: theme.palette.primary.main,
        width: 250
    },
}))(Button);



export default function SwapButton(props) {
    switch (props.swapState) {
        case 'initial':
            return <ColourButton
                onClick={() => props.approveSwap()}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CheckIcon />}>Approve Swap</ColourButton>;
        case 'approvingSwap':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CachedIcon />}>Approving Swap</ColourButton>;
        case 'swapApproved':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => props.swap()}
                startIcon={<SwapVertIcon />}>Swap for Ditto</ColourButton>;
        case 'swapLoading':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CachedIcon />}>Swapping</ColourButton>;
        case 'swapComplete':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CheckIcon />}>Swap Complete</ColourButton>;
        case 'error':
            return <p>Error occured</p>;
        default:
            return null;
    }
}
