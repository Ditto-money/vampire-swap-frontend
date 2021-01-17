import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Typography,
  Toolbar,
  IconButton,
  Tooltip,
  Button,
} from '@material-ui/core';
import LightIcon from '@material-ui/icons/Brightness1';
import DarkIcon from '@material-ui/icons/Brightness2';
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
    },
  },
}));

export default function Component() {
  const classes = useStyles();
  const { address, startConnecting, disconnect } = useWallet();
  const { isDark, toggleTheme } = useTheme();

  const shortAddress =
    address && `${address.slice(0, 6)}....${address.slice(-4)}`;

  return (
    <AppBar position="fixed" color="inherit" className={classes.container}>
      <Toolbar color="inherit">
        <Typography variant="h6" className={'flex flex-grow'}>
          <div className={'flex flex-col'} href="/">
            {APP_TITLE}
          </div>
        </Typography>

        {address ? (
          <>
            &nbsp;
            <div className={classes.account}>{shortAddress}</div>
            <Button color="secondary" onClick={disconnect}>
              Disconnect
            </Button>
          </>
        ) : (
          <Button color="secondary" onClick={startConnecting}>
            Connect Wallet
          </Button>
        )}

        <Tooltip title="Toggle light/dark theme">
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="Toggle light/dark theme"
          >
            {isDark ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
