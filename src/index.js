import './styles';

import React from 'react';
import { render } from 'react-dom';
import {
  ThemeProvider as MuiThemeProvider,
  makeStyles,
} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import { ThemeProvider, useTheme, useMuiTheme } from 'contexts/theme';
import { WalletProvider } from 'contexts/wallet';
import { NotificationsProvider } from 'contexts/notifications';
import { StatsProvider } from 'contexts/stats';
// import { SwapProvider } from 'contexts/swap'
import Notification from 'components/Notification';
import * as serviceWorker from 'serviceWorker';

import App from 'pages/App';

const useStyles = makeStyles(theme => ({
  snackbar: {
    top: 70,
  },
}));

(async () => {
  document.documentElement.classList.remove('boot-loader');
  document.getElementById('loader-container').remove();
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  render(
    <ThemeProvider>
      <Shell />
    </ThemeProvider>,
    document.getElementById('root')
  );
})();

function Shell() {
  const classes = useStyles();
  const { isDark } = useTheme();
  const muiTheme = useMuiTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains(isDark ? 'light' : 'dark')) {
      root.classList.remove(isDark ? 'light' : 'dark');
      root.classList.add(isDark ? 'dark' : 'light');
    }
  }, [isDark]);

  return (
    <Router>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <SnackbarProvider
          classes={{ root: classes.snackbar }}
          maxSnack={4}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          content={(key, data) => (
            <div>
              <Notification id={key} notification={data} />
            </div>
          )}
        >
          <NotificationsProvider>
            <WalletProvider>
              {/* <StatsProvider> */}
              {/* <SwapProvider> */}
                <App />
              {/* </SwapProvider> */}
              {/* </StatsProvider> */}
            </WalletProvider>
          </NotificationsProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </Router>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
