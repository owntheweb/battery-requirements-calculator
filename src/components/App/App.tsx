import React, {useRef} from 'react';
import {Box, Container, Typography} from '@mui/material';
import BatteryDemoFeature from '../BatteryDemoFeature';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import TopNav from '../TopNav';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{minHeight: '100vh', flexGrow: 1}}>
        <CssBaseline />

        <TopNav />

        <BatteryDemoFeature />

        <Container>
          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              How much battery power do I need?
            </Typography>
            <Typography variant="body1">
              Use the calculator below to help determine how much charge and
              amperage will be needed to keep your devices running with less
              worry about running out of power at awkward times.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
