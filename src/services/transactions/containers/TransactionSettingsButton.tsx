import React, { useCallback } from 'react';

import { Network } from 'domain/types';
import { SettingsButton, Popover, DecoratedCard, IconButtonProps } from 'components';
import { makeStyles } from 'core/styles';

import { TransactionSettings, TransactionSettingsProps } from './TransactionSettings';

type Props = {
  network: Network;
  settings?: TransactionSettingsProps['settings'];
} & IconButtonProps;

export function TransactionSettingsButton(props: Props) {
  const { network, settings, ...rest } = props;
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const openSettings = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget),
    [],
  );
  const closeSettings = useCallback(() => setAnchorEl(null), []);

  return (
    <>
      <SettingsButton {...rest} onClick={openSettings} />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closeSettings}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          className: classes.paperRoot,
        }}
      >
        <DecoratedCard className={classes.card}>
          <TransactionSettings settings={settings} network={network} />
        </DecoratedCard>
      </Popover>
    </>
  );
}

const useStyles = makeStyles(
  theme => ({
    card: {
      minWidth: 375 - 32,
    },
    paperRoot: {
      marginTop: -16,
      background: 'unset',
      boxShadow:
        '0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%), 0px 0px 30px 2px rgb(0 0 0 / 20%)',

      [theme.breakpoints.up('md')]: {
        boxShadow:
          '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
      },
    },
  }),
  { name: 'TransactionSettingsButton' },
);
