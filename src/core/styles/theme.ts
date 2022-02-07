import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: { fontFamily: 'Helvetica Neue' },
  palette: { primary: { main: '#E8006F' }, secondary: { main: '#F7F8FA' } },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        rectangular: {
          borderRadius: '6px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          letterSpacing: 0.5,
        },
        contained: {
          boxShadow: 'none',
        },
        sizeLarge: {
          fontSize: 20,
          borderRadius: 10,
          paddingTop: 11,
          paddingBottom: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: '#F7F8FA',
          borderRadius: 10,
        },
        input: {
          fontWeight: 500,
          fontSize: 27,
          padding: '15px 10px',
          minHeight: 39,

          '&.MuiSelect-select': {
            minHeight: 39,
          },
        },
        notchedOutline: {
          border: 'none',
        },
      },
    },
  },
});

export const adminTheme = createTheme({
  typography: { fontFamily: 'Helvetica Neue' },
  palette: { primary: { main: '#000000' } },
});

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
