import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#001229',
    },
    primary: {
      main: '#AEFFFF',
    },
    secondary: {
      main: '#CC3791',
    },
    error: {
      main: '#FF6B6B',
    },
    warning: {
      main: '#FFD93D',
    },
    info: {
      main: '#4ECDC4',
    },
    success: {
      main: '#95E1D3',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '2.5rem', // Adjusted from the default (usually around 6rem)
    },
    h2: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '1.8rem', // As requested
    },
    h3: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '1.5rem', // Adjusted proportionally
    },
    h4: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '1.3rem', // Adjusted proportionally
    },
    h5: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '1.2rem', // Adjusted proportionally
    },
    h6: {
      fontFamily: '"Kode Mono", monospace',
      fontSize: '1.1rem', // Adjusted proportionally
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&display=swap');
      `,
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#CC3791',
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme;
