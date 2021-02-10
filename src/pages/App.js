import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';

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
    },
    statsContainer: {
    },
    chartsContainer: {},
  };
});

export default function App() {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <main className={classes.contentContainer}>
        <p>Content</p>
      </main>

      <ConnectWallet />
    </Box>
  );
}
