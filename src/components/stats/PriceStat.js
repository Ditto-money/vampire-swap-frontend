import React from 'react';
import { Tooltip } from '@material-ui/core';
import Paper from './Paper';
import { toFixed } from 'utils/big-number';
import { useStats } from 'contexts/stats';

export default function() {
  const { price } = useStats();

  return (
    <Tooltip
      title={
        'Oracle price is the average price of DITTO since the previous rebase.'
      }
      placement={'top'}
    >
      <div>
        <Paper variant="outlined" elevation={0}>
          <div>ORACLE PRICE</div>
          <div>${toFixed(price, 1, 2)}</div>
        </Paper>
      </div>
    </Tooltip>
  );
}
