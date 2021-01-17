import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Dialog } from '@material-ui/core';
import { Close as Icon } from '@material-ui/icons';
import { useWallet } from 'contexts/wallet';
import { NETWORK_NAME } from 'config';

const useStyles = makeStyles(theme => ({
  container: {
    width: 350,
    padding: '0 20px 10px',
    lineHeight: '1.5rem',
    '& button': {
      width: '100%',
      padding: '10px 0',
      marginTop: 20,
      fontSize: 18,
    },
  },
  x: {
    position: 'absolute',
    top: 5,
    right: 5,
    cursor: 'pointer',
  },
  wallet: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '10px 0',
    '& img': {
      marginRight: 15,
    },
    '&:hover': {
      opacity: 0.8,
    },
  },
  net: {
    color: theme.palette.secondary.main,
  },
}));

export default function() {
  const classes = useStyles();
  const wallet = useWallet();

  return (
    <Dialog
      onClose={() => {}}
      aria-labelledby="wrong-network-prompt"
      open={wallet.isOnWrongNetwork || wallet.isConnecting}
    >
      <div className={clsx('flex', 'flex-grow', 'flex-col', classes.container)}>
        {!wallet.isOnWrongNetwork ? (
          <>
            <div className={classes.x}>
              <Icon style={{ fontSize: 20 }} onClick={wallet.stopConnecting} />
            </div>
            <h3>Connect Wallet</h3>
            <div className={clsx('flex', 'flex-col')}>
              <div
                onClick={wallet.connectMetamask}
                className={clsx(classes.wallet)}
              >
                <img
                  src="wallets/metamask.svg"
                  width="35"
                  height="35"
                  alt="metamask wallet"
                />
                <div>Metamask</div>
              </div>
              <div onClick={wallet.connectBsc} className={clsx(classes.wallet)}>
                <img
                  src="wallets/bsc.png"
                  width="35"
                  height="35"
                  alt="bsc wallet"
                />
                <div>Binance Wallet</div>
              </div>
              <div
                onClick={wallet.connectTrust}
                className={clsx(classes.wallet)}
              >
                <img
                  src="wallets/trust.svg"
                  width="35"
                  height="35"
                  alt="trust wallet"
                />
                <div>Trust Wallet</div>
              </div>
            </div>
          </>
        ) : (
          <Box
            mt={2}
            className={clsx(
              'flex',
              'flex-col',
              'items-center',
              'justify-center',
              'text-center'
            )}
          >
            <div>You are connected to the wrong network</div>
            <strong>
              Please connect to Binance Smart Chain{' '}
              <span className={classes.net}>{NETWORK_NAME}</span>
            </strong>
            <div>or</div>
            <div className="cursor-pointer" onClick={wallet.disconnect}>
              disconnect
            </div>
          </Box>
        )}
      </div>
    </Dialog>
  );
}
