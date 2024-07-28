import React, {useState, useEffect, useMemo} from 'react';
import {TextField, Grid, Box, useTheme} from '@mui/material';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';

// Assuming these types are defined in separate files
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

    return (
      <svg
        width="100%"
        height={parallelCount * cellHeight}
        viewBox={`0 0 ${seriesCount * cellWidth} ${parallelCount * cellHeight}`}
      >
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
                    stroke="white"
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
                        stroke="white"
                        strokeWidth="2"
                      />
                    )}

                    {/* Middle vertical lines (intersecting with horizontal lines) */}
                    {/*colIndex < seriesCount && (
                      <line
                        x1={cellWidth - (cellWidth - batteryWidth) / 4}
                        y1={cellHeight}
                        x2={cellWidth - (cellWidth - batteryWidth) / 4}
                        y2={cellHeight + (cellHeight - batteryHeight) / 2}
                        stroke="white"
                        strokeWidth="2"
                      />
                    )*/}
                    {/* right vertical line only for the right column */}
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
                        stroke="white"
                        strokeWidth="2"
                      />
                    )}
                  </>
                )}
              </g>
            ))}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Batteries in Series"
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
          overflow: 'auto',
          backgroundColor: '#000711',
          borderRadius: 1,
        }}
      >
        {renderBatteryGrid()}
      </Box>
    </Box>
  );
};

export default BatteryConfigurationForm;
