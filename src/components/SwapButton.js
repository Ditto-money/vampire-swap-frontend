import React from 'react';
import {
    Button,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import CachedIcon from '@material-ui/icons/Cached';
import CheckIcon from '@material-ui/icons/Check';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support



const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};


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

const LoadingIcon = withStyles((theme) => ({
    root: {
        animation: 'rotation 2s infinite linear'
    }
}))(CachedIcon);

const renderButton = (swapState, approveSwap, swap) => {
    switch (swapState) {
        case 'initial':
            return <ColourButton
                onClick={() => approveSwap()}
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CheckIcon />}>Approve Swap</ColourButton>;
        case 'approvingSwap':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<LoadingIcon />}>Approving Swap</ColourButton>;
        case 'swapApproved':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => swap()}
                startIcon={<SwapVertIcon />}>Swap for Ditto</ColourButton>;
        case 'swapLoading':
            return <ColourButton
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<LoadingIcon />}>Swapping</ColourButton>;
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
};


export default function SwapButton(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        if (props.swapState === 'swapComplete') handleOpen();
    }, [props.swapState]);


    return (
        <div>
            {renderButton(props.swapState, props.approveSwap, props.swap)}
            {props.swapState === 'initial' &&
                <Tooltip title="Approve input tokens for swapping. Will only send an Ethereum transaction if prior approval is insufficient." aria-label="Approve input tokens for swapping. Will only send an Ethereum transaction if prior approval is insufficient." placement="top" interactive>
                    <InfoIcon color="secondary" style={{ fontSize: 25, paddingLeft: 10 }} />
                </Tooltip>
            }

            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="spring-modal-title">Swap Successful!</h2>
                        <p id="spring-modal-description">You will receive {props.dittoOutputAmount} DITTO on your wallet on Binance smart chain shortly.</p>
                    </div>
                </Fade>
            </Modal>

        </div>
    );
}
