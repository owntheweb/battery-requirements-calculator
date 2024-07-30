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
  const [seriesCount, setSeriesCount] = useState(1);
  const [parallelCount, setParallelCount] = useState(1);
  const theme = useTheme();

  const configData = useMemo(() => {
    const totalVolts = batteryData.volts * seriesCount;
    const totalAmpHours = batteryData.ampHours * parallelCount;
    const totalWattHours = totalVolts * totalAmpHours;

    return {
      seriesCount,
      parallelCount,
      totalVolts,
      totalAmpHours,
      totalWattHours,
    };
  }, [batteryData.volts, batteryData.ampHours, seriesCount, parallelCount]);

  useEffect(() => {
    onConfigChange(configData);
  }, [onConfigChange, configData]);

  const renderBatteryGrid = () => {
    const cellWidth = 80;
    const cellHeight = 80;
    const batteryWidth = 60;
    const batteryHeight = 60;
    const iconSize = 40;
    const totalWidth = seriesCount * cellWidth + iconSize * 2; // Add space for icons
    const totalHeight = parallelCount * cellHeight;

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
          {Array.from({length: parallelCount}).map((_, rowIndex) => (
            <g key={`row-${rowIndex}`}>
              {Array.from({length: seriesCount}).map((_, colIndex) => (
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
                  {colIndex < seriesCount - 1 && (
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
                  {rowIndex < parallelCount - 1 && (
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
                      {colIndex === seriesCount - 1 && (
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
            value={seriesCount}
            onChange={(e) =>
              setSeriesCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Parallel Battery Strings"
            type="number"
            value={parallelCount}
            onChange={(e) =>
              setParallelCount(Math.max(1, parseInt(e.target.value) || 1))
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
              Total Voltage:
            </Typography>
            <Typography variant="body1" align="center">
              {configData.totalVolts.toFixed(2)} V
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" color="#FCB1E5">
              Total Amp Hours:
            </Typography>
            <Typography variant="body1" align="center">
              {configData.totalAmpHours.toFixed(2)} Ah
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" color="#FCB1E5">
              Total Watt Hours:
            </Typography>
            <Typography variant="body1" align="center">
              {configData.totalWattHours.toFixed(2)} Wh
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BatteryConfigurationForm;
