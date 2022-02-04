import React from 'react';

import { makeStyles } from 'core/styles';

export function AnimatedDots() {
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <span>&nbsp;.</span>
      <span>&nbsp;.</span>
      <span>&nbsp;.</span>
    </span>
  );
}

const useStyles = makeStyles(
  () => ({
    root: {
      '& span': {
        animation: '1.8s ease-in-out .5s infinite both $pulse',
        '&:nth-child(2)': {
          animationDelay: '.8s',
        },
        '&:nth-child(3)': {
          animationDelay: '1s',
        },
      },
    },

    '@keyframes pulse': {
      '0%': {
        opacity: 0,
      },
      '20%': {
        opacity: 1,
      },
      '100%': {
        opacity: 0,
      },
    },
  }),
  { name: 'AnimatedDots' },
);
