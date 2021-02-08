import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

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
    const list = (
        <ul className={classes.list}>
            <li className={classes.item}>
                <Button color="secondary" href="#stats">
                    Price and supply statistics
                </Button>
            </li>
            <li className={classes.item}>
                <Button color="secondary" href="#volume" >
                    Trading Volume
                </Button>
            </li>
            <li className={classes.item}>
                <Button color="secondary" href="#rebase">
                    Rebase history
                </Button>
            </li>
        </ul>
    )
    return (
        <>
            <Hidden smDown>
                <nav>
                    {list}
                </nav>
            </Hidden>
            <Hidden mdUp>
                <React.Fragment key='left'>
                    <Drawer anchor='left' open={props.drawer} onClose={props.setDrawer}>
                        <nav onClick={props.setDrawer} onKeyDown={props.setDrawer}>
                            {list}
                        </nav>
                    </Drawer>
                </React.Fragment>
            </Hidden>
        </>
    );
}
