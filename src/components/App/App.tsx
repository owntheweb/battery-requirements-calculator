import React, {useCallback, useState} from 'react';
import {Box, Container, Typography, Divider, Button} from '@mui/material';
import BatteryDemoFeature from '../BatteryDemoFeature';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';
import TopNav from '../TopNav';
import BatteryCalculatorForm from '../PowerUsageForm';
import {Warning as WarningIcon} from '@mui/icons-material';
import BatterySelectionForm from '../BatterySelectionForm';
import BatteryConfigurationForm from '../BatteryConfigurationForm';
import BatteryMath from '../BatteryMath';
import {Device} from '../../model/Device';
import {BatteryData} from '../../model/BatteryData';
import {BatteryConfigurationData} from '../../model/BatteryConfigurationData';
import {DeviceTotals} from '../../model/DeviceTotals';
import {saveAs} from 'file-saver';
import Papa from 'papaparse';

const App: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceTotals, setDeviceTotals] = useState<DeviceTotals>({
    totalMaxWatts: 0,
    totalEstimatedWatts: 0,
  });
  const [batteryData, setBatteryData] = useState<BatteryData>({
    batteryType: '',
    volts: 0,
    ampHours: 0,
    wattHours: 0,
    chemistry: 0,
  });
  const [batteryConfigurationData, setBatteryConfigurationData] =
    useState<BatteryConfigurationData>({
      seriesCount: 1,
      parallelCount: 1,
      totalVolts: 0,
      totalAmpHours: 0,
      totalWattHours: 0,
    });

  const handleDeviceDataChange = useCallback(
    (updatedDevices: Device[], totals: DeviceTotals) => {
      setDevices(updatedDevices);
      setDeviceTotals(totals);
    },
    []
  );

  const handleBatteryDataChange = useCallback((battery: BatteryData) => {
    setBatteryData(battery);
  }, []);

  const handleBatteryConfigChange = useCallback(
    (config: BatteryConfigurationData) => {
      setBatteryConfigurationData(config);
    },
    []
  );

  // Export data as JSON
  const exportData = () => {
    const data = {
      version: '1.0',
      devices,
      batteryData,
      batteryConfigurationData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'battery_calculator_data.json');
  };

  // Export Device Power Usage as CSV
  const exportDevicePowerUsageCSV = () => {
    const csv = Papa.unparse(devices);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    saveAs(blob, 'device_power_usage.csv');
  };

  // Export Battery Selection/Configuration as CSV
  const exportBatteryConfigCSV = () => {
    const data = [
      {
        ...batteryData,
        ...batteryConfigurationData,
      },
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    saveAs(blob, 'battery_configuration.csv');
  };

  // Export Battery Math as CSV
  const exportBatteryMathCSV = () => {
    const data = [
      {
        totalMaxWatts: deviceTotals.totalMaxWatts,
        totalEstimatedWatts: deviceTotals.totalEstimatedWatts,
        totalBatteryVolts: batteryConfigurationData.totalVolts,
        totalBatteryAmpHours: batteryConfigurationData.totalAmpHours,
        totalBatteryWattHours: batteryConfigurationData.totalWattHours,
        // TODO: Get values from battery math soon to add to this.
      },
    ];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    saveAs(blob, 'battery_math.csv');
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
              Device Power Usage
            </Typography>
            <Typography variant="body1">
              How much battery power does a project need? It depends. What
              devices are being used? How long should the project run before a
              recharge is needed? This website will help guide in this process.
              First, let's start with the collecting all the devices to see how
              much power they will use.
            </Typography>

            <BatteryCalculatorForm onDataChange={handleDeviceDataChange} />
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Battery Configuration
            </Typography>
            <Typography variant="body1">
              Now that the power requirements are known, it's time to explore
              how this project will run on different batteries. Depending on the
              project, one battery might be enough, one car battery for example.
              It will require a much larger set of rechargeable 18560 batteries
              for example to power a an air fryer (configurable below).
            </Typography>

            <BatterySelectionForm onDataChange={handleBatteryDataChange} />

            <Divider sx={{my: 2}} />

            <BatteryConfigurationForm
              batteryData={batteryData}
              onConfigChange={handleBatteryConfigChange}
            />
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Battery Math
            </Typography>
            <Typography variant="body1">
              It's time to total everything up to determine battery run times
              for the listed devices.
            </Typography>

            {
              <BatteryMath
                batteryConfigurationData={batteryConfigurationData}
                devices={devices}
                deviceTotals={deviceTotals}
              />
            }
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Data Tools
            </Typography>
            <Typography variant="body1">
              Use these tools to export or import data. All data can be exported
              as JSON for later use, or specific sections can be exported as CSV
              for use in spreadsheet applications.
            </Typography>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
              <Button variant="contained" color="primary" onClick={exportData}>
                Export All Data (JSON)
              </Button>
              <Button variant="contained" component="label">
                Import Data (JSON)
                <input type="file" hidden accept=".json" onChange={() => {}} />
              </Button>
            </Box>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
              <Button variant="outlined" onClick={exportDevicePowerUsageCSV}>
                Export Device Power Usage (CSV)
              </Button>
              <Button variant="outlined" onClick={exportBatteryConfigCSV}>
                Export Battery Config (CSV)
              </Button>
              <Button variant="outlined" onClick={exportBatteryMathCSV}>
                Export Battery Math (CSV)
              </Button>
            </Box>
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
};

export default App;
