import React from 'react';
import cn from 'classnames';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { IconButton, IconButtonProps } from 'components';
import { makeStyles } from 'core/styles';

export function ArrowButton(
  props: IconButtonProps & {
    direction: 'left' | 'right';
  },
) {
  const { className, direction, disabled, size = 'small', ...rest } = props;
  const classes = useStyles();

  return (
    <IconButton
      {...rest}
      className={cn(classes.iconButton, className)}
      size={size}
      disabled={disabled}
      color="inherit"
    >
      <NavigateBeforeIcon
        color="inherit"
        className={cn({
          [classes.arrowRight]: direction === 'right',
        })}
        fontSize="inherit"
      />
    </IconButton>
  );
}

const useStyles = makeStyles(
  theme => ({
    iconButton: {
      position: 'relative',
      width: 23,
      height: 23,
      fontSize: 23,
      marginRight: 5,

      opacity: 0.8,
      transition: theme.transitions.create('opacity'),

      [theme.breakpoints.up('md')]: {
        width: 30,
        height: 30,
        fontSize: 30,
        marginRight: 7,
      },

      '&:hover': {
        opacity: 1,
      },

      '&.Mui-disabled': {
        color: 'inherit',
        opacity: 0.4,
      },
    },
    arrowRight: {
      transform: 'rotate(180deg)',
    },
  }),
  { name: 'GlobalTxStatusTabTitle' },
);
