import React from 'react';
import Chart from './Chart';
import { useStats } from 'contexts/stats';

export default () => {
  const { priceChartData: data } = useStats();
  return (
    <Chart {...{ data }} yAxisLabelFormatter={y => `$${y}`} title={'PRICE'} />
  );
};
