import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@material-ui/core';


import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';

import { useWallet } from 'contexts/wallet';
import { Big, isZero } from 'utils/big-number';
import { ethers } from 'ethers';




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
      marginTop: 50
    },
    recieveInput: {
      marginTop: 100
    },
  };
});

export default function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [tokenBalance, setTokenBalance] = React.useState(0)
  const { tokenContract, address } = useWallet();



  useEffect(() => {
    const load = async () => {
      if (address) {
        const [balance] = await Promise.all([
          tokenContract.balanceOf(address),
        ]);
        setTokenBalance(ethers.utils.formatUnits(balance, 9))
      }
    }
    load();
  }, [address])

  console.log(tokenBalance)


  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <main className={classes.contentContainer}>
        <form className={classes.formContainer} noValidate autoComplete="off">
          <div className={classes.swapInput}>
            <TextField id="swap-input" label="swap" variant="outlined" />
          </div>
          <div className={classes.recieveInput}>
            <TextField id="recieve-input" label="recieve" variant="outlined" />
          </div>
        </form>
      </main>
      <ConnectWallet />
    </Box>
  );
}
