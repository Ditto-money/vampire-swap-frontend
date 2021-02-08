import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';
import Navigation from 'components/Navigation'

import RebaseCooldownStat from 'components/stats/RebaseCooldownStat';
import PriceStat from 'components/stats/PriceStat';
import SupplyStat from 'components/stats/SupplyStat';
import RebaseStat from 'components/stats/RebaseStat';
import PriceTargetStat from 'components/stats/PriceTargetStat';
import MarketCapStat from 'components/stats/MarketCapStat';

import PriceChart from 'components/charts/PriceChart';
import SupplyChart from 'components/charts/SupplyChart';
import MarketCapChart from 'components/charts/MarketCapChart';

import Rebases from 'components/Rebases';

const useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'grid',
      gap: '10px',
      gridTemplateColumns: '1fr 4fr',
      gridTemplateAreas: `
      'header header'
      'nav    content'
      `,
    },
    headerContainer: {
      gridArea: 'header',
    },
    navContainer: {
      gridArea: 'nav',
      paddingTop: '100px',
    },
    contentContainer: {
      gridArea: 'content',
      paddingTop: '100px',
      margin: '0 10% 0 10%'

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
  const [showSection, setShowSection] = useState('stats')

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} />
      <aside className={classes.navContainer}>
        <Navigation setShowSection={setShowSection} />
      </aside>
      <main className={classes.contentContainer}>
        
        {showSection === 'stats' && 
        <Box className={classes.statsContainer}>
          <RebaseCooldownStat />
          <PriceStat />
          <SupplyStat />
          <RebaseStat />
          <PriceTargetStat />
          <MarketCapStat />
        </Box> 
        }

        {showSection === 'volume' && 
        <Box className={classes.chartsContainer}>
          <PriceChart />
          <SupplyChart />
          <MarketCapChart />
        </Box>
        }

        {showSection === 'rebase' &&
          <Rebases />
        }
        <ConnectWallet />
      </main>
    </Box>
  );
}
