import React from 'react';
import { Paper } from '@material-ui/core';
import { useTheme } from 'contexts/theme';

export default ({ className, children }) => {
  const { isDark } = useTheme();
  return (
    <Paper
      {...{ className }}
      {...(isDark ? {} : { variant: 'outlined' })}
      elevation={0}
    >
      {children}
    </Paper>
  );
};
