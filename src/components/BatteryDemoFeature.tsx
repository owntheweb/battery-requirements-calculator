import React, {useState, useEffect, useRef} from 'react';
import {Box, Button, Typography} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ScaledDimensions {
  width: number;
  height: number;
}

const BatteryDemoFeature: React.FC = () => {
  const topNavHeight = 64;

  const [scaledDimensions, setScaledDimensions] = useState<ScaledDimensions>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = Math.min(containerRef.current.offsetWidth, 1920);
      const viewportHeight = window.innerHeight;
      const targetAspectRatio = 1920 / 1136;

      let scaledWidth: number;
      let scaledHeight: number;

      if (
        containerWidth / (viewportHeight - topNavHeight) >
        targetAspectRatio
      ) {
        scaledHeight = viewportHeight - topNavHeight;
        scaledWidth = scaledHeight * targetAspectRatio;
      } else {
        scaledWidth = containerWidth;
        scaledHeight = scaledWidth / targetAspectRatio;
      }

      setScaledDimensions({width: scaledWidth, height: scaledHeight});
    }
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleScrollDown = () => {
    const scrollDistance = scaledDimensions.height + topNavHeight;
    window.scrollTo({
      top: scrollDistance,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1920px',
        margin: '0 auto',
        height: `${scaledDimensions.height}px`,
        maxHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            width: `${scaledDimensions.width}px`,
            height: `${scaledDimensions.height}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            backgroundColor: '#3A2350',
          }}
        >
          {/* Add your battery demo content here */}
          <Typography variant="h4">
            Battery Demo Feature {Math.floor(scaledDimensions.width)}x
            {Math.floor(scaledDimensions.height)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<KeyboardArrowDownIcon />}
            onClick={handleScrollDown}
            sx={{
              position: 'absolute',
              bottom: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BatteryDemoFeature;
