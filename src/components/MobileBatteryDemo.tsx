import React from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import BatteryComponent, {ChargeState} from './DemoBattery';

interface MobileBatteryDemoProps {
  batteryCharge: number;
  chargeState: ChargeState;
  enabledDevices: string[];
  toggleDevice: (device: string) => void;
  images: ImageInfo[];
  batteryInfo: ImageInfo;
}

interface ImageInfo {
  src: string;
  label?: string;
}

const MobileBatteryDemo: React.FC<MobileBatteryDemoProps> = ({
  batteryCharge,
  chargeState,
  enabledDevices,
  toggleDevice,
  images,
  batteryInfo,
}) => {
  const theme = useTheme();

  let chargeStateLabel = '(small Wh battery for demo)';
  if (chargeState === ChargeState.DEPLETING) {
    chargeStateLabel = 'Depleting...';
  } else if (chargeState === ChargeState.EMPTY) {
    chargeStateLabel = 'Depleted! 😱';
  } else if (chargeState === ChargeState.CHARGING) {
    chargeStateLabel = 'Charging...';
  }

  const chargingDevices = ['solarPanel', 'alternator'];

  return (
    <Box sx={{position: 'relative'}}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '350px',
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/vanBackground768.webp)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
        }}
      />

      <Box sx={{position: 'relative', p: 2}}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          How Do Devices Affect Battery Charge?
        </Typography>

        <Box sx={{mb: 4, mt: 2, position: 'relative', height: 200}}>
          <Typography
            variant="body1"
            align="center"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              color:
                chargeState === ChargeState.CHARGING
                  ? theme.palette.connection.charging
                  : theme.palette.connection.discharging,
              fontFamily: '"Kode Mono", monospace',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {chargeStateLabel}
          </Typography>

          <Box
            sx={{
              position: 'absolute',
              top: 37,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <BatteryComponent
              scaledWidth={300}
              scaledHeight={122}
              label=""
              fontScaleFactor={1}
              chargeState={chargeState}
              chargeAmount={batteryCharge}
            />
          </Box>

          <Typography
            variant="body1"
            align="center"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              color: 'white',
              fontFamily: '"Kode Mono", monospace',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {batteryInfo.label} ({batteryCharge.toFixed(2)}%)
          </Typography>
        </Box>

        <Typography
          variant="h6"
          gutterBottom
          sx={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}
        >
          Toggle Devices:
        </Typography>

        <ToggleButtonGroup
          orientation="vertical"
          value={enabledDevices}
          onChange={(event, newDevices) => {
            const changedDevice =
              newDevices.find(
                (device: string) => !enabledDevices.includes(device)
              ) ||
              enabledDevices.find((device) => !newDevices.includes(device));
            if (changedDevice) {
              toggleDevice(changedDevice);
            }
          }}
          sx={{width: '100%'}}
        >
          {images.map((img) => {
            const deviceName = img.src.split('/').pop()?.split('.')[0] || '';
            const isChargingDevice = chargingDevices.includes(deviceName);
            const isEnabled = enabledDevices.includes(deviceName);
            return (
              <ToggleButton
                key={deviceName}
                value={deviceName}
                selected={isEnabled}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  py: 1,
                  backgroundColor: isEnabled
                    ? isChargingDevice
                      ? theme.palette.connection.charging
                      : theme.palette.connection.discharging
                    : 'rgba(0, 0, 0, 0.5)',
                  border: `2px solid ${
                    isEnabled
                      ? isChargingDevice
                        ? theme.palette.connection.charging
                        : theme.palette.connection.discharging
                      : theme.palette.action.disabled
                  }`,
                  '&.Mui-selected': {
                    backgroundColor: isChargingDevice
                      ? theme.palette.connection.charging
                      : theme.palette.connection.discharging,
                    '&:hover': {
                      backgroundColor: isChargingDevice
                        ? theme.palette.connection.charging
                        : theme.palette.connection.discharging,
                      opacity: 0.8,
                    },
                  },
                  '&:hover': {
                    backgroundColor: isEnabled
                      ? isChargingDevice
                        ? theme.palette.connection.charging
                        : theme.palette.connection.discharging
                      : 'rgba(255, 255, 255, 0.1)',
                    opacity: isEnabled ? 0.8 : 1,
                  },
                  color: isEnabled
                    ? theme.palette.background.default
                    : theme.palette.text.primary,
                  '& .MuiTypography-root': {
                    color: isEnabled
                      ? theme.palette.background.default
                      : theme.palette.text.primary,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <img
                  src={process.env.PUBLIC_URL + img.src}
                  alt={img.label}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 16,
                    filter: isEnabled
                      ? 'brightness(1.2)'
                      : 'grayscale(0.5) brightness(0.8)',
                    transition: 'all 0.3s ease',
                  }}
                />
                <Typography>{img.label}</Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default MobileBatteryDemo;
