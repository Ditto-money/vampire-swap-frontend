import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from 'components/Paper';

const useStyles = makeStyles(theme => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
      padding: 10,

      '& > div:nth-child(1)': {
        height: 50,
        fontSize: 15,
      },

      '& > div:nth-child(2)': {
        fontSize: 22,
        display: 'flex',
        justifyContent: 'flex-end',
      },
    },
  };
});

export default function({ children }) {
  const classes = useStyles();

  return <Paper className={classes.container}>{children}</Paper>;
}
