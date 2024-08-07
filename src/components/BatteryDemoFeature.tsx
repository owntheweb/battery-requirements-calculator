import React, {useState, useEffect, useRef, Fragment} from 'react';
import {Box, Button, ButtonBase, styled, Typography} from '@mui/material';
import ScrollArrow from './ScrollArrow';
import ConnectionLines from './ConnectionLines';
import BatteryComponent from './DemoBattery';

interface ScaledDimensions {
  width: number;
  height: number;
}

interface ImageInfo {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scaledX?: number;
  scaledY?: number;
  scaledWidth?: number;
  scaledHeight?: number;
  label?: string;
}

const BatteryDemoFeature: React.FC = () => {
  const topNavHeight = 64;
  const originalWidth = 1320;
  const originalHeight = 780;

  const [scaledDimensions, setScaledDimensions] = useState<ScaledDimensions>({
    width: 0,
    height: 0,
  });
  const [debug, setDebug] = useState(false);
  const [enabledDevices, setEnabledDevices] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDevice = (deviceName: string) => {
    setEnabledDevices((prev) =>
      prev.includes(deviceName)
        ? prev.filter((d) => d !== deviceName)
        : [...prev, deviceName]
    );
  };

  const [images, setImages] = useState<ImageInfo[]>([
    {
      src: '/images/airFryer.png',
      x: 206,
      y: 594,
      width: 112,
      height: 136,
      label: 'Air Fryer -1500 W',
    },
    {
      src: '/images/alternator.png',
      x: 1064,
      y: 455,
      width: 153,
      height: 156,
      label: 'Alternator +150 W',
    },
    {
      src: '/images/dcToAcConverter.png',
      x: 342,
      y: 437,
      width: 132,
      height: 122,
      label: 'DC to AC -X W',
    },
    {
      src: '/images/fan.png',
      x: 111,
      y: 212,
      width: 129,
      height: 131,
      label: 'Vent Fans -25 W',
    },
    {
      src: '/images/gamingSystem.png',
      x: 84,
      y: 406,
      width: 134,
      height: 132,
      label: 'High End Gaming -250 W',
    },
    {
      src: '/images/ledLight.png',
      x: 246,
      y: 21,
      width: 130,
      height: 139,
      label: 'LED Lights -5 W',
    },
    {
      src: '/images/solarPanel.png',
      x: 1047,
      y: 153,
      width: 176,
      height: 125,
      label: 'Solar Panel +200 W',
    },
  ]);

  const [batteryInfo, setBatteryInfo] = useState<ImageInfo>({
    src: '/images/battery.png',
    x: 551,
    y: 363,
    width: 271,
    height: 110,
    label: '10 Wh Battery (100.00%)',
  });

  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = Math.min(
        containerRef.current.offsetWidth,
        originalWidth
      );
      const viewportHeight = window.innerHeight;
      const targetAspectRatio = originalWidth / originalHeight;

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

      // Update image positions and sizes
      setImages((prevImages) =>
        prevImages.map((img) => {
          return {
            ...img,
            scaledX: (img.x / originalWidth) * scaledWidth,
            scaledY: (img.y / originalHeight) * scaledHeight,
            scaledWidth: (img.width / originalWidth) * scaledWidth,
            scaledHeight: (img.height / originalHeight) * scaledHeight,
          };
        })
      );

      // Update battery position and size
      setBatteryInfo((prevBatteryInfo) => ({
        ...prevBatteryInfo,
        scaledX: (prevBatteryInfo.x / originalWidth) * scaledWidth,
        scaledY: (prevBatteryInfo.y / originalHeight) * scaledHeight,
        scaledWidth: (prevBatteryInfo.width / originalWidth) * scaledWidth,
        scaledHeight: (prevBatteryInfo.height / originalHeight) * scaledHeight,
      }));
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
        maxWidth: `${originalWidth}px`,
        margin: '0 auto',
        height: `${scaledDimensions.height}px`,
        maxHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        display: {
          xs: 'none', // Hide on extra small screens
          sm: 'flex', // Show on small screens and above
        },
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
            paddingBottom: '85px',
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

        <ConnectionLines
          enabledDevices={enabledDevices}
          scaledWidth={scaledDimensions.width}
          scaledHeight={scaledDimensions.height}
        />

        <BatteryComponent
          scaledX={batteryInfo.scaledX}
          scaledY={batteryInfo.scaledY}
          scaledWidth={batteryInfo.scaledWidth}
          scaledHeight={batteryInfo.scaledHeight}
          label={batteryInfo.label!}
        />

        {images.map((img, index) => (
          <Fragment key={img.src}>
            <ButtonBase
              onClick={() =>
                toggleDevice(img.src.split('/').pop()?.split('.')[0] || '')
              }
              sx={{
                position: 'absolute',
                left: img.scaledX,
                top: img.scaledY,
                width: img.scaledWidth,
                height: img.scaledHeight,
                padding: 0,
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <img
                src={process.env.PUBLIC_URL + img.src}
                alt={img.label}
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: enabledDevices.includes(
                    img.src.split('/').pop()?.split('.')[0] || ''
                  )
                    ? 1
                    : 0.5,
                }}
              />
            </ButtonBase>

            {img.scaledWidth &&
              img.scaledHeight &&
              img.scaledX &&
              img.scaledY && (
                <Typography
                  variant="body1"
                  color="white"
                  sx={{
                    position: 'absolute',
                    left: `${img.scaledX + img.scaledWidth * 0.5 - 150}px`,
                    top: {
                      sm: `${img.scaledY + img.scaledHeight + 5}px`,
                      md: `${img.scaledY + img.scaledHeight + 10}px`,
                    },
                    width: '300px',
                    textAlign: 'center',
                    fontSize: {
                      sm: '0.6rem',
                      md: '0.9rem',
                      lg: '1.1rem',
                    },
                    fontFamily: '"Kode Mono", monospace',
                    textShadow:
                      '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                  }}
                >
                  {img.label}
                </Typography>
              )}
          </Fragment>
        ))}

        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          color="primary"
          sx={{
            position: 'absolute',
            left: '0',
            top: '25px',
            width: '100%',
            textAlign: 'center',
            fontSize: {
              sm: '1rem',
              md: '1.5rem',
              lg: '2rem',
            },
          }}
        >
          How Do Devices Affect
          <br />
          Battery Charge?
        </Typography>

        {debug && (
          <Box
            sx={{
              width: `${scaledDimensions.width}px`,
              height: `${scaledDimensions.height}px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Typography
              variant="h4"
              sx={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}
            >
              Battery Demo Feature {Math.floor(scaledDimensions.width)}x
              {Math.floor(scaledDimensions.height)}
            </Typography>
          </Box>
        )}
        <ScrollArrow onClick={handleScrollDown} />
      </Box>
    </Box>
  );
};

export default BatteryDemoFeature;
