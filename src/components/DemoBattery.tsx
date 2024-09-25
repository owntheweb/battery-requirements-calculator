import React from 'react';
import {Box, Typography} from '@mui/material';

interface BatteryComponentProps {
  scaledX?: number;
  scaledY?: number;
  scaledWidth?: number;
  scaledHeight?: number;
  label: string;
  fontScaleFactor: number;
  chargeState: ChargeState;
  chargeAmount: number;
}

export enum ChargeState {
  CHARGING = 'charging',
  DEPLETING = 'depleting',
  FULL = 'full',
  EMPTY = 'empty',
}

const BatteryComponent: React.FC<BatteryComponentProps> = ({
  scaledX,
  scaledY,
  scaledWidth,
  scaledHeight,
  label,
  fontScaleFactor,
  chargeState,
  chargeAmount,
}) => {
  const originalBatteryWidth = 84;
  const originalBatteryHeight = 34;
  const originalBarStartX = 5;
  const originalBarStartY = 7;
  const originalBarEndX = 54;
  const originalBarHeight = 21;

  const scaleFactor = scaledWidth ? scaledWidth / originalBatteryWidth : 1;

  const barStartX = originalBarStartX * scaleFactor;
  const barStartY = originalBarStartY * scaleFactor;
  const barMaxWidth = (originalBarEndX - originalBarStartX) * scaleFactor;
  const barHeight = originalBarHeight * scaleFactor;
  const barWidth = (barMaxWidth * chargeAmount) / 100;

  let chargeStateLabelColor = '#FFF';
  if (
    chargeState === ChargeState.DEPLETING ||
    chargeState === ChargeState.EMPTY
  ) {
    chargeStateLabelColor = 'rgb(252,177,229)';
  } else if (chargeState === ChargeState.CHARGING) {
    chargeStateLabelColor = 'rgb(252,177,229)';
  }

  let chargeStateLabel = '(small Wh battery for demo)';
  if (chargeState === ChargeState.DEPLETING) {
    chargeStateLabel = 'Depleting...';
  } else if (chargeState === ChargeState.EMPTY) {
    chargeStateLabel = 'Depleted! 😱';
  } else if (chargeState === ChargeState.CHARGING) {
    chargeStateLabel = 'Charging...';
  }

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          left: scaledX,
          top: scaledY,
          width: scaledWidth,
          height: scaledHeight,
        }}
      >
        <img
          src={
            process.env.PUBLIC_URL +
            (chargeAmount > 0
              ? '/images/batteryHasCharge.png'
              : '/images/batteryEmpty.png')
          }
          alt="Battery"
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated',
          }}
        />
        {chargeAmount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: `${barStartX}px`,
              top: `${barStartY}px`,
              width: `${barWidth}px`,
              height: `${barHeight}px`,
              backgroundImage: `url(${process.env.PUBLIC_URL}/images/batteryBar.png)`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: `${scaleFactor}px ${barHeight}px`,
            }}
          />
        )}
      </Box>
      {scaledWidth && scaledHeight && scaledX && scaledY && (
        <>
          <Typography
            variant="body1"
            color={chargeStateLabelColor}
            sx={{
              position: 'absolute',
              left: `${scaledX + scaledWidth * 0.5 - 150}px`,
              top: `${scaledY - 30 * fontScaleFactor}px`,
              width: '300px',
              textAlign: 'center',
              fontSize: `${0.9 * fontScaleFactor}rem`,
              fontFamily: '"Kode Mono", monospace',
              textShadow:
                '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
            }}
          >
            {chargeStateLabel}
          </Typography>

          <Typography
            variant="body1"
            color="white"
            sx={{
              position: 'absolute',
              left: `${scaledX + scaledWidth * 0.5 - 150}px`,
              top: `${scaledY + scaledHeight + 10 * fontScaleFactor}px`,
              width: '300px',
              textAlign: 'center',
              fontSize: `${0.9 * fontScaleFactor}rem`,
              fontFamily: '"Kode Mono", monospace',
              textShadow:
                '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
            }}
          >
            {label} ({chargeAmount.toFixed(2)}%)
          </Typography>
        </>
      )}
    </>
  );
};

export default BatteryComponent;
