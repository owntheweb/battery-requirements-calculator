import React from 'react';
import {Box, Typography} from '@mui/material';

interface BatteryComponentProps {
  scaledX?: number;
  scaledY?: number;
  scaledWidth?: number;
  scaledHeight?: number;
  label: string;
  fontScaleFactor: number;
}

const BatteryComponent: React.FC<BatteryComponentProps> = ({
  scaledX,
  scaledY,
  scaledWidth,
  scaledHeight,
  label,
  fontScaleFactor,
}) => {
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
          src={process.env.PUBLIC_URL + '/images/battery.png'}
          alt="Battery"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      {scaledWidth && scaledHeight && scaledX && scaledY && (
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
          {label}
        </Typography>
      )}
    </>
  );
};

export default BatteryComponent;
