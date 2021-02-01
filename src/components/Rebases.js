import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { toFixed } from 'utils/big-number';
import * as request from 'utils/request';
import { IS_TESTNET } from 'config';

const COUNT = 5;

const useStyles = makeStyles(theme => ({
  title: {},
}));

export default () => {
  const classes = useStyles();
  const [rebases, setRebases] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [page, setPage] = React.useState(1);

  const pages = Math.ceil(totalCount / COUNT);

  React.useEffect(() => {
    let isMounted = true;
    const unsubs = [() => (isMounted = false)];

    const load = async () => {
      const { totalRebases, rebases } = await request.api('/rebases', {
        page: page - 1,
        count: COUNT,
      });
      if (isMounted) {
        setTotalCount(totalRebases);
        setRebases(rebases);
      }
    };

    load();
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [page]);

  return (
    <Box mt={6} mb={2}>
      <Box className={classes.title}>REBASES</Box>

      <Box>
        <Table aria-label="Rebases">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Supply Adjustment %</TableCell>
              <TableCell>Supply Before Rebase</TableCell>
              <TableCell>Supply After Rebase</TableCell>
              <TableCell align="right">Block</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rebases.map(rebase => (
              <TableRow key={rebase.timestamp}>
                <TableCell component="th" scope="row">
                  {moment
                    .unix(rebase.timestamp)
                    .local()
                    .format('YYYY-MM-DD HH:mm')}
                </TableCell>
                <TableCell>
                  {toFixed(rebase.supplyAdjustmentPercent, 1, 2)}%
                </TableCell>
                <TableCell>
                  {toFixed(rebase.supplyBeforeRebase, 1, 2)}
                </TableCell>
                <TableCell>{toFixed(rebase.supplyAfterRebase, 1, 2)}</TableCell>
                <TableCell align="right">
                  <Link
                    href={`https://${
                      IS_TESTNET ? 'testnet.' : ''
                    }bscscan.com/block/${rebase.blockNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.small}
                  >
                    {rebase.blockNumber}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box mt={2}>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={pages}
          page={page}
          onChange={(event, page) => setPage(page)}
        />
      </Box>
    </Box>
  );
};
