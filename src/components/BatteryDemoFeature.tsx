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
      const targetAspectRatio = 1920 / 973;

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
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/images/vanBackground1920.webp'}
            srcSet={`
              ${process.env.PUBLIC_URL}/images/vanBackground768.webp 768w,
              ${process.env.PUBLIC_URL}/images/vanBackground1000.webp 1000w,
              ${process.env.PUBLIC_URL}/images/vanBackground1920.webp 1920w
            `}
            sizes="(max-width: 768px) 768px,
                   (max-width: 1000px) 1000px,
                   1920px"
            alt="Van Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </Box>
        <Box
          sx={{
            width: `${scaledDimensions.width}px`,
            height: `${scaledDimensions.height}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}
          >
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
          >
            TEMP Scroll Down
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BatteryDemoFeature;
