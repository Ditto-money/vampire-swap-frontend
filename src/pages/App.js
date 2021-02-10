import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

import Header from 'components/Header';
import ConnectWallet from 'components/ConnectWallet';

const useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'grid',
      gap: '10px',
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        gridTemplateAreas: `
        'header'
        'content'
        `
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 4fr',
        gridTemplateAreas: `
        'header header'
        'nav    content'
        `,
      },
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
      margin: '0 10% 0 10%',
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
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box className={classes.container}>
      <Header className={classes.headerContainer} drawerToggle={handleDrawerToggle} />
      <aside className={classes.navContainer}>
        </aside>
        <main className={classes.contentContainer}>
      </main>
      <ConnectWallet />
    </Box>
  );
}
