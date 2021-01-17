import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import ChartsController from './ChartsController';
import ChartsTooltip from './ChartsTooltip';
import Loader from 'components/Loader';
import { SECONDARY_COLOR } from 'config';
import { toFixed } from 'utils/big-number';
import { useStats } from 'contexts/stats';

const noop = x => x;

const useStyles = makeStyles(theme => ({
  chartContainer: {
    width: '100%',
    height: 400,
  },
  title: {},
}));

export default ({ data, title, yAxisLabelFormatter = noop }) => {
  const classes = useStyles();
  const { activeType } = useStats();

  const yAxisTickFormatter = val => {
    return activeType === '%'
      ? toFixed(val, 1, 2) + '%'
      : yAxisLabelFormatter(toFixed(val, 1, 2));
  };

  return (
    <Box mt={6} mb={2}>
      <Box className={classes.title}>{title}</Box>

      <Box my={2}>
        <ChartsController />
      </Box>

      {!data ? (
        <Loader />
      ) : (
        <div className={classes.chartContainer}>
          <ResponsiveContainer>
            <AreaChart
              data={data.xy}
              margin={{
                top: 50,
                right: 50,
                left: 50,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis
                tickFormatter={yAxisTickFormatter}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip
                content={<ChartsTooltip {...{ yAxisTickFormatter }} />}
              />
              <Area
                type="monotone"
                stackOffset="expand"
                dataKey="y"
                stroke={SECONDARY_COLOR}
                fill={SECONDARY_COLOR}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Box>
  );
};
