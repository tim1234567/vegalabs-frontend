import * as React from 'react';

import { AlertIcon } from 'components/icons/AlertIcon';
import { makeStyles, useBreakpointsMatch } from 'core/styles';
import { Grid, Link } from 'components';
import { Metamask, Brave, Status } from 'components/icons/wallets';

type MessageBoxProps = {
  text: React.ReactNode;
  children?: React.ReactNode;
};

function MessageBox(props: MessageBoxProps) {
  const classes = useStyles();
  const { text, children } = props;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} container wrap="nowrap" spacing={1}>
        <Grid item>
          <AlertIcon className={classes.alertIcon} />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.text}>{text}</div>
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
}

const web3Links = [
  {
    title: 'Metamask extension',
    shortTitle: 'Metamask',
    address: 'https://metamask.app.link/',
    Icon: Metamask,
  },
  {
    title: 'Brave',
    address: 'https://brave.app.link/',
    Icon: Brave,
  },
  {
    title: 'Status app',
    address: 'https://status.im/',
    Icon: Status,
  },
];

function Web3Message() {
  const isMobileMD = useBreakpointsMatch({ to: 'sm' });
  const isMobileLG = useBreakpointsMatch({ to: 'md' });
  const classes = useStyles();

  return (
    <MessageBox text="Please install the Web3 extension or use Web3 browser to connect to your wallet.">
      <Grid
        item
        xs={12}
        container
        spacing={1}
        justifyContent={isMobileMD ? 'space-between' : 'flex-start'}
      >
        {web3Links.map(({ title, shortTitle, address, Icon }) => (
          <Grid
            item
            container
            alignItems="center"
            wrap="nowrap"
            xs
            className={classes.link}
            key={title}
          >
            <Icon className={classes.icon} />
            <Link
              href={address}
              target="_blank"
              rel="noopener noreferrer"
              title={(isMobileLG && shortTitle) || title}
              underline={isMobileLG ? 'none' : 'hover'}
              color="textPrimary"
            >
              <span className={classes.linkText}>{(isMobileLG && shortTitle) || title}</span>
            </Link>
          </Grid>
        ))}
      </Grid>
    </MessageBox>
  );
}

type Props = {
  type: 'web3';
};

export function UnavailableProviderWarning({ type }: Props): JSX.Element {
  switch (type) {
    case 'web3':
      return <Web3Message />;
  }
}

const useStyles = makeStyles(
  theme => ({
    alertIcon: {
      marginTop: 2,
      fontSize: 16,

      [theme.breakpoints.up('md')]: {
        marginTop: 0,
      },
    },

    text: {
      fontSize: 13,
      fontWeight: 300,
      lineHeight: 1.38,

      [theme.breakpoints.up('md')]: {
        fontSize: 12,
        lineHeight: 'normal',
      },
    },

    link: {
      flexGrow: 0,
    },

    linkText: {
      fontSize: 13,
      fontWeight: 'normal',
      whiteSpace: 'nowrap',

      [theme.breakpoints.up('md')]: {
        fontSize: 12,
        fontWeight: 300,
      },
    },

    icon: {
      fontSize: 16,
      marginRight: 5,

      [theme.breakpoints.up('md')]: {
        fontSize: 20,
      },
    },

    urlLink: {
      wordBreak: 'break-word',
    },

    nowrap: {},
  }),
  { name: 'UnavailableProviderWarning' },
);
