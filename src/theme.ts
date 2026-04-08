import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A1A1A',
      contrastText: '#FAFAFA',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#252525',
      secondary: '#8A8A8A',
    },
    error: {
      main: '#D93C3C',
    },
    divider: '#EBEBEB',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Geist', system-ui, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FAFAFA',
      contrastText: '#1A1A1A',
    },
    background: {
      default: '#252525',
      paper: '#252525',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#B3B3B3',
    },
    error: {
      main: '#A85C5C',
    },
    divider: '#464646',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Geist', system-ui, sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
  },
});
