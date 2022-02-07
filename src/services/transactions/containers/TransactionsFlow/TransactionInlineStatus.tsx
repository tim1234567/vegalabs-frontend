import React from 'react';

import { AnimatedDots, Typography, CircularProgress } from 'components';
import { makeStyles } from 'core/styles';

export function TransactionWaitSigning() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color="inherit" size={80} thickness={3} />
      <Typography
        sx={{ lineHeight: 1.25, marginTop: '30px', textAlign: 'center', fontSize: '16px' }}
      >
        <span>Your transaction is being executed</span>
        <AnimatedDots />
      </Typography>
      <Typography textAlign="center">Sign the transaction in your wallet</Typography>
    </div>
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      height: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

      [theme.breakpoints.up('md')]: {
        padding: '0 10px 20px',
      },
    },
  }),
  { name: 'TransactionWaitSigning' },
);
