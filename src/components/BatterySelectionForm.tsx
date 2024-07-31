import React, {useState, useEffect, useCallback} from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Tooltip,
} from '@mui/material';
import {BatteryData} from '../model/BatteryData';

interface BatterySelectionFormProps {
  onDataChange: (data: BatteryData) => void;
  importedBatteryData?: BatteryData;
}

const batteryTypes = [
  'Car Battery',
  'E-Bike Battery Pack',
  '10000 mAh Cell Phone Charger',
  'Custom',
];

const presetBatteryData: {[key: string]: BatteryData} = {
  'Car Battery': {
    batteryType: 'Car Battery',
    volts: 13.5,
    ampHours: 100,
    wattHours: 1350,
    chemistry: 0.5,
  },
  'E-Bike Battery Pack': {
    batteryType: 'E-Bike Battery Pack',
    volts: 37,
    ampHours: 14.25,
    wattHours: 527.25,
    chemistry: 0.8,
  },
  '10000 mAh Cell Phone Charger': {
    batteryType: '10000 mAh Cell Phone Charger',
    volts: 5,
    ampHours: 20,
    wattHours: 100,
    chemistry: 0.8,
  },
  Custom: {
    batteryType: 'Custom',
    volts: 0,
    ampHours: 0,
    wattHours: 0,
    chemistry: 0,
  },
};

const BatterySelectionForm: React.FC<BatterySelectionFormProps> = ({
  onDataChange,
  importedBatteryData,
}) => {
  const [batteryData, setBatteryData] = useState<BatteryData>(
    presetBatteryData['Car Battery']
  );

  useEffect(() => {
    if (importedBatteryData) {
      setBatteryData(importedBatteryData);
    }
  }, [importedBatteryData]);

  const handleChange = useCallback(
    (field: keyof BatteryData, value: string | number) => {
      setBatteryData((prevData) => {
        const newData = {
          ...prevData,
          [field]: field === 'batteryType' ? value : Number(value),
        };

        if (field !== 'batteryType' && newData.batteryType !== 'Custom') {
          newData.batteryType = 'Custom';
        }

        return newData;
      });
    },
    []
  );

  useEffect(() => {
    if (batteryData.batteryType !== 'Custom') {
      setBatteryData(presetBatteryData[batteryData.batteryType]);
    }
  }, [batteryData.batteryType]);

  useEffect(() => {
    const isDataChanged = Object.keys(batteryData).some(
      (key) => batteryData[key as keyof BatteryData] !== 0
    );
    if (isDataChanged) {
      onDataChange(batteryData);
    }
  }, [batteryData, onDataChange]);

  return (
    <Box sx={{mt: 4}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Tooltip
            title="Select a predefined battery type or choose 'Custom' to enter your own values"
            placement="top-start"
          >
            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Battery Type</InputLabel>
              <Select
                value={batteryData.batteryType}
                onChange={(e) => handleChange('batteryType', e.target.value)}
                displayEmpty
              >
                {batteryTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip
            title="The voltage of the battery. For example, a typical car battery is 12V"
            placement="top-start"
          >
            <TextField
              label="Volts"
              type="number"
              value={batteryData.volts || ''}
              onChange={(e) => handleChange('volts', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{shrink: true}}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip
            title="The capacity of the battery in Amp-hours. This indicates how many hours the battery can provide a certain amount of current"
            placement="top-start"
          >
            <TextField
              label="Amp Hours"
              type="number"
              value={batteryData.ampHours || ''}
              onChange={(e) => handleChange('ampHours', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{shrink: true}}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip
            title="The energy capacity of the battery in Watt-hours. It's calculated by multiplying Volts and Amp-hours"
            placement="top-start"
          >
            <TextField
              label="Watt Hours"
              type="number"
              value={batteryData.wattHours || ''}
              onChange={(e) => handleChange('wattHours', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{shrink: true}}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip
            title="A value representing the battery chemistry. Different chemistries have different characteristics and use cases"
            placement="top-start"
          >
            <TextField
              label="Chemistry"
              type="number"
              value={batteryData.chemistry || ''}
              onChange={(e) => handleChange('chemistry', e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{shrink: true}}
            />
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BatterySelectionForm;
