import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { BORDER_RADIUS, SECONDARY_COLOR } from 'config';
import cache from 'utils/cache';

const ThemeContext = React.createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState(cache('theme') || 'dark');

  const toggleTheme = () => {
    setTheme(theme => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      cache('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('Missing theme context');
  }
  const { theme, toggleTheme } = context;
  return {
    theme,
    toggleTheme,
    ...getProps(theme),
  };
}

export function useMuiTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('Missing theme context');
  }

  const { theme } = context;
  const { isDark } = getProps(theme);

  return createMuiTheme({
    typography: {
      fontFamily: '"Rubik", sans-serif',
    },
    palette: {
      isDark,
      type: isDark ? 'dark' : 'light',
      borderColor: isDark ? '#555' : '#eee',
      background: {
        // default: '',
        // paper: '',
      },
      primary: {
        main: isDark ? '#ffffff' : '#373836',
      },
      secondary: {
        main: SECONDARY_COLOR,
      },
    },
    overrides: {
      MuiButton: {
        root: {
          borderRadius: BORDER_RADIUS,
        },
      },
      MuiPaper: {
        root: {
          borderRadius: BORDER_RADIUS,
        },
      },
      MuiDialog: {
        paper: {
          borderRadius: BORDER_RADIUS,
        },
      },
    },
  });
}

function getProps(theme) {
  const isDark = theme === 'dark';
  const secondaryColor = isDark ? 'rgb(53, 197, 243)' : '#007cc3';
  return { isDark, secondaryColor };
}
