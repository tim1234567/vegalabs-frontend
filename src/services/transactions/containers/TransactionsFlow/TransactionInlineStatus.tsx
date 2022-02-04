import React from 'react';

import { AnimatedDots, Typography, CircularProgress, Grid } from 'components';
import { makeStyles } from 'core/styles';
import { WaitingIcon } from 'components/icons/WaitingIcon';

export function TransactionWaitSigning() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color="inherit" size={80} thickness={3} />
      <Typography className={classes.textContainer}>
        <span className={classes.text}>Your transaction is being executed</span>
        <AnimatedDots />
      </Typography>
      <Grid container spacing={1}>
        <Grid item>
          <WaitingIcon className={classes.icon} />
        </Grid>
        <Grid item>
          <Typography>Sign the transaction in your wallet</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

      [theme.breakpoints.up('md')]: {
        padding: '0 10px 20px',
      },
    },
    textContainer: {
      lineHeight: 1.25,
      marginBottom: 39,
      textAlign: 'center',
      fontSize: 12,

      [theme.breakpoints.up('md')]: {
        fontSize: 16,
      },
    },
    icon: {
      fontSize: 16,
    },
    text: {
      display: 'inline-block',
      padding: 0,
    },
  }),
  { name: 'TransactionWaitSigning' },
);
