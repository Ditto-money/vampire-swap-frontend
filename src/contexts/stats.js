import React from 'react';
import moment from 'moment';

import { Big, isZero } from 'utils/big-number';
import { useWallet } from 'contexts/wallet';
import * as request from 'utils/request';
import { TYPES_ARRAY, DURATIONS_ARRAY } from 'config';

const StatsContext = React.createContext(null);

export function StatsProvider({ children }) {
  const [activeDuration, setActiveDuration] = React.useState(
    DURATIONS_ARRAY[0][0]
  );
  const [activeType, setActiveType] = React.useState(TYPES_ARRAY[0][0]);
  const [supply, setSupply] = React.useState(Big(0));
  const [price, setPrice] = React.useState(Big(0));
  const [cooldownExpiryTimestamp, setCooldownExpiryTimestamp] = React.useState(
    Big(0)
  );
  const [chartData, setChartData] = React.useState({});

  const { controllerContract, oracleContract } = useWallet();

  const mktCap = React.useMemo(() => {
    return supply.mul(price);
  }, [supply, price]);

  const cooldownExpired = React.useMemo(() => {
    return isZero(cooldownExpiryTimestamp)
      ? false
      : moment.unix(cooldownExpiryTimestamp).isBefore(moment.utc());
  }, [cooldownExpiryTimestamp]);

  const priceChartData = React.useMemo(
    () =>
      getChartData({
        chartData,
        activeDuration,
        activeType,
        map: ({ x, p }) => ({ x, p }),
      }),
    [chartData, activeDuration, activeType]
  );

  const supplyChartData = React.useMemo(
    () =>
      getChartData({
        chartData,
        activeDuration,
        activeType,
        map: ({ x, s: p }) => ({ x, p }),
      }),
    [chartData, activeDuration, activeType]
  );

  const mktCapChartData = React.useMemo(
    () =>
      getChartData({
        chartData,
        activeDuration,
        activeType,
        map: ({ x, s, p }) => {
          const y = s.map((a, i) => parseFloat(a) + parseFloat(p[i]));
          return { x, p: y };
        },
      }),
    [chartData, activeDuration, activeType]
  );

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const [price, cooldownExpiryTimestamp] = await Promise.all([
        oracleContract.getData(),
        controllerContract.cooldownExpiryTimestamp(),
      ]);
      if (isMounted) {
        setPrice(Big(price).div(1e18));
        setCooldownExpiryTimestamp(Big(cooldownExpiryTimestamp));
      }
    })();

    return () => (isMounted = false);
  }, [oracleContract, controllerContract]);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const [{ totalSupply }, chartData] = await Promise.all([
        request.api('/total-supply'),
        request.api('/'),
      ]);
      // const [{ totalSupply }, chartData] = await Promise.all([
      //   Promise.resolve({ totalSupply: '100' }),
      //   import('api-sample-data.json'),
      // ]);
      if (isMounted) {
        setSupply(Big(totalSupply).div(Big(1e9)));
        setChartData(chartData);
      }
    })();
    return () => (isMounted = false);
  }, []);

  return (
    <StatsContext.Provider
      value={{
        supply,
        price,
        mktCap,
        cooldownExpiryTimestamp,
        cooldownExpired,
        priceChartData,
        supplyChartData,
        mktCapChartData,

        activeDuration,
        setActiveDuration,
        activeType,
        setActiveType,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = React.useContext(StatsContext);
  if (!context) {
    throw new Error('Missing stats context');
  }
  const {
    supply,
    price,
    mktCap,
    cooldownExpiryTimestamp,
    cooldownExpired,
    priceChartData,
    supplyChartData,
    mktCapChartData,

    activeDuration,
    setActiveDuration,
    activeType,
    setActiveType,
  } = context;
  return {
    supply,
    price,
    mktCap,
    cooldownExpiryTimestamp,
    cooldownExpired,
    priceChartData,
    supplyChartData,
    mktCapChartData,

    activeDuration,
    setActiveDuration,
    activeType,
    setActiveType,
  };
}

const getChartData = ({ chartData, activeDuration, activeType, map }) => {
  const data = chartData[activeDuration];
  if (!data) return;

  const { x, p } = map(data);
  let y;
  if (activeType === '%') {
    y = [0];
    for (let i = 1; i < p.length; i++) {
      const a = parseFloat(p[i]);
      const b = parseFloat(p[i - 1]);
      y.push(!a ? 0 : (1e2 * (a - b)) / a);
    }
  } else {
    y = p.map(py => parseFloat(py));
  }
  return {
    x,
    y,
    xy: x.map((px, i) => ({ x: px, y: y[i] })),
  };
};
