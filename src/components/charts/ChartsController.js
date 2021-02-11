import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Paper from 'components/Paper';

import { BORDER_RADIUS, TYPES_ARRAY, DURATIONS_ARRAY } from 'config';
import { useStats } from 'contexts/stats';

const useStyles = makeStyles(theme => {
  const color = theme.palette.borderColor;
  return {
    buttonsContainer: {
      display: 'flex',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center'
      },
    },
    typesButtonsContainer: {
      marginLeft: '16px',
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        marginTop: '5px'
      },
    },
    container: {
      display: 'flex',
      border: `1px solid ${color}`,
      borderRadius: BORDER_RADIUS,
    },
    item: {
      fontSize: 13,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 30,
      cursor: 'pointer',
      '&:first-child': {
        borderTopLeftRadius: BORDER_RADIUS,
        borderBottomLeftRadius: BORDER_RADIUS,
      },
      '&:last-child': {
        borderTopRightRadius: BORDER_RADIUS,
        borderBottomRightRadius: BORDER_RADIUS,
      },
      '&:not(:last-child)': {
        borderRight: `1px solid ${color}`,
      },
    },
    activeItem: {
      background: color,
    },
  };
});

export default function() {
  const classes = useStyles();
  const {
    activeDuration,
    activeType,
    setActiveDuration,
    setActiveType,
  } = useStats();

  return (
    <div className={classes.buttonsContainer}>
      <Box>
        <Paper className={classes.container}>
          {DURATIONS_ARRAY.map(([duration, name]) => (
            <div
              key={duration}
              className={clsx(classes.item, {
                [classes.activeItem]: activeDuration === duration,
              })}
              onClick={() => setActiveDuration(duration)}
            >
              {name}
            </div>
          ))}
        </Paper>
      </Box>
      <Box className={classes.typesButtonsContainer}>
        <Paper className={classes.container}>
          {TYPES_ARRAY.map(([type, name]) => (
            <div
              key={type}
              className={clsx(classes.item, {
                [classes.activeItem]: activeType === type,
              })}
              onClick={() => setActiveType(type)}
            >
              {name}
            </div>
          ))}
        </Paper>
      </Box>
    </div>
  );
}
