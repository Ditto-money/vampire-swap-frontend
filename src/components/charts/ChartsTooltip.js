import React from 'react';

export default ({ active, payload, yAxisTickFormatter }) => {
  if (active && payload) {
    return <div>{yAxisTickFormatter(payload[0].value)}</div>;
  }

  return null;
};
