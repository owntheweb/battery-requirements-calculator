import React from 'react';
import {Typography, Box} from '@mui/material';
import {BatteryConfigurationData} from '../model/BatteryConfigurationData';
import {Device} from '../model/Device';
import {DeviceTotals} from '../model/DeviceTotals';

interface BatteryMathProps {
  batteryConfigurationData: BatteryConfigurationData;
  devices: Device[];
  deviceTotals: DeviceTotals;
}

const BatteryMath: React.FC<BatteryMathProps> = ({
  batteryConfigurationData,
  devices,
  deviceTotals,
}) => {
  const totalMaxWatts = deviceTotals.totalMaxWatts;
  const totalEstimatedWatts = deviceTotals.totalEstimatedWatts;

  // TODO: I think this is wrong, revisit:
  const totalAmps = devices.reduce(
    (sum, device) => sum + device.amps * device.quantity,
    0
  );

  const totalAmpHours = batteryConfigurationData.totalAmpHours;
  const estimatedRunTime =
    batteryConfigurationData.totalWattHours / totalEstimatedWatts;
  const worstCaseRunTime =
    batteryConfigurationData.totalWattHours / totalMaxWatts;

  return (
    <Box sx={{mt: 2}}>
      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Watts
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Max Watts: {totalMaxWatts}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Estimated Watts: {totalEstimatedWatts}
        </Typography>
      </Box>
      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Amps
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Device Amps: {totalAmps.toFixed(2)} A
        </Typography>
        <Typography variant="body1" gutterBottom>
          Total Battery Amp Hours: {totalAmpHours.toFixed(2)} Ah
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Battery Run Times
        </Typography>
        <Typography variant="body1" gutterBottom>
          Estimated Run Time: {estimatedRunTime.toFixed(2)} hours
        </Typography>
        <Typography variant="body1">
          Worst Case Run Time: {worstCaseRunTime.toFixed(2)} hours
        </Typography>
      </Box>
    </Box>
  );
};

export default BatteryMath;
