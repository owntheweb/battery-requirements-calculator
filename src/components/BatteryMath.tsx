import React, {useState} from 'react';
import {Typography, Box, Button, Collapse} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {BatteryMathData} from '../hooks/useBatteryCalculator';

interface BatteryMathProps {
  batteryMathData: BatteryMathData;
}

const BatteryMath: React.FC<BatteryMathProps> = ({batteryMathData}) => {
  const [showMath, setShowMath] = useState(false);

  const toggleShowMath = () => {
    setShowMath(!showMath);
  };

  const renderMathSection = (
    title: string,
    calculation: string,
    result: number,
    unit: string
  ) => (
    <Box sx={{mb: 1}}>
      <Typography variant="subtitle1">{title}</Typography>
      <Collapse in={showMath}>
        <Typography variant="body2" color="text.secondary">
          {calculation}
        </Typography>
      </Collapse>
      <Typography variant="body1">
        {result.toFixed(2)} {unit}
      </Typography>
    </Box>
  );

  const renderTimeSection = (
    title: string,
    calculation: string,
    hours: number
  ) => {
    const days = hours / 24;
    return (
      <Box sx={{mb: 1}}>
        <Typography variant="subtitle1">{title}</Typography>
        <Collapse in={showMath}>
          <Typography variant="body2" color="text.secondary">
            {calculation}
          </Typography>
        </Collapse>
        <Typography variant="body1">
          {hours.toFixed(2)} hours{' '}
          {days >= 1 ? `(${days.toFixed(2)} days)` : ''}
        </Typography>
      </Box>
    );
  };

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
          batteryMathData.totalMaxWatts,
          'W'
        )}
        {renderMathSection(
          'Total Estimated Watts:',
          'Sum of (device estimated watts × quantity) for all devices',
          batteryMathData.totalEstimatedWatts,
          'W'
        )}
        {renderMathSection(
          'Total Device Amps:',
          'Sum of (device amps × quantity) for all devices, converting mA to A where necessary',
          batteryMathData.totalDeviceAmps,
          'A'
        )}
        {renderMathSection(
          'Daily Usage (Estimated Watts):',
          'Sum of (device estimated watts × quantity × hours run per day) for all devices',
          batteryMathData.dailyUsageEstimated,
          'Wh'
        )}
        {renderMathSection(
          'Daily Usage (Max Watts):',
          'Sum of (device max watts × quantity × hours run per day) for all devices',
          batteryMathData.dailyUsageMax,
          'Wh'
        )}
      </Box>

      <Box sx={{mb: 2}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Battery Configuration
        </Typography>
        {renderMathSection(
          'Total Battery Voltage:',
          'Number of batteries in series × Voltage per battery',
          batteryMathData.totalBatteryVolts,
          'V'
        )}
        {renderMathSection(
          'Total Battery Amp Hours:',
          'Number of parallel strings × Amp Hours per string',
          batteryMathData.totalBatteryAmpHours,
          'Ah'
        )}
        {renderMathSection(
          'Total Battery Watt Hours:',
          'Total Battery Voltage × Total Battery Amp Hours',
          batteryMathData.totalBatteryWattHours,
          'Wh'
        )}
      </Box>

      <Box sx={{mb: -1}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Estimated Battery Run Times
        </Typography>
        {renderTimeSection(
          'Based on Daily Usage (Estimated Watts):',
          'Total Battery Watt Hours ÷ Daily Usage (Estimated Watts)',
          (batteryMathData.totalBatteryWattHours /
            batteryMathData.dailyUsageEstimated) *
            batteryMathData.estimatedDailyRunTime
        )}
        {renderTimeSection(
          'Based on Daily Usage (Max Watts):',
          'Total Battery Watt Hours ÷ Daily Usage (Max Watts)',
          (batteryMathData.totalBatteryWattHours /
            batteryMathData.dailyUsageMax) *
            batteryMathData.maxDailyRunTime
        )}
        {renderTimeSection(
          'All Devices On (Estimated Watts):',
          'Total Battery Watt Hours ÷ Total Estimated Watts',
          batteryMathData.estimatedRunTime
        )}
        {renderTimeSection(
          'All Devices On (Max Watts):',
          'Total Battery Watt Hours ÷ Total Max Watts',
          batteryMathData.worstCaseRunTime
        )}
      </Box>
    </Box>
  );
};

export default BatteryMath;
