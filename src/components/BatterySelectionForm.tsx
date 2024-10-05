import React, { useState, useEffect, useCallback } from 'react';
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
import { BatteryData } from '../model/BatteryData';

interface BatterySelectionFormProps {
  onDataChange: (data: BatteryData) => void;
  importedBatteryData: BatteryData | null;
  importTrigger: boolean;
}

const batteryTypes = [
  'Car Battery',
  'E-Bike Battery Pack',
  '10000 mAh Cell Phone Charger',
  '18650 Li Ion Battery',
  'Custom',
];

const presetBatteryData: { [key: string]: BatteryData } = {
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
    ampHours: 10,
    wattHours: 50,
    chemistry: 0.8,
  },
  '18650 Li Ion Battery': {
    batteryType: '18650 Li Ion Battery',
    volts: 3.6,
    ampHours: 3.2,
    wattHours: 11,
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
  importTrigger,
}) => {
  const [batteryData, setBatteryData] = useState<BatteryData>(
    presetBatteryData['Car Battery']
  );

  useEffect(() => {
    if (importTrigger && importedBatteryData) {
      setBatteryData(importedBatteryData);
    }
  }, [importTrigger, importedBatteryData]);

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

  const renderTextField = useCallback(
    (field: keyof BatteryData, label: string, tooltip: string) => {
      return (
        <Tooltip title={tooltip} placement="top-start">
          <TextField
            label={label}
            type="number"
            value={batteryData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            onFocus={(e) => e.target.select()}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Tooltip>
      );
    },
    [batteryData, handleChange]
  );

  return (
    <Box sx={{ mt: 4 }}>
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
          {renderTextField(
            'volts',
            'Volts',
            'The voltage of the battery. For example, a typical car battery is 12V'
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTextField(
            'ampHours',
            'Amp Hours',
            'The capacity of the battery in Amp-hours. This indicates how many hours the battery can provide a certain amount of current'
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTextField(
            'wattHours',
            'Watt Hours',
            "The energy capacity of the battery in Watt-hours. It's calculated by multiplying Volts and Amp-hours"
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderTextField(
            'chemistry',
            'Chemistry',
            'A value representing the battery chemistry. Different chemistries have different characteristics and use cases'
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BatterySelectionForm;