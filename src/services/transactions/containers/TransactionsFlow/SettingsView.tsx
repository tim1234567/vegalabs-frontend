import React from 'react';

import { AngleArrow } from 'components/icons/AngleArrow';
import { SettingsButtonIcon } from 'components/icons/SettingsButtonIcon';
import { Grid, IconButton, Typography } from 'components';
import { makeStyles } from 'core/styles';

import { TransactionSettings, TransactionSettingsProps } from '../TransactionSettings';

type Props = TransactionSettingsProps & {
  onBack: () => void;
};

export function SettingsView({ network, settings, onBack }: Props) {
  const classes = useStyles();

  return (
    <Grid container spacing={3} justifyContent="space-between" alignItems="center">
      <Grid item>
        <IconButton onClick={onBack} className={classes.backButton}>
          <AngleArrow fontSize="inherit" />
        </IconButton>
      </Grid>
      <Grid item>
        <Typography>Settings</Typography>
      </Grid>
      <Grid item>
        <SettingsButtonIcon className={classes.settingsIcon} />
      </Grid>
      <Grid item xs={12}>
        <TransactionSettings settings={settings} network={network} />
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles({
  backButton: {
    padding: 6,
    fontSize: 24,
    transform: 'scaleX(-1)',
  },
  settingsIcon: {
    fontSize: 36,
  },
});
