import React from 'react';
import Paper from './Paper';
import { toFixed } from 'utils/big-number';
import { useStats } from 'contexts/stats';

export default function() {
  const { supply } = useStats();

  return (
    <Paper variant="outlined" elevation={0}>
      <div>DITTO SUPPLY</div>
      <div>{toFixed(supply, 1, 2)}</div>
    </Paper>
  );
}
