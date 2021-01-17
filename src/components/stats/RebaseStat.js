import React from 'react';
import { Button } from '@material-ui/core';
import Paper from './Paper';
import { useStats } from 'contexts/stats';
import { useWallet } from 'contexts/wallet';
import { useNotifications } from 'contexts/notifications';

export default function() {
  const [isRebasing, setIsRebasing] = React.useState(false);
  const { cooldownExpired } = useStats();
  const { address, startConnecting, controllerContract } = useWallet();
  const { showTxNotification, showErrorNotification } = useNotifications();

  const connectOrRebase = async () => {
    if (!address) return startConnecting();

    try {
      setIsRebasing(true);
      const tx = await controllerContract.rebase();
      showTxNotification('Rebasing', tx.hash);
      await tx.wait();
      showTxNotification('Rebased', tx.hash);
    } catch (e) {
      showErrorNotification(e);
    } finally {
      setIsRebasing(false);
    }
  };

  return (
    <Paper variant="outlined" elevation={0}>
      <div></div>
      <div>
        <Button
          variant="contained"
          color="secondary"
          disabled={!cooldownExpired || isRebasing}
          onClick={connectOrRebase}
        >
          {isRebasing ? 'REBASING...' : 'REBASE'}
        </Button>
      </div>
    </Paper>
  );
}
