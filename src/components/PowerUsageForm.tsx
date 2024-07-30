import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Tooltip,
  IconButton,
  Box,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import {v4 as uuidv4} from 'uuid';
import {Device} from '../model/Device';

interface PowerUsageFormProps {
  onDataChange: (
    devices: Device[],
    totals: {totalMaxWatts: number; totalEstimatedWatts: number}
  ) => void;
}

const PowerUsageForm: React.FC<PowerUsageFormProps> = ({onDataChange}) => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: uuidv4(),
      name: '',
      quantity: 1,
      volts: 0,
      amps: 0,
      ampType: 'A',
      maxWatts: 0,
      estimatedWatts: 0,
      hoursRunPerDay: 24,
      totalWatts: 0,
      totalEstimatedWatts: 0,
      error: '',
    },
  ]);

  const addDevice = useCallback(() => {
    const lastDevice = devices[devices.length - 1];
    setDevices((prevDevices) => [
      ...prevDevices,
      {
        id: uuidv4(),
        name: '',
        quantity: 1,
        volts: 0,
        amps: 0,
        ampType: lastDevice.ampType,
        maxWatts: 0,
        estimatedWatts: 0,
        totalWatts: 0,
        hoursRunPerDay: 24,
        totalEstimatedWatts: 0,
        error: '',
      },
    ]);
  }, [devices]);

  const removeDevice = useCallback((id: string) => {
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== id)
    );
  }, []);

  const validateDevice = useCallback((device: Device): Device => {
    const updatedDevice = {...device};
    const {quantity, volts, amps, maxWatts, ampType} = device;
    const effectiveAmps = ampType === 'mA' ? amps * 0.001 : amps;

    if (quantity && volts && effectiveAmps && maxWatts) {
      const calculatedWatts = parseFloat((volts * effectiveAmps).toFixed(2));
      if (Math.abs(calculatedWatts - maxWatts) > 0.01) {
        updatedDevice.error = 'Values do not match. Please check your inputs.';
      } else {
        updatedDevice.error = '';
      }
    } else {
      updatedDevice.error = '';
    }

    updatedDevice.totalWatts = quantity * maxWatts;
    updatedDevice.totalEstimatedWatts = quantity * device.estimatedWatts;

    return updatedDevice;
  }, []);

  const updateDevice = useCallback(
    (id: string, field: keyof Device, value: string | number) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === id) {
            const updatedDevice = {
              ...device,
              [field]:
                field === 'name' || field === 'ampType'
                  ? value
                  : parseFloat(value as string) || 0,
              error: '',
            };
            return validateDevice(updatedDevice);
          }
          return device;
        })
      );
    },
    [validateDevice]
  );

  const calculateTotals = useCallback((devicesToCalculate: Device[]) => {
    return devicesToCalculate.reduce(
      (acc, device) => {
        return {
          totalMaxWatts: acc.totalMaxWatts + device.totalWatts,
          totalEstimatedWatts:
            acc.totalEstimatedWatts + device.totalEstimatedWatts,
        };
      },
      {totalMaxWatts: 0, totalEstimatedWatts: 0}
    );
  }, []);

  const isDeviceValid = useCallback((device: Device): boolean => {
    return (
      device.quantity > 0 &&
      ((device.volts > 0 && device.amps > 0) ||
        (device.volts > 0 && device.maxWatts > 0) ||
        (device.amps > 0 && device.maxWatts > 0))
    );
  }, []);

  const validDevices = useMemo(
    () => devices.filter(isDeviceValid),
    [devices, isDeviceValid]
  );
  const totals = useMemo(
    () => calculateTotals(validDevices),
    [validDevices, calculateTotals]
  );

  useEffect(() => {
    console.log(validDevices, totals);
    onDataChange(validDevices, totals);
  }, [validDevices, totals, onDataChange]);

  const shouldShowError = useCallback(
    (device: Device, field: 'volts' | 'amps' | 'maxWatts'): boolean => {
      const filledFields = [device.volts, device.amps, device.maxWatts].filter(
        Boolean
      ).length;
      return (filledFields >= 2 && device[field] === 0) || device.error !== '';
    },
    []
  );

  const canCalculateField = useCallback(
    (device: Device, field: 'volts' | 'amps' | 'maxWatts'): boolean => {
      const numericFields: ('volts' | 'amps' | 'maxWatts')[] = [
        'volts',
        'amps',
        'maxWatts',
      ];
      const filledFields = numericFields.filter(
        (f) => f !== field && device[f] > 0
      ).length;
      return filledFields === 2 && device[field] === 0;
    },
    []
  );

  const handleCalculateField = useCallback(
    (device: Device, field: 'volts' | 'amps' | 'maxWatts') => {
      const updatedDevice = {...device};
      const {volts, amps, maxWatts, ampType} = device;
      const effectiveAmps = ampType === 'mA' ? amps * 0.001 : amps;

      if (field === 'volts' && amps && maxWatts) {
        updatedDevice.volts = parseFloat((maxWatts / effectiveAmps).toFixed(2));
      } else if (field === 'amps' && volts && maxWatts) {
        const calculatedAmps = maxWatts / volts;
        updatedDevice.amps =
          ampType === 'mA'
            ? parseFloat((calculatedAmps * 1000).toFixed(2))
            : parseFloat(calculatedAmps.toFixed(2));
      } else if (field === 'maxWatts' && volts && amps) {
        updatedDevice.maxWatts = parseFloat((volts * effectiveAmps).toFixed(2));
      }

      updatedDevice.totalWatts =
        updatedDevice.quantity * updatedDevice.maxWatts;
      setDevices((prevDevices) =>
        prevDevices.map((d) => (d.id === device.id ? updatedDevice : d))
      );
    },
    []
  );

  const renderTextField = useCallback(
    (device: Device, field: keyof Device, label: string, tooltip: string) => {
      const isCalculableField =
        field === 'volts' || field === 'amps' || field === 'maxWatts';
      const isNumericField =
        isCalculableField || field === 'quantity' || field === 'estimatedWatts';

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isNumericField) {
          updateDevice(device.id, field, value === '' ? 0 : parseFloat(value));
        } else {
          updateDevice(device.id, field, value);
        }
      };

      const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
      };

      return (
        <Tooltip title={tooltip} placement="top-start">
          <TextField
            label={label}
            type={isNumericField ? 'number' : 'text'}
            value={isNumericField && device[field] === 0 ? '' : device[field]}
            onChange={handleChange}
            onFocus={handleFocus}
            fullWidth
            margin="normal"
            InputLabelProps={{shrink: true}}
            error={
              isCalculableField &&
              shouldShowError(device, field as 'volts' | 'amps' | 'maxWatts')
            }
            InputProps={
              isCalculableField
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        {canCalculateField(
                          device,
                          field as 'volts' | 'amps' | 'maxWatts'
                        ) && (
                          <IconButton
                            onClick={() =>
                              handleCalculateField(
                                device,
                                field as 'volts' | 'amps' | 'maxWatts'
                              )
                            }
                            edge="end"
                            size="small"
                          >
                            <CalculateIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }
                : undefined
            }
          />
        </Tooltip>
      );
    },
    [updateDevice, shouldShowError, canCalculateField, handleCalculateField]
  );

  const handleAmpTypeChange = useCallback(
    (deviceId: string, newAmpType: 'A' | 'mA') => {
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === deviceId) {
            const updatedDevice = {...device, ampType: newAmpType};
            if (newAmpType === 'mA') {
              updatedDevice.amps = updatedDevice.amps * 1000;
            } else {
              updatedDevice.amps = updatedDevice.amps / 1000;
            }
            return validateDevice(updatedDevice);
          }
          return device;
        })
      );
    },
    [validateDevice]
  );

  // New effect to auto-populate Estimated Watts
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    devices.forEach((device) => {
      if (device.maxWatts > 0 && device.estimatedWatts === 0) {
        const timer = setTimeout(() => {
          setDevices((prevDevices) =>
            prevDevices.map((d) =>
              d.id === device.id
                ? {
                    ...d,
                    estimatedWatts: d.maxWatts,
                    totalEstimatedWatts: d.quantity * d.maxWatts,
                  }
                : d
            )
          );
        }, 2000); // 2 second delay

        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [devices]);

  return (
    <Box sx={{mt: 4}}>
      {devices.map((device, index) => (
        <React.Fragment key={device.id}>
          {index > 0 && <Divider sx={{my: 2}} />}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              {renderTextField(
                device,
                'name',
                'Device Name',
                'Enter a descriptive name for the device'
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'quantity',
                'Quantity',
                'Enter the number of identical devices'
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'volts',
                'Volts',
                "The voltage of the device. This is usually specified in the device's manual or on its power supply."
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'amps',
                'Amps/Milliamps',
                "The current draw of the device. This can be in Amps (A) or Milliamps (mA). Make sure to select the correct unit in the 'Amp Type' field."
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="Select whether the current is measured in Amps (A) or Milliamps (mA). 1A = 1000mA."
                placement="top-start"
              >
                <FormControl fullWidth margin="normal">
                  <InputLabel shrink>Amp Type</InputLabel>
                  <Select
                    value={device.ampType}
                    onChange={(e) =>
                      handleAmpTypeChange(
                        device.id,
                        e.target.value as 'A' | 'mA'
                      )
                    }
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="mA">mA</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'maxWatts',
                'Max Watts',
                'The maximum power consumption of the device. If you know this, you can enter it directly. Otherwise, it will be calculated from Volts and Amps.'
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'estimatedWatts',
                'Estimated Watts',
                'Devices may not always use max watts. E.g., a laptop will draw max watts when playing an AAA game, yet far less when browsing social media.'
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'hoursRunPerDay',
                'Hours Run Per Day',
                "How many hours will this device be running in a day? This will help determine battery run time later. Example: An air fryer won't be running 24/7, hopefully..."
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'totalWatts',
                'Total Watts',
                'The total power consumption for this device, calculated by multiplying Max Watts by Quantity.'
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              {renderTextField(
                device,
                'totalEstimatedWatts',
                'Total Est. Watts',
                'The total estimated power consumption for this device, calculated by multiplying Estimated Watts by Quantity.'
              )}
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              {devices.length > 1 && (
                <Tooltip title="Remove device" placement="top">
                  <IconButton
                    onClick={() => removeDevice(device.id)}
                    color="error"
                    aria-label="Remove device"
                  >
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Grid>
            {device.error && (
              <Grid item xs={12}>
                <Typography color="error">{device.error}</Typography>
              </Grid>
            )}
          </Grid>
        </React.Fragment>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={addDevice}
        variant="contained"
        sx={{my: 2}}
      >
        Add Device
      </Button>

      <Box sx={{mt: 1}}>
        <Typography variant="h6" sx={{color: '#FCB1E5'}}>
          Totals
        </Typography>
        <Typography>Max Watts: {totals.totalMaxWatts.toFixed(2)}</Typography>
        <Typography>
          Estimated Watts: {totals.totalEstimatedWatts.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(PowerUsageForm);
