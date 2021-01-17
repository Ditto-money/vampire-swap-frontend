import React from 'react';
import Paper from './Paper';
import { toFixed } from 'utils/big-number';
import { useStats } from 'contexts/stats';

export default function() {
  const { mktCap } = useStats();

  return (
    <Paper variant="outlined" elevation={0}>
      <div>DITTO MARKET CAP</div>
      <div>${toFixed(mktCap, 1, 2)}</div>
    </Paper>
  );
}
