import React, {useState, useEffect, useMemo} from 'react';
import {TextField, Grid, Box, useTheme, Typography} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {BatteryData} from '../model/BatteryData';
import {BatteryConfigurationData} from '../model/BatteryConfigurationData';

interface BatteryConfigurationFormProps {
  batteryData: BatteryData;
  onConfigChange: (config: BatteryConfigurationData) => void;
}

const BatteryConfigurationForm: React.FC<BatteryConfigurationFormProps> = ({
  batteryData,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<BatteryConfigurationData>({
    seriesCount: 1,
    parallelCount: 1,
    totalVolts: 0,
    totalAmpHours: 0,
    totalWattHours: 0,
  });
  const theme = useTheme();

  // Calculate totals when config or batteryData changes
  useEffect(() => {
    const totalVolts = batteryData.volts * config.seriesCount;
    const totalAmpHours = batteryData.ampHours * config.parallelCount;
    const totalWattHours = totalVolts * totalAmpHours;

    const newConfig = {
      ...config,
      totalVolts,
      totalAmpHours,
      totalWattHours,
    };

    setConfig(newConfig);
    onConfigChange(newConfig);
  }, [batteryData, config.seriesCount, config.parallelCount, onConfigChange]);

  const handleChange = (
    field: 'seriesCount' | 'parallelCount',
    value: number
  ) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      [field]: Math.max(1, value),
    }));
  };

  const renderBatteryGrid = () => {
    const cellWidth = 80;
    const cellHeight = 80;
    const batteryWidth = 60;
    const batteryHeight = 60;
    const iconSize = 40;
    const totalWidth = config.seriesCount * cellWidth + iconSize * 2; // Add space for icons
    const totalHeight = config.parallelCount * cellHeight;

    return (
      <svg
        width="100%"
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      >
        {/* Negative icon */}
        <foreignObject
          width={iconSize}
          height={iconSize}
          x={0}
          y={(totalHeight - iconSize) / 2}
        >
          <RemoveIcon
            sx={{
              fontSize: iconSize,
              color: theme.palette.info.main,
            }}
          />
        </foreignObject>

        {/* Battery grid */}
        <g transform={`translate(${iconSize}, 0)`}>
          {Array.from({length: config.parallelCount}).map((_, rowIndex) => (
            <g key={`row-${rowIndex}`}>
              {Array.from({length: config.seriesCount}).map((_, colIndex) => (
                <g
                  key={`battery-${rowIndex}-${colIndex}`}
                  transform={`translate(${colIndex * cellWidth}, ${
                    rowIndex * cellHeight
                  })`}
                >
                  <foreignObject
                    width={batteryWidth}
                    height={batteryHeight}
                    x={(cellWidth - batteryWidth) / 2}
                    y={(cellHeight - batteryHeight) / 2}
                  >
                    <BatteryFullIcon
                      sx={{
                        fontSize: batteryHeight,
                        color: theme.palette.secondary.main,
                        transform: 'rotate(90deg)',
                      }}
                    />
                  </foreignObject>
                  {/* Horizontal lines */}
                  {colIndex < config.seriesCount - 1 && (
                    <line
                      x1={cellWidth - (cellWidth - batteryWidth) / 4}
                      y1={cellHeight / 2}
                      x2={cellWidth + (cellWidth - batteryWidth) / 4}
                      y2={cellHeight / 2}
                      stroke={theme.palette.primary.main}
                      strokeWidth="2"
                    />
                  )}
                  {/* Vertical lines */}
                  {rowIndex < config.parallelCount - 1 && (
                    <>
                      {/* Left vertical line (only for the first column) */}
                      {colIndex === 0 && (
                        <line
                          x1={(cellWidth - batteryWidth) / 2}
                          y1={cellHeight - cellHeight / 12}
                          x2={(cellWidth - batteryWidth) / 2}
                          y2={
                            cellHeight -
                            cellHeight / 12 +
                            (cellHeight - batteryHeight) / 2
                          }
                          stroke={theme.palette.primary.main}
                          strokeWidth="2"
                        />
                      )}
                      {/* Right vertical line (only for the last column) */}
                      {colIndex === config.seriesCount - 1 && (
                        <line
                          x1={cellWidth - (cellWidth - batteryWidth) / 4}
                          y1={cellHeight - cellHeight / 12}
                          x2={cellWidth - (cellWidth - batteryWidth) / 4}
                          y2={
                            cellHeight -
                            cellHeight / 12 +
                            (cellHeight - batteryHeight) / 2
                          }
                          stroke={theme.palette.primary.main}
                          strokeWidth="2"
                        />
                      )}
                    </>
                  )}
                </g>
              ))}
            </g>
          ))}
        </g>

        {/* Positive icon */}
        <foreignObject
          width={iconSize}
          height={iconSize}
          x={totalWidth - iconSize}
          y={(totalHeight - iconSize) / 2}
        >
          <AddIcon
            sx={{
              fontSize: iconSize,
              color: theme.palette.error.main,
            }}
          />
        </foreignObject>
      </svg>
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Batteries In Series"
            type="number"
            value={config.seriesCount}
            onChange={(e) =>
              handleChange('seriesCount', parseInt(e.target.value) || 1)
            }
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Parallel Battery Strings"
            type="number"
            value={config.parallelCount}
            onChange={(e) =>
              handleChange('parallelCount', parseInt(e.target.value) || 1)
            }
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 2,
          p: 2,
          backgroundColor: '#000711',
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom color="primary">
          Battery Configuration Visualization
        </Typography>
        <Box
          sx={{
            mt: 2,
            overflow: 'auto',
            backgroundColor: 'background.default',
            borderRadius: 1,
            p: 2,
          }}
        >
          {renderBatteryGrid()}
        </Box>
        <Grid container spacing={2} sx={{mt: 1}}>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" color="#FCB1E5">
              Volts:
            </Typography>
            <Typography variant="body1" align="center">
              {config.totalVolts.toFixed(2)}V
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" color="#FCB1E5">
              Amp Hours:
            </Typography>
            <Typography variant="body1" align="center">
              {config.totalAmpHours.toFixed(2)}Ah
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" color="#FCB1E5">
              Watt Hours:
            </Typography>
            <Typography variant="body1" align="center">
              {config.totalWattHours.toFixed(2)}Wh
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BatteryConfigurationForm;
