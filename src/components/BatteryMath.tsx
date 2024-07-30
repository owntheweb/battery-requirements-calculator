import React, {useState} from 'react';
import {Typography, Box, Button, Collapse} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
  const [showMath, setShowMath] = useState(false);

  const totalMaxWatts = deviceTotals.totalMaxWatts;
  const totalEstimatedWatts = deviceTotals.totalEstimatedWatts;

  const totalDeviceAmps = devices.reduce((sum, device) => {
    const amps = device.ampType === 'mA' ? device.amps / 1000 : device.amps;
    return sum + amps * device.quantity;
  }, 0);

  const totalBatteryVolts = batteryConfigurationData.totalVolts;
  const totalBatteryAmpHours = batteryConfigurationData.totalAmpHours;
  const totalBatteryWattHours = batteryConfigurationData.totalWattHours;

  const estimatedRunTime = totalBatteryWattHours / totalEstimatedWatts;
  const worstCaseRunTime = totalBatteryWattHours / totalMaxWatts;

  const calculateDailyUsage = (useMaxWatts: boolean) => {
    return devices.reduce((sum, device) => {
      const watts = useMaxWatts ? device.maxWatts : device.estimatedWatts;
      return sum + watts * device.quantity * device.hoursRunPerDay;
    }, 0);
  };

  const dailyUsageEstimated = calculateDailyUsage(false);
  const dailyUsageMax = calculateDailyUsage(true);
  const estimatedDailyRunTime = totalBatteryWattHours / dailyUsageEstimated;
  const maxDailyRunTime = totalBatteryWattHours / dailyUsageMax;

  const toggleShowMath = () => {
    setShowMath(!showMath);
  };

  const renderMathSection = (
    title: string,
    calculation: string,
    result: number | string
  ) => (
    <Box sx={{ml: 2, mb: 1}}>
      <Typography variant="subtitle1">{title}</Typography>
      <Collapse in={showMath}>
        <Typography variant="body2" color="text.secondary">
          {calculation}
        </Typography>
      </Collapse>
      <Typography variant="body1">
        {typeof result === 'number' ? result.toFixed(2) : result}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{mt: 2}}>
      <Box sx={{mt: 2}}>
        <Button
          variant="text"
          size="small"
          startIcon={showMath ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          onClick={toggleShowMath}
          sx={{
            mb: 2,
            p: 0,
            minWidth: 0,
            '& .MuiButton-startIcon': {
              mr: 0.5,
            },
          }}
        >
          {showMath ? 'Hide Math' : 'Show Math'}
        </Button>
      </Box>

      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Device Power Usage
        </Typography>
        {renderMathSection(
          'Total Max Watts:',
          'Sum of (device max watts × quantity) for all devices',
          `${totalMaxWatts}W`
        )}
        {renderMathSection(
          'Total Estimated Watts:',
          'Sum of (device estimated watts × quantity) for all devices',
          `${totalEstimatedWatts}W`
        )}
        {renderMathSection(
          'Total Device Amps:',
          'Sum of (device amps × quantity) for all devices, converting mA to A where necessary',
          `${totalDeviceAmps.toFixed(2)}A`
        )}
        {renderMathSection(
          'Daily Usage (Estimated Watts):',
          'Sum of (device estimated watts × quantity × hours run per day) for all devices',
          `${dailyUsageEstimated.toFixed(2)}Wh`
        )}
        {renderMathSection(
          'Daily Usage (Max Watts):',
          'Sum of (device max watts × quantity × hours run per day) for all devices',
          `${dailyUsageMax.toFixed(2)}Wh`
        )}
      </Box>

      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Battery Configuration
        </Typography>
        {renderMathSection(
          'Total Battery Voltage:',
          `${batteryConfigurationData.seriesCount} batteries in series × ${
            batteryConfigurationData.totalVolts /
            batteryConfigurationData.seriesCount
          }V per battery`,
          `${totalBatteryVolts}V`
        )}
        {renderMathSection(
          'Total Battery Amp Hours:',
          `${batteryConfigurationData.parallelCount} parallel strings × ${
            batteryConfigurationData.totalAmpHours /
            batteryConfigurationData.parallelCount
          }Ah per string`,
          `${totalBatteryAmpHours}Ah`
        )}
        {renderMathSection(
          'Total Battery Watt Hours:',
          `${totalBatteryVolts}V × ${totalBatteryAmpHours}Ah`,
          `${totalBatteryWattHours}Wh`
        )}
      </Box>

      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Estimated Battery Run Times
        </Typography>
        {renderMathSection(
          'Based on Daily Usage (Estimated Watts):',
          `${totalBatteryWattHours}Wh ÷ ${dailyUsageEstimated.toFixed(
            2
          )}Wh per day`,
          `${estimatedDailyRunTime.toFixed(2)} days`
        )}
        {renderMathSection(
          'Based on Daily Usage (Max Watts):',
          `${totalBatteryWattHours}Wh ÷ ${dailyUsageMax.toFixed(2)}Wh per day`,
          `${maxDailyRunTime.toFixed(2)} days`
        )}
        {renderMathSection(
          'All Devices On (Estimated Watts):',
          `${totalBatteryWattHours}Wh ÷ ${totalEstimatedWatts}W`,
          `${estimatedRunTime.toFixed(2)} hours`
        )}
        {renderMathSection(
          'All Devices On (Max Watts):',
          `${totalBatteryWattHours}Wh ÷ ${totalMaxWatts}W`,
          `${worstCaseRunTime.toFixed(2)} hours`
        )}
      </Box>
    </Box>
  );
};

export default BatteryMath;
