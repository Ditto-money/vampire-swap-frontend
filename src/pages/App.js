import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { debounce } from 'lodash';
import {
  NETWORK_NAME
} from 'config';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

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
      flexDirection: 'column',
      width: 350
    },
    recieveInput: {
      marginTop: 40,
      display: 'flex',
      flexDirection: 'column',
      width: 350

    },
    availableBalanceCaption: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginBottom: 5
    },
    swapButton: {
      marginTop: 50,
    },
    dittoLeft: {
      alignSelf: 'self-end',
      marginLeft: '30%',
      marginTop: 30,
      display: 'flex',
      alignItems: 'center'
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
  const [totalDittoRemaining, setTotalDittoRemaining] = React.useState();
  const [dittoRemainingForUser, setDittoRemainingForUser] = React.useState();
  const [swapState, setSwapState] = React.useState('amountIsZero');
  const [error, setError] = React.useState(null);
  const [inputTokenAmount, setInputTokenAmount] = React.useState(0);
  const [usdDittoRate, setUsdDittoRate] = React.useState(0);
  const [approvedAllowanceAmount, setApprovedAllowanceAmount] = React.useState(0);


  const { address, availableTokens, swapContract, isOnWrongNetwork } = useWallet();


  useEffect(() => {
    const loadPrices = async () => {
      if (swapContract) {
        const usdRate = await swapContract.dittoUSDRate();
        setUsdDittoRate(ethers.utils.formatUnits(usdRate.toString(), 3));
        console.log(usdDittoRate);
        const dittoRemainingInSwap = await swapContract.remainingTokensInActiveSwap();
        const dittoRemainingInSwapForUser = await swapContract.remainingTokensForUser(address);
        setTotalDittoRemaining(ethers.utils.formatUnits(dittoRemainingInSwap.toString(), 9));
        setDittoRemainingForUser(ethers.utils.formatUnits(dittoRemainingInSwapForUser.toString(), 9));
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

  useEffect(() => {
    const checkAllowance = async () => {
      if (selectedToken) {
        const formattedInputTokenAmount = ethers.utils.formatUnits(inputTokenAmount, selectedToken.decimals);
        const approvedAllowance = ethers.utils.formatUnits(await selectedToken.tokenContract.allowance(address, swapContract.address), selectedToken.decimals);
        setApprovedAllowanceAmount(approvedAllowance);

        if (parseFloat(formattedInputTokenAmount) <= 0) {
          setSwapState('amountIsZero');
        } else if (!(parseFloat(approvedAllowance) <= parseFloat(formattedInputTokenAmount))) {
          setSwapState('swapApproved');
        } else {
          setSwapState('initial');
        }
      }
    };
    checkAllowance();

  }, [selectedToken, address, swapContract, inputTokenAmount, swapState]);


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
    calculateOutputAmount(ethers.utils.formatUnits(inputTokenAmount, selectedToken.decimals), event.target.value);
    setError(null);
  };

  const calculateOutputAmount = async (inputAmount, token) => {
    if (inputAmount > 0) {
      const convertedInputAmount = ethers.utils.parseUnits(inputAmount, token.decimals);
      const output = await swapContract.getDittoOutputAmount(convertedInputAmount, token.address);
      setDittoOutputAmount(ethers.utils.formatUnits(output, 9));
      setInputTokenAmount(convertedInputAmount);
      setError(null);
    } else {
      setDittoOutputAmount(0);
      setInputTokenAmount(0);
      setError(null);
    }
  };

  const handleInputAmount = debounce((inputAmount) => calculateOutputAmount(inputAmount, selectedToken), 500);

  const approveSwap = async () => {
    const formattedInputTokenAmount = ethers.utils.formatUnits(inputTokenAmount, selectedToken.decimals);
    if (parseFloat(formattedInputTokenAmount) > 0) {
      // const amountApproved = ethers.utils.parseUnits(`${ethers.utils.formatUnits(inputTokenAmount, selectedToken.decimals)}.0`, selectedToken.decimals);
      // approve more to avoid approval fees in the future
      const amountToApprove = ethers.utils.parseUnits(`${10000000000}.0`, selectedToken.decimals);

      try {
        setSwapState('approvingSwap');
        if (approvedAllowanceAmount < parseFloat(formattedInputTokenAmount)) {
          const approveAllowanceTx = await selectedToken.tokenContract.approve(swapContract.address, amountToApprove);
          await approveAllowanceTx.wait();
        } 
        setSwapState('swapApproved');
      } catch (error) {
        console.log(error);
        setError('Unable to complete transaction, please try again. :)');

      }
    }
  };

  const swap = async () => {
    try {
      setSwapState('swapLoading');
      const swapTx = await swapContract.swap(selectedToken.address, inputTokenAmount);
      await swapTx.wait();
      setSwapState('swapComplete');
    } catch (error) {
      console.log(error);
      setError('Unable to complete transaction, please try again. :)');
    }

  };

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <main className={classes.contentContainer}>
        {isOnWrongNetwork ? <Typography>{`Switch to ${NETWORK_NAME} to  proceed with swap for DITTO`}</Typography> : null}
        <form className={classes.formContainer} noValidate autoComplete="off">
          <div className={classes.swapInput}>
            {selectedToken &&
              <div className={classes.availableBalanceCaption}>
              <Tooltip title="Your balance of the selected input tokens." aria-label="Your balance of the selected input tokens." placement="top" interactive>
                <InfoIcon color="secondary" style={{ fontSize: 20, paddingRight: 5 }} />
              </Tooltip>
              <Typography variant="caption" >
                Available balance:&nbsp;&nbsp;{`${selectedToken.balance}`}
              </Typography>
              </div>
            }
            <TokenInputField loading={loading} selectedToken={selectedToken} handleTokenChange={handleTokenChange} inputTokenAmount={inputTokenAmount} inputTokens={inputTokens} handleInputAmount={handleInputAmount} swapState={swapState} />
          </div>
          <ArrowDownwardIcon color="secondary" style={{ marginTop: 30, fontSize: 50 }} />
          <div className={classes.recieveInput}>
            {dittoRemainingForUser &&
            <div className={classes.availableBalanceCaption}>
              <Tooltip title="Amount of DITTO you can still receive in this swap until the per user cap is reached." aria-label="Amount of DITTO you can still receive in this swap until the per user cap is reached." placement="top" interactive>
                  <InfoIcon color="secondary" style={{ fontSize: 20, paddingRight: 5 }} />
              </Tooltip>
              <Typography variant="caption" >
                DITTO remaining for user:&nbsp;&nbsp;{`${dittoRemainingForUser}`}
              </Typography>
            </div>
            }

            <TokenOutputField loading={loading} dittoOutputAmount={dittoOutputAmount} />
          </div>
          <div className={classes.swapButton}>
            <SwapButton swapState={swapState} approveSwap={approveSwap} swap={swap} dittoOutputAmount={dittoOutputAmount} error={error} setError={setError} />
          </div>
        </form>
        <div className={classes.dittoLeft}>
          <Typography variant="caption">Total DITTO left: {totalDittoRemaining} </Typography>
          <Tooltip title="Total amount of DITTO still available for the incentivized swaps. DITTO is allocated on a first-come, first serve basis." aria-label="Total amount of DITTO still available for the incentivized swaps. DITTO is allocated on a first-come, first serve basis." placement="bottom" interactive>
            <InfoIcon color="secondary" style={{ fontSize: 20, paddingLeft: 5 }} />
          </Tooltip>
        </div>
      </main>
      <ConnectWallet />
    </Box>
  );
}
