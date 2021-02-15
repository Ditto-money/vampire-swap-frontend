import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { debounce } from 'lodash';
import {
  NETWORK_NAME
} from 'config';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';
import SwapButton from 'components/SwapButton';
import TokenInputField from 'components/fields/TokenInputField';
import TokenOutputField from 'components/fields/TokenOutputField';


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
      marginTop: 30,
      display: 'flex',
      flexDirection: 'column'
    },
    recieveInput: {
      marginTop: 50,
      display: 'flex',
      flexDirection: 'column'
    },
    availableBalanceCaption: {
      textAlign: 'right'
    },
    swapButton: {
      marginTop: 50,
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
  const [usdDittoRate, setUsdDittoRate] = React.useState(0);


  const { address, availableTokens, swapContract, isOnWrongNetwork } = useWallet();


  useEffect(() => {
    const loadPrices = async () => {
      if (swapContract) {
        const usdRate = await swapContract.dittoUSDRate();
        setUsdDittoRate(ethers.utils.formatUnits(usdRate.toString(), 3));
        console.log(usdDittoRate)
        const dittoRemainingInSwap = await swapContract.remainingTokensInActiveSwap();
        const dittoRemainingInSwapForUser = await swapContract.remainingTokensForUser(address);
        setDittoRemaining(
          Math.min(
            ethers.utils.formatUnits(dittoRemainingInSwap.toString(), 9),
            ethers.utils.formatUnits(dittoRemainingInSwapForUser.toString(), 9)
          )
        );
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
    if (swapState === 'approvingSwap' || 'swapApproved') {
      setSwapState('initial');
    }
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

  const handleInputAmount = debounce((inputAmount) => calculateOutputAmount(inputAmount), 500);

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

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <main className={classes.contentContainer}>
        {isOnWrongNetwork ? <Typography>{`Switch to ${NETWORK_NAME} to  proceed with swap for DITTO`}</Typography> : null}
        <form className={classes.formContainer} noValidate autoComplete="off">
          <div className={classes.swapInput}>
            {selectedToken && <Typography variant="caption" className={classes.availableBalanceCaption}>Available balance:{`${selectedToken.balance}`}</Typography>}
            <TokenInputField loading={loading} selectedToken={selectedToken} handleTokenChange={handleTokenChange} inputTokens={inputTokens} handleInputAmount={handleInputAmount} swapState={swapState} />
          </div>
          <ArrowDownwardIcon color="secondary" style={{ marginTop: 30, fontSize: 50 }} />
          <div className={classes.recieveInput}>
            {dittoRemaining && <Typography variant="caption" className={classes.availableBalanceCaption}>DITTO remaining:{`${dittoRemaining}`}</Typography>}
            <TokenOutputField loading={loading} dittoOutputAmount={dittoOutputAmount} />
          </div>
          <div className={classes.swapButton}>
            <SwapButton swapState={swapState} approveSwap={approveSwap} swap={swap} />
          </div>
        </form>
      </main>
      <ConnectWallet />
    </Box>
  );
}
