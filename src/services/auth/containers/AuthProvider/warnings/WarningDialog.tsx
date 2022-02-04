import React from 'react';

import { Button, Grid, Dialog, Typography } from 'components';
import { makeStyles } from 'core/styles';

type Props = {
  isOpen: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onCancel?(): void;
};

export function WarningDialog(props: Props) {
  const classes = useStyles();
  const { isOpen, title, children, onCancel } = props;

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <Grid container spacing={3} direction="column" wrap="nowrap">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
        </Grid>
        <Grid item>{children}</Grid>
        <Grid item>
          <Button variant="contained" className={classes.button} color="primary" onClick={onCancel}>
            OK
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

const useStyles = makeStyles(
  theme => ({
    title: {
      fontSize: 16,

      [theme.breakpoints.up('sm')]: {
        fontSize: 20,
      },

      [theme.breakpoints.up('md')]: {
        fontSize: 24,
      },
    },
    button: {
      paddingLeft: 30,
      paddingRight: 30,
      marginBottom: 10,
    },
  }),
  { name: 'WarningDialog' },
);
