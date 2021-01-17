import React from 'react';
import moment from 'moment';
import Paper from './Paper';
import { Big, isZero } from 'utils/big-number';
import { useStats } from 'contexts/stats';

export default function() {
  const [duration, setDuration] = React.useState('0d:0h:0m:0s');
  const { cooldownExpiryTimestamp, cooldownExpired } = useStats();

  React.useEffect(() => {
    let id = setInterval(() => {
      if (cooldownExpired || isZero(cooldownExpiryTimestamp)) {
        setDuration('0d:0h:0m:0s');
        clearInterval(id);
        id = null;
        return;
      }
      const now = Big(moment.utc().unix());
      const ms = cooldownExpiryTimestamp.sub(now);
      setDuration(toHumanizedDuration(ms));
    }, 1000);
    return () => {
      if (id) clearInterval(id);
    };
  }, [cooldownExpiryTimestamp, cooldownExpired]);

  return (
    <Paper variant="outlined" elevation={0}>
      <div>REBASE COOLDOWN</div>
      <div>{duration}</div>
    </Paper>
  );
}

function toHumanizedDuration(ms) {
  const dur = {};
  const units = [
    { label: 's', mod: 60 },
    { label: 'm', mod: 60 },
    { label: 'h', mod: 24 },
    { label: 'd', mod: 31 },
    // {label: "w", mod: 7},
  ];
  units.forEach(u => {
    const z = (dur[u.label] = ms.mod(u.mod));
    ms = ms.sub(z).div(u.mod);
  });
  return units
    .reverse()
    .filter(u => {
      return u.label !== 'ms'; // && dur[u.label]
    })
    .map(u => {
      let val = dur[u.label];
      if (u.label === 'm' || u.label === 's') {
        val = val.toString().padStart(2, '0');
      }
      return val + u.label;
    })
    .join(':');
}
