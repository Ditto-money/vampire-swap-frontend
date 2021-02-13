import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
  NETWORK_NAME
} from 'config';
import { makeStyles } from '@material-ui/core/styles';
import { Box, InputAdornment, TextField, Typography, Button } from '@material-ui/core';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';

import { useWallet } from 'contexts/wallet';




const useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'grid',
    },
    headerContainer: {
      // gridArea: 'header',
    },
    navContainer: {
      // gridArea: 'nav',

    },
    contentContainer: {
      // gridArea: 'content',
      paddingTop: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    swapInput: {
      marginTop: 50,
      display: 'flex',
      flexDirection: 'column'
    },
    recieveInput: {
      marginTop: 100,
      display: 'flex',
      flexDirection: 'column'
    },
    availableBalanceCaption: {
      textAlign: 'right'
    }
  };
});

export default function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [inputTokens, setInputTokens] = React.useState([]);
  const [selectedToken, setSelectedToken] = React.useState(null);
  const [dittoOutputAmount, setDittoOutputAmount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [dittoRemaining, setDittoRemaining] = React.useState();
  const [swapState, setSwapState] = React.useState('initial');
  const [inputTokenAmount, setInputTokenAmount] = React.useState(0);


  const { address, availableTokens, swapContract, isOnWrongNetwork } = useWallet();


  useEffect(() => {
    const loadPrices = async () => {
      console.log(swapContract);
      if (swapContract) {
        const usdRate = await swapContract.dittoUSDRate();
        console.log('usdrate==================');
        console.log(usdRate.toNumber());
        const dittoRemainingInSwap = await swapContract.remainingTokensInActiveSwap();
        console.log('dittoremaining==================');
        console.log(dittoRemainingInSwap.toNumber());
        const dittoRemainingInSwapForUser = await swapContract.remainingTokensForUser(address);
        console.log('dittoremainingforuse==================');
        console.log(dittoRemainingInSwapForUser.toNumber());
        setDittoRemaining(Math.min(dittoRemainingInSwap, dittoRemainingInSwapForUser));
      }

      if (availableTokens) {
        const finalInputTokens = [];
        for (const token of availableTokens) {
          token.balance = ethers.utils.formatUnits(await token.tokenContract.balanceOf(address), token.decimals);
          finalInputTokens.push(token);
        }
        setInputTokens(finalInputTokens);
        setSelectedToken(finalInputTokens[0]);
        setLoading(false);
      }
    };
    loadPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTokens]);


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const calculateOutputAmount = async (inputAmount) => {
    if (inputAmount) {
      const convertedInputAmount = ethers.utils.parseUnits(inputAmount, selectedToken.decimals);
      const output = await swapContract.getDittoOutputAmount(convertedInputAmount, selectedToken.address);
      setDittoOutputAmount(ethers.utils.formatUnits(output, 9));
      setInputTokenAmount(convertedInputAmount);
    } else {
      setDittoOutputAmount(0);
      setInputTokenAmount(0);
    }
  };

  const approveSwap = async () => {
    if (parseFloat(inputTokenAmount) > 0) {
      const amount = ethers.utils.parseUnits(`${inputTokenAmount}.0`, selectedToken.decimals);
      try {
        setSwapState('approvingSwap');
        const approveAllowanceTx = await selectedToken.tokenContract.approve(swapContract.address, amount);
        console.log(approveAllowanceTx.hash);
        await approveAllowanceTx.wait();
        setSwapState('swapApproved');
      } catch (error) {
        console.log(error);
        setSwapState('error');
      }
    }
  };

  const swap = async () => {
    try {
      setSwapState('swapLoading');
      const swapTx = await swapContract.swap(selectedToken.address, inputTokenAmount);
      console.log('sent', swapTx.hash);
      await swapTx.wait();
      setSwapState('swapComplete');
    } catch (error) {
      console.log(error);
      setSwapState('error');
    }

  };

  const swapButtonState = () => {
    switch (swapState) {
      case 'initial':
        return <Button onClick={() => approveSwap()}>Approve Swap</Button>;
      case 'approvingSwap':
        return <Button>Approving Swap</Button>;
      case 'swapApproved':
        return <Button onClick={() => swap()}>Swap for Ditto</Button>;
      case 'swapLoading':
        return <Button>Swapping</Button>;
      case 'swapComplete':
        return <Button>Swap Complete</Button>;
      case 'error':
        return <p>Error occured</p>;
      default:
        return null;
    }
  };



  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <main className={classes.contentContainer}>
        {isOnWrongNetwork ? <Typography>{`Switch to ${NETWORK_NAME} to  proceed with swap for DITTO`}</Typography> : null}
        <form className={classes.formContainer} noValidate autoComplete="off">
          <div className={classes.swapInput}>
            {selectedToken && <Typography variant="caption" className={classes.availableBalanceCaption}>Available balance:{`${selectedToken.balance}`}</Typography>}
            <TextField id="swap-input" label={`${loading ? '' : 'swap'}`} type="number" variant="outlined" InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <Select
                    value={selectedToken}
                    onChange={handleTokenChange}
                    displayEmpty
                    className={classes.selectEmpty}
                    inputProps={{ 'aria-label': 'available tokens' }}
                  >
                    {
                      inputTokens.map((token) => {
                        return (
                          <MenuItem value={token}>{token.symbol}</MenuItem>
                        );
                      })
                    }
                  </Select>
                </InputAdornment>,
              onChange: (e) => {
                calculateOutputAmount(e.target.value);
              },
              inputProps: { min: 0 },
              disabled: loading
            }} />
          </div>
          <div className={classes.recieveInput}>
            {dittoRemaining && <Typography variant="caption" className={classes.availableBalanceCaption}>DITTO remaining:{`${dittoRemaining}`}</Typography>}
            <TextField id="recieve-input" label="recieve" variant="outlined" defaultValue="0" InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  <Typography>DITTO</Typography>
                </InputAdornment>,
              readOnly: true,
              value: dittoOutputAmount,
              disabled: loading
            }} />
          </div>
          {swapButtonState()}
        </form>
      </main>
      <ConnectWallet />
    </Box>
  );
}
