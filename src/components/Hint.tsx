import React from 'react';
import cn from 'classnames';

import { makeStyles, lighten, alpha } from 'core/styles';

type Props = React.PropsWithChildren<{
  size?: 'small' | 'medium';
  color?: 'error' | 'default';
  renderIcon?: () => React.ReactNode;
  button?: React.ReactNode;
}>;

function Hint(props: Props) {
  const { children, renderIcon, button, size = 'medium', color = 'default' } = props;
  const classes = useStyles();

  const className = cn(classes.root, {
    [classes.isSmall]: size === 'small',
    [classes.isMedium]: size === 'medium',
    [classes.colorDefault]: color === 'default',
    [classes.colorError]: color === 'error',
    [classes.withButton]: button !== undefined,
  });

  return (
    <div className={className}>
      {children}
      {renderIcon && <div className={classes.icon}>{renderIcon()}</div>}
      {button && <div className={classes.button}>{button}</div>}
    </div>
  );
}

export const useStyles = makeStyles(
  theme => {
    return {
      root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        textAlign: 'center',
        transition: theme.transitions.create('background-color'),

        '&$isSmall': {
          padding: theme.spacing(0.5, 1.5),
          minHeight: theme.spacing(4),
        },

        '&$isMedium': {
          padding: theme.spacing(1.5, 3),
          minHeight: theme.spacing(6),
        },

        '&$colorDefault': {
          color: theme.palette.text.secondary,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
        },

        '&$colorError': {
          color: theme.palette.error.dark,
          fontSize: 13,
          backgroundColor: lighten(theme.palette.error.main, 0.9),
        },

        '&$withButton': {
          justifyContent: 'space-between',
          textAlign: 'left',
        },
      },

      icon: {
        marginLeft: 10,
      },

      button: {
        marginLeft: 10,
      },

      isSmall: {},
      isMedium: {},

      colorDefault: {},
      colorError: {},

      withButton: {},
    };
  },
  { name: 'Hint' },
);

export { Hint };
