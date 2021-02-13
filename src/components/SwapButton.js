import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    IconButton,
    Button,
} from '@material-ui/core';
import { useTheme } from 'contexts/theme';
import { useWallet } from 'contexts/wallet';
import { APP_TITLE } from 'config';

const useStyles = makeStyles(theme => ({
    container: {
        boxShadow: 'none',
    },
    title: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
    },
    account: {
        marginRight: 10,
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        }
    },
    switchMessage: {
        marginRight: 20
    }
}));

export default function Component(props) {
    const classes = useStyles();
    const { address, startConnecting, disconnect, isOnWrongNetwork } = useWallet();
    const { isDark, toggleTheme } = useTheme();

    const shortAddress =
        address && `${address.slice(0, 6)}....${address.slice(-4)}`;

    return (
        <Button>SWAP</Button>
    );
}
