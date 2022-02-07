import React from 'react';
import { Box, Grid, Typography, Container, Link } from '@mui/material';

import { NextLink } from 'components/NextLink';
import { NextSvgIcon } from 'components/NextSvgIcon';
import { AuthButton } from 'services/auth';
import { makeStyles } from 'core/styles';
import { routes } from 'routes';
import { useRouteMatch } from 'utils/useRouteMatch';
import { GlobalTxStatuses, TxStatusesHeightSaver } from 'services/transactions';

import background from './images/background.png';
import logo from './images/logo.svg';

export function BaseLayout({ children }: { children: React.ReactNode }) {
  const classes = useStyles();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${background.src})`,
        backgroundSize: 'cover',
      }}
    >
      <GlobalTxStatuses />
      <TxStatusesHeightSaver />
      <Container sx={{ pt: 1, pb: 1 }}>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Link component={NextLink} underline="none" href="/">
              <NextSvgIcon image={logo} className={classes.logo} />
            </Link>
          </Grid>
          <Grid item>
            <Navigation />
          </Grid>
          <Grid item>
            <AuthButton />
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ pt: 3, pb: 7 }}>{children}</Container>
    </Box>
  );
}

function Navigation() {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <NavigationLink href="/" title="Trade on NaiveShorts" />
      </Grid>
      <Grid item>
        <NavigationLink href={routes.admin.getRedirectPath()} title="Vegalabs Admin" />
      </Grid>
    </Grid>
  );
}

function NavigationLink({ href, title }: { href: string; title: string }) {
  const isActive = useRouteMatch(href, true);

  return isActive ? (
    <Typography fontWeight="bold" sx={{ fontSize: '18px' }}>
      {title}
    </Typography>
  ) : (
    <Link component={NextLink} href={href} sx={{ pl: '8px', pr: '8px', fontSize: '18px' }}>
      {title}
    </Link>
  );
}

const useStyles = makeStyles(
  {
    logo: {
      fontSize: '42px !important',
    },
  },
  { name: 'BaseLayout' },
);
