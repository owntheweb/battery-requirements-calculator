import React from 'react';
import {Box, Container, Typography, Divider} from '@mui/material';
import BatteryDemoFeature from '../BatteryDemoFeature';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import TopNav from '../TopNav';
import BatteryCalculatorForm from '../PowerUsageForm';
import {Device} from '../../model/Device';
import {Warning as WarningIcon} from '@mui/icons-material';

function App() {
  const handleDeviceDataChange = (
    devices: Device[],
    totals: {totalMaxWatts: number; totalEstimatedWatts: number}
  ) => {
    // Use the updated devices and totals data here
    console.log(devices, totals);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{minHeight: '100vh', flexGrow: 1}}>
        <CssBaseline />

        <TopNav />

        <BatteryDemoFeature />

        <Container>
          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Power Usage Workbook
            </Typography>
            <Typography variant="body1">
              How much battery power does my project need? It depends. What
              devices are being used? How long should the project run before a
              recharge is needed? This website will help guide in this process.
              First, let's start with the collecting all the devices to see how
              much power they will use.
            </Typography>

            <BatteryCalculatorForm onDataChange={handleDeviceDataChange} />
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Battery Selection
            </Typography>
            <Typography variant="body1">
              Now that we know what the power requirements are, it's time to
              explore how this project will run on different batteries.
            </Typography>

            <p>SOON</p>
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Battery Pack Configuration
            </Typography>
            <Typography variant="body1">Description here soon.</Typography>

            <p>SOON</p>
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="error">
              <WarningIcon /> Disclaimer
            </Typography>
            <Typography variant="body1">
              Use this calculator at your own risk. The creators of this website
              are not responsible for your energy system or any of the
              equipment/devices that attach to it. We are not responsible to any
              damage to your vehicle and/or domicile. Electronics and electrical
              loads may generate heat, this can lead to fires. Working on
              electrical systems can cause shock that may result in injury or
              death. Always exercise caution when working on electrical systems.
              When applying electrical loads to power supply systems, understand
              the load limitations of conductors and use proper fuses for the
              load. Failure to head the manufactures instructions may result in
              damage to self or property. Batteries store large amounts of
              energy, improper use can result in fire, injury or death
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
