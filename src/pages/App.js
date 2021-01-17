import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';

import RebaseCooldownStat from 'components/stats/RebaseCooldownStat';
import PriceStat from 'components/stats/PriceStat';
import SupplyStat from 'components/stats/SupplyStat';
import RebaseStat from 'components/stats/RebaseStat';
import PriceTargetStat from 'components/stats/PriceTargetStat';
import MarketCapStat from 'components/stats/MarketCapStat';

import PriceChart from 'components/charts/PriceChart';
import SupplyChart from 'components/charts/SupplyChart';
import MarketCapChart from 'components/charts/MarketCapChart';

const useStyles = makeStyles(theme => {
  return {
    container: {
      width: '960px',
      margin: '0 auto',
      padding: '100px 0 30px',
      position: 'relative',
      [theme.breakpoints.down('sm')]: {
        padding: '70px 0 10px',
        width: 'auto',
      },
    },
    statsContainer: {
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gridTemplateColumns: '1fr 1fr 1fr',
      rowGap: '16px',
      columnGap: '16px',
    },
    chartsContainer: {},
  };
});

export default function App() {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Header />

      <Box className={classes.statsContainer}>
        <RebaseCooldownStat />
        <PriceStat />
        <SupplyStat />
        <RebaseStat />
        <PriceTargetStat />
        <MarketCapStat />
      </Box>

      <Box className={classes.chartsContainer}>
        <PriceChart />
        <SupplyChart />
        <MarketCapChart />
      </Box>

      <ConnectWallet />
    </Box>
  );
}
