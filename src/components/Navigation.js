import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => {
    return {
        list: {
            listStyleType: 'none',
            paddingLeft: '10px',
            textAlign: 'center',
        },
        item: {
            paddingTop: '20px',
        }
    }
});

export default function Navigation(props) {
    const classes = useStyles();
    return (
        <nav>
            <ul className={classes.list}>
                <li className={classes.item}>
                    <Button color="secondary" onClick={() => props.setShowSection('stats')}>
                        Price and supply statistics
                    </Button>
                </li>
                <li className={classes.item}>
                    <Button color="secondary" onClick={() => props.setShowSection('volume')}>
                        Trading Volume
                    </Button>
                </li>
                <li className={classes.item}>
                    <Button color="secondary" onClick={() => props.setShowSection('rebase')}>
                        Rebase history
                    </Button>
                </li>
            </ul>
        </nav>
    );
}
