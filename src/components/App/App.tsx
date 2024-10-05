import React, {useState, useCallback, useRef} from 'react';
import {Box, Container, Typography, Divider, Button, Link} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Warning as WarningIcon} from '@mui/icons-material';
import {saveAs} from 'file-saver';
import Papa from 'papaparse';
import {v4 as uuidv4} from 'uuid';

import BatteryDemoFeature from '../BatteryDemoFeature';
import theme from '../../theme';
import TopNav from '../TopNav';
import PowerUsageForm from '../PowerUsageForm';
import BatterySelectionForm from '../BatterySelectionForm';
import BatteryConfigurationForm from '../BatteryConfigurationForm';
import BatteryMath from '../BatteryMath';
import {useBatteryCalculator} from '../../hooks/useBatteryCalculator';
import {Device} from '../../model/Device';
import {BatteryData} from '../../model/BatteryData';
import {BatteryConfigurationData} from '../../model/BatteryConfigurationData';
import Footer from '../Footer';

const App: React.FC = () => {
  const {
    batteryData,
    batteryConfigurationData,
    devices,
    batteryMathData,
    updateBatteryData,
    updateBatteryConfig,
    updateDevices,
  } = useBatteryCalculator();

  const [importedDataFlag, setImportedDataFlag] = useState(false);
  const importedDataRef = useRef<{
    devices: Device[] | null;
    batteryData: BatteryData | null;
    batteryConfigurationData: BatteryConfigurationData | null;
  }>({
    devices: null,
    batteryData: null,
    batteryConfigurationData: null,
  });

  // Export data as JSON
  const exportData = () => {
    const devicesWithoutId = devices.map(({id, ...rest}) => rest);
    const data = {
      version: '1.0',
      devices: devicesWithoutId,
      batteryData,
      batteryConfigurationData,
      batteryMathData: {
        totalMaxWatts: Number(batteryMathData.totalMaxWatts.toFixed(2)),
        totalEstimatedWatts: Number(
          batteryMathData.totalEstimatedWatts.toFixed(2)
        ),
        totalDeviceAmps: Number(batteryMathData.totalDeviceAmps.toFixed(2)),
        dailyUsageEstimated: Number(
          batteryMathData.dailyUsageEstimated.toFixed(2)
        ),
        dailyUsageMax: Number(batteryMathData.dailyUsageMax.toFixed(2)),
        totalBatteryVolts: Number(batteryMathData.totalBatteryVolts.toFixed(2)),
        totalBatteryAmpHours: Number(
          batteryMathData.totalBatteryAmpHours.toFixed(2)
        ),
        totalBatteryWattHours: Number(
          batteryMathData.totalBatteryWattHours.toFixed(2)
        ),
        estimatedRunTime: Number(batteryMathData.estimatedRunTime.toFixed(2)),
        worstCaseRunTime: Number(batteryMathData.worstCaseRunTime.toFixed(2)),
        estimatedDailyRunTime: Number(
          batteryMathData.estimatedDailyRunTime.toFixed(2)
        ),
        maxDailyRunTime: Number(batteryMathData.maxDailyRunTime.toFixed(2)),
      },
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
    const csv = Papa.unparse([batteryMathData]);
    const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    saveAs(blob, 'battery_math.csv');
  };

  const importData = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            if (importedData.version === '1.0') {
              // Generate new IDs for imported devices
              const devicesWithNewIds = importedData.devices.map(
                (device: Omit<Device, 'id'>) => ({
                  ...device,
                  id: uuidv4(),
                })
              );

              importedDataRef.current = {
                devices: devicesWithNewIds,
                batteryData: importedData.batteryData,
                batteryConfigurationData: importedData.batteryConfigurationData,
              };

              // Update the main state
              updateDevices(devicesWithNewIds, {
                totalMaxWatts: importedData.batteryMathData.totalMaxWatts,
                totalEstimatedWatts:
                  importedData.batteryMathData.totalEstimatedWatts,
              });
              updateBatteryData(importedData.batteryData);
              updateBatteryConfig(importedData.batteryConfigurationData);

              // Set the flag to trigger a re-render
              setImportedDataFlag(true);
            } else {
              console.error('Unsupported file version');
            }
          } catch (error) {
            console.error('Error parsing imported data:', error);
          }
        };
        reader.readAsText(file);
      }
    },
    [updateDevices, updateBatteryData, updateBatteryConfig]
  );

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
              First, let's start with collecting all the devices to see how much
              power they will use.
            </Typography>

            <PowerUsageForm
              onDataChange={updateDevices}
              importedDevices={importedDataRef.current.devices || devices}
              importTrigger={importedDataFlag}
            />
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="primary">
              Battery Configuration
            </Typography>
            <Typography variant="body1">
              Now that the power requirements are known, it's time to explore
              how this project will run on different batteries. Depending on the
              project, one battery might be enough, one car battery for example.
              It will require a much larger set of rechargeable 18650 batteries
              for example to power an air fryer (configurable below).
            </Typography>

            <BatterySelectionForm
              onDataChange={updateBatteryData}
              importedBatteryData={
                importedDataRef.current.batteryData || batteryData
              }
              importTrigger={importedDataFlag}
            />

            <Divider sx={{my: 2}} />

            <BatteryConfigurationForm
              batteryData={batteryData}
              onConfigChange={updateBatteryConfig}
              importedConfigData={
                importedDataRef.current.batteryConfigurationData ||
                batteryConfigurationData
              }
              importTrigger={importedDataFlag}
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

            <BatteryMath batteryMathData={batteryMathData} />
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
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={importData}
                />
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
            <Typography variant="h2" gutterBottom color="primary">
              Now What?
            </Typography>
            <Typography variant="body1">
              Use and recharge batteries safely with a <Link href="https://en.wikipedia.org/wiki/Battery_management_system">Battery Management System (BMS)</Link>. When using batteries to power sensitive
              electronics, consider adding a <Link href="https://en.wikipedia.org/wiki/Power_management_system">Power Management System (PMS)</Link>. Checkout books such as DIY Lithium Batteries - 
              How To Build Your Own Battery Packs by Micah Toll. You have the power.
            </Typography>
            <Typography variant="body1">
              Charge forth.
            </Typography>
          </Box>

          <Box sx={{p: 3}}>
            <Typography variant="h2" gutterBottom color="error">
              <WarningIcon /> Disclaimer
            </Typography>
            <Typography variant="body1">
              Use this calculator at your own risk. The creators of this website
              are not responsible for your energy system or any of the
              equipment/devices that attach to it. We are not responsible for
              any damage to your vehicle and/or domicile. Electronics and
              electrical loads may generate heat, which can lead to fires.
              Working on electrical systems can cause shock that may result in
              injury or death. Always exercise caution when working on
              electrical systems. When applying electrical loads to power supply
              systems, understand the load limitations of conductors and use
              proper fuses for the load. Failure to heed the manufacturer's
              instructions may result in damage to self or property. Batteries
              store large amounts of energy, improper use can result in fire,
              injury or death.
            </Typography>
          </Box>
          <Footer />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
