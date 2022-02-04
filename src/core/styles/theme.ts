import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: { fontFamily: 'Helvetica Neue' },
  palette: { primary: { main: '#E8006F' } },
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
