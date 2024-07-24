import React, {useState, useEffect, useRef, useCallback} from 'react';
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
} from '@mui/material';
import {Add as AddIcon, Clear as ClearIcon} from '@mui/icons-material';
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
      id: Date.now(),
      name: '',
      quantity: 1,
      volts: 0,
      amps: 0,
      ampType: 'A',
      maxWatts: 0,
      estimatedWatts: 0,
      totalWatts: 0,
      totalEstimatedWatts: 0,
    },
  ]);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastChangeTime = useRef<number>(Date.now());
  const previousDevices = useRef<Device[]>(devices);

  const addDevice = useCallback(() => {
    const lastDevice = devices[devices.length - 1];
    setDevices((prevDevices) => [
      ...prevDevices,
      {
        id: Date.now(),
        name: '',
        quantity: 1,
        volts: 0,
        amps: 0,
        ampType: lastDevice.ampType,
        maxWatts: 0,
        estimatedWatts: 0,
        totalWatts: 0,
        totalEstimatedWatts: 0,
      },
    ]);
    lastChangeTime.current = Date.now();
  }, [devices]);

  const removeDevice = useCallback((id: number) => {
    setDevices((prevDevices) =>
      prevDevices.filter((device) => device.id !== id)
    );
    lastChangeTime.current = Date.now();
  }, []);

  const updateDevice = useCallback(
    (id: number, field: keyof Device, value: string | number) => {
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === id
            ? {
                ...device,
                [field]:
                  field === 'name'
                    ? value
                    : field === 'ampType'
                    ? value
                    : parseFloat(value as string) || 0,
              }
            : device
        )
      );
      lastChangeTime.current = Date.now();
    },
    []
  );

  const calculateDeviceValues = useCallback((device: Device): Device => {
    const updatedDevice = {...device};
    const quantity = device.quantity;
    const volts = device.volts;
    let amps = device.amps;
    amps = device.ampType === 'mA' ? amps * 0.001 : amps;
    const maxWatts = device.maxWatts;
    const estimatedWatts = device.estimatedWatts;

    if (volts && amps) {
      updatedDevice.maxWatts = parseFloat((volts * amps).toFixed(2));
    } else if (volts && maxWatts) {
      updatedDevice.amps = parseFloat(
        ((maxWatts / volts) * (device.ampType === 'mA' ? 1000 : 1)).toFixed(2)
      );
    } else if (amps && maxWatts) {
      updatedDevice.volts = parseFloat((maxWatts / amps).toFixed(2));
    }

    if (quantity && updatedDevice.maxWatts) {
      updatedDevice.totalWatts = parseFloat(
        (quantity * updatedDevice.maxWatts).toFixed(2)
      );
    }

    if (quantity && estimatedWatts) {
      updatedDevice.totalEstimatedWatts = parseFloat(
        (quantity * estimatedWatts).toFixed(2)
      );
    }

    return updatedDevice;
  }, []);

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

  // check if device is fully filled out before triggering an onDataChange call, less noise
  const isDeviceValid = useCallback((device: Device): boolean => {
    return (
      device.quantity > 0 &&
      ((device.volts > 0 && device.amps > 0) ||
        (device.volts > 0 && device.maxWatts > 0) ||
        (device.amps > 0 && device.maxWatts > 0))
    );
  }, []);

  const calculateAndUpdate = useCallback(() => {
    const calculatedDevices = devices.map(calculateDeviceValues);
    const validDevices = calculatedDevices.filter(isDeviceValid);

    if (validDevices.length > 0) {
      const totals = calculateTotals(validDevices);
      onDataChange(validDevices, totals);
    }

    setDevices(calculatedDevices);
    previousDevices.current = calculatedDevices;
  }, [
    devices,
    calculateDeviceValues,
    calculateTotals,
    isDeviceValid,
    onDataChange,
  ]);

  useEffect(() => {
    const hasDevicesChanged =
      JSON.stringify(devices) !== JSON.stringify(previousDevices.current);

    if (hasDevicesChanged) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        calculateAndUpdate();
      }, 500);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [devices, calculateAndUpdate]);

  return (
    <Box sx={{mt: 4}}>
      {devices.map((device, index) => (
        <React.Fragment key={device.id}>
          {index > 0 && <Divider sx={{my: 2}} />}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Tooltip
                title="Enter a descriptive name for the device"
                placement="top-start"
              >
                <TextField
                  label="Device Name"
                  value={device.name}
                  onChange={(e) =>
                    updateDevice(device.id, 'name', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="Enter the number of identical devices"
                placement="top-start"
              >
                <TextField
                  label="Quantity"
                  type="number"
                  value={device.quantity || ''}
                  onChange={(e) =>
                    updateDevice(device.id, 'quantity', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="The voltage of the device. This is usually specified in the device's manual or on its power supply."
                placement="top-start"
              >
                <TextField
                  label="Volts"
                  type="number"
                  value={device.volts || ''}
                  onChange={(e) =>
                    updateDevice(device.id, 'volts', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="The current draw of the device. This can be in Amps (A) or Milliamps (mA). Make sure to select the correct unit in the 'Amp Type' field."
                placement="top-start"
              >
                <TextField
                  label="Amps/Milliamps"
                  type="number"
                  value={device.amps || ''}
                  onChange={(e) =>
                    updateDevice(device.id, 'amps', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
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
                      updateDevice(
                        device.id,
                        'ampType',
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
              <Tooltip
                title="The maximum power consumption of the device. If you know this, you can enter it directly. Otherwise, it will be calculated from Volts and Amps."
                placement="top-start"
              >
                <TextField
                  label="Max Watts"
                  type="number"
                  value={device.maxWatts || ''}
                  onChange={(e) =>
                    updateDevice(device.id, 'maxWatts', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="Devices may not always use max watts. E.g., a laptop will draw max watts when playing an AAA game, yet far less when browsing social media."
                placement="top-start"
              >
                <TextField
                  label="Estimated Watts"
                  type="number"
                  value={device.estimatedWatts || ''}
                  onChange={(e) =>
                    updateDevice(device.id, 'estimatedWatts', e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="The total power consumption for this device, calculated by multiplying Max Watts by Quantity."
                placement="top-start"
              >
                <TextField
                  label="Total Watts"
                  type="number"
                  value={device.totalWatts || ''}
                  disabled
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Tooltip
                title="The total estimated power consumption for this device, calculated by multiplying Estimated Watts by Quantity."
                placement="top-start"
              >
                <TextField
                  label="Total Est. Watts"
                  type="number"
                  value={device.totalEstimatedWatts || ''}
                  disabled
                  fullWidth
                  margin="normal"
                  InputLabelProps={{shrink: true}}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              {devices.length > 1 && (
                <IconButton
                  onClick={() => removeDevice(device.id)}
                  color="error"
                  aria-label="Remove device"
                >
                  <ClearIcon />
                </IconButton>
              )}
            </Grid>
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

        <Typography>
          Max Watts: {calculateTotals(devices).totalMaxWatts.toFixed(2)}
        </Typography>

        <Typography>
          Estimated Watts:{' '}
          {calculateTotals(devices).totalEstimatedWatts.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PowerUsageForm;
