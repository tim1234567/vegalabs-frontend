import { makeStyles } from 'core/styles';

export const GLOBAL_TX_STATUSES_HEIGHT = 50;

export const useStyles = makeStyles(
  theme => ({
    root: {
      zIndex: theme.zIndex.modal + 70,
      display: 'flex',
      alignItems: 'stretch',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: GLOBAL_TX_STATUSES_HEIGHT,
      lineHeight: 2.3,
      background: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
      transition: theme.transitions.create('width'),

      [theme.breakpoints.up('md')]: {
        lineHeight: 1.8,
      },

      '&$closed': {
        display: 'inline-block',
        alignSelf: 'flex-start',
        width: 82,
        borderBottomRightRadius: 6,
        transition: theme.transitions.create('width'),
        overflow: 'hidden',
      },
    },

    content: {
      display: 'flex',
      padding: 4,
      transition: theme.transitions.create('opacity'),
      transitionDelay: '0.1s',
      opacity: 1,
      overflow: 'hidden',

      [theme.breakpoints.up('md')]: {
        padding: '6px 10px',
      },

      '&$closed': {
        flexGrow: 0,
        opacity: 0,
        transition: theme.transitions.create('opacity'),
      },
    },

    views: {
      maxWidth: '100%',

      [theme.breakpoints.up('md')]: {
        minWidth: 330,
        paddingRight: 30,
      },
    },

    slideElement: {
      display: 'flex',
      flexDirection: 'column',

      '&$withoutSize': {
        maxHeight: 30,
        position: 'absolute',
      },
    },

    title: {
      fontSize: 12,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    toggleButton: {
      zIndex: 1,
      flexShrink: 0,
      height: GLOBAL_TX_STATUSES_HEIGHT,
      width: 76,
      minWidth: 76,
      padding: '0 11px',
      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 0,
      fontSize: 12,
      justifyContent: 'flex-start',

      '&$closed': {
        width: '100%',
        borderRightColor: 'transparent',
      },
    },

    toggleButtonContent: {
      display: 'flex',
      flexDirection: 'column',

      [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },

    eyeIcon: {
      margin: '-1px 5px 1px 0',
      marginBottom: 1,
      fontSize: 20,

      [theme.breakpoints.up('md')]: {
        fontSize: 16,
        margin: '0 5px 0 0',
      },
    },

    navigation: {
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
      position: 'absolute',
      right: 46,
      bottom: 2,

      '&:last-child': {
        marginRight: 0,
      },

      [theme.breakpoints.up('md')]: {
        position: 'static',
        display: 'flex',
        marginRight: 20,

        '& > *': {
          marginRight: 10,
        },
      },
    },

    navButton: {
      fontSize: 20,

      [theme.breakpoints.up('md')]: {
        fontSize: 28,
      },
    },

    closeButton: {
      marginLeft: 'auto',
      padding: 0,
      width: 36,
      minWidth: 0,
      height: GLOBAL_TX_STATUSES_HEIGHT,
      borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 0,
      opacity: 1,
      transition: theme.transitions.create('opacity'),
      transitionDelay: '0.3s',

      '&$closed': {
        width: 0,
        opacity: 0,
        transition: theme.transitions.create('opacity'),
      },

      [theme.breakpoints.up('md')]: {
        width: 54,
      },
    },

    closeIcon: {
      fontSize: 20,
      opacity: 1,

      [theme.breakpoints.up('md')]: {
        fontSize: 26,
      },
    },

    counter: {
      fontSize: 12,
      order: 1,
      marginLeft: 3,

      [theme.breakpoints.up('md')]: {
        order: 0,
        marginLeft: 0,
        marginRight: 10,
      },
    },

    withoutSize: {},
    closed: {},
  }),
  { name: 'GlobalTxStatuses' },
);
