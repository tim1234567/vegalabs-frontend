import React from 'react';
import cn from 'classnames';
import type { IconButtonProps } from '@mui/material';
import { SettingsButtonIcon } from 'components/icons/SettingsButtonIcon';

import { IconButton } from 'components';
import { makeStyles } from 'core/styles';

export function SettingsButton(props: IconButtonProps) {
  const classes = useStyles();

  return (
    <IconButton {...props} className={cn(classes.root, props.className)}>
      <SettingsButtonIcon fontSize="inherit" />
    </IconButton>
  );
}

const useStyles = makeStyles(
  () => ({
    root: {
      padding: 0,
      fontSize: 36,

      '&:hover:after': {
        content: "''",
        position: 'absolute',
        borderRadius: '50%',
        top: 1,
        left: 1,
        bottom: 1,
        right: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
  }),
  { name: 'SettingsButton' },
);
