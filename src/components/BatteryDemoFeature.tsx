import React, {useState, useEffect, useRef, Fragment, useCallback} from 'react';
import {Box, Button, ButtonBase, styled, Typography} from '@mui/material';
import ScrollArrow from './ScrollArrow';
import ConnectionLines from './ConnectionLines';
import BatteryComponent, {ChargeState} from './DemoBattery';

interface ScaledDimensions {
  width: number;
  height: number;
  fontScaleFactor: number;
  offsetX: number;
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

interface DevicePower {
  [key: string]: number;
}

const BatteryDemoFeature: React.FC = () => {
  const topNavHeight = 64;
  const originalWidth = 1320;
  const originalHeight = 780;

  const [scaledDimensions, setScaledDimensions] = useState<ScaledDimensions>({
    width: 0,
    height: 0,
    fontScaleFactor: 1,
    offsetX: 0,
  });
  const [debug, setDebug] = useState(false);
  const [enabledDevices, setEnabledDevices] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [batteryCharge, setBatteryCharge] = useState(100);
  const [chargeState, setChargeState] = useState(ChargeState.FULL);
  const [dcToAcLabel, setDcToAcLabel] = useState('DC to AC -0 W (90% eff.)');

  const batteryCapacity = 5; // Wh
  const dcToAcEfficiency = 0.9; // % efficiency
  const updateInterval = 50; // ms

  const toggleDevice = (deviceName: string) => {
    setEnabledDevices((prev) => {
      const newEnabledDevices = [...prev];
      const deviceIndex = newEnabledDevices.indexOf(deviceName);

      if (deviceName === 'dcToAcConverter') {
        // Check if any dependent devices are enabled
        const anyDependentEnabled = dcDependentDevices.some((device) =>
          newEnabledDevices.includes(device)
        );
        if (anyDependentEnabled) {
          // Can't disable DC to AC converter if dependent devices are enabled
          return newEnabledDevices;
        }
        // Toggle DC to AC converter
        if (deviceIndex === -1) {
          newEnabledDevices.push(deviceName);
        } else {
          newEnabledDevices.splice(deviceIndex, 1);
        }
      } else if (dcDependentDevices.includes(deviceName)) {
        if (deviceIndex === -1) {
          // Enabling a dependent device
          newEnabledDevices.push(deviceName);
          if (!newEnabledDevices.includes('dcToAcConverter')) {
            newEnabledDevices.push('dcToAcConverter');
          }
        } else {
          // Disabling a dependent device
          newEnabledDevices.splice(deviceIndex, 1);
          // Check if any other dependent devices are still enabled
          const otherDependentEnabled = dcDependentDevices.some(
            (device) =>
              device !== deviceName && newEnabledDevices.includes(device)
          );
          if (!otherDependentEnabled) {
            const dcConverterIndex =
              newEnabledDevices.indexOf('dcToAcConverter');
            if (dcConverterIndex !== -1) {
              newEnabledDevices.splice(dcConverterIndex, 1);
            }
          }
        }
      } else {
        // Toggle other devices normally
        if (deviceIndex === -1) {
          newEnabledDevices.push(deviceName);
        } else {
          newEnabledDevices.splice(deviceIndex, 1);
        }
      }

      return newEnabledDevices;
    });
  };

  const dcDependentDevices = ['airFryer', 'gamingSystem'];
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
      label: dcToAcLabel,
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
    src: '/images/batteryHasCharge.png',
    x: 551,
    y: 363,
    width: 271,
    height: 110,
    label: '5 Wh Battery',
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

      // Calculate font scale factor based on height
      const fontScaleFactor = (scaledHeight / originalHeight) * 1.1;

      // Calculate the offset to center the content
      const offsetX = (containerWidth - scaledWidth) / 2;

      setScaledDimensions({
        width: scaledWidth,
        height: scaledHeight,
        fontScaleFactor,
        offsetX,
      });

      // Update image positions and sizes
      setImages((prevImages) =>
        prevImages.map((img) => {
          const scaledX = (img.x / originalWidth) * scaledWidth;
          const scaledY = (img.y / originalHeight) * scaledHeight;
          return {
            ...img,
            scaledX: scaledX + offsetX,
            scaledY: scaledY,
            scaledWidth: (img.width / originalWidth) * scaledWidth,
            scaledHeight: (img.height / originalHeight) * scaledHeight,
          };
        })
      );

      // Update battery position and size
      setBatteryInfo((prevBatteryInfo) => {
        const scaledX = (prevBatteryInfo.x / originalWidth) * scaledWidth;
        const scaledY = (prevBatteryInfo.y / originalHeight) * scaledHeight;
        return {
          ...prevBatteryInfo,
          scaledX: scaledX + offsetX,
          scaledY: scaledY,
          scaledWidth: (prevBatteryInfo.width / originalWidth) * scaledWidth,
          scaledHeight:
            (prevBatteryInfo.height / originalHeight) * scaledHeight,
        };
      });
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

  const calculateDcToAcPower = useCallback(
    (enabledDevices: string[], devicePower: DevicePower) => {
      const acDevices = ['airFryer', 'gamingSystem'];
      const connectedACDevices = enabledDevices.filter((d) =>
        acDevices.includes(d)
      );
      if (connectedACDevices.length > 0) {
        const acPowerConsumption = connectedACDevices.reduce(
          (sum, d) => sum + Math.abs(devicePower[d]),
          0
        );
        return acPowerConsumption * (1 - dcToAcEfficiency);
      }
      return 0;
    },
    [dcToAcEfficiency]
  );

  useEffect(() => {
    const devicePower: DevicePower = {
      airFryer: -1500,
      alternator: 150,
      fan: -25,
      gamingSystem: -250,
      ledLight: -5,
      solarPanel: 200,
      dcToAcConverter: 0, // Base power consumption
    };

    const interval = setInterval(() => {
      const dcToAcPower = calculateDcToAcPower(enabledDevices, devicePower);
      const newDcToAcLabel = `DC to AC -${Math.round(
        dcToAcPower
      )} W (90% eff.)`;
      setDcToAcLabel(newDcToAcLabel);

      // update label in array
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.src.includes('dcToAcConverter')
            ? {...img, label: newDcToAcLabel}
            : img
        )
      );

      setBatteryCharge((prevCharge) => {
        let totalPowerChange = 0;

        enabledDevices.forEach((device) => {
          let devicePowerConsumption = devicePower[device] || 0;

          // Special handling for DC to AC converter
          if (device === 'dcToAcConverter') {
            devicePowerConsumption = -dcToAcPower;
          }

          totalPowerChange += devicePowerConsumption;
        });

        // Convert power change from watts to watt-hours for the update interval
        const energyChange =
          (totalPowerChange / 3600) * (updateInterval / 1000); // Wh per interval
        const newChargeWh = (prevCharge / 100) * batteryCapacity + energyChange;
        const newChargePercentage = (newChargeWh / batteryCapacity) * 100;

        // Clamp the new charge between 0 and 100
        const clampedCharge = Math.max(0, Math.min(100, newChargePercentage));

        // Update charge state
        if (clampedCharge > prevCharge) {
          setChargeState(ChargeState.CHARGING);
        } else if (clampedCharge < prevCharge) {
          setChargeState(ChargeState.DEPLETING);
        } else if (clampedCharge === 100) {
          setChargeState(ChargeState.FULL);
        } else if (clampedCharge === 0) {
          setChargeState(ChargeState.EMPTY);
        }

        return clampedCharge;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [enabledDevices]);

  return (
    <Box
      ref={containerRef}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: `${originalWidth}px`,
          margin: '0 auto',
          height: `${scaledDimensions.height}px`,
          maxHeight: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          display: scaledDimensions.fontScaleFactor >= 0.5 ? 'flex' : 'none',
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
            fontSize: `${1.5 * scaledDimensions.fontScaleFactor}rem`,
          }}
        >
          How Do Devices Affect
          <br />
          Battery Charge?
        </Typography>

        <ConnectionLines
          enabledDevices={enabledDevices}
          scaledWidth={scaledDimensions.width}
          scaledHeight={scaledDimensions.height}
          offsetX={scaledDimensions.offsetX}
        />

        <BatteryComponent
          scaledX={batteryInfo.scaledX}
          scaledY={batteryInfo.scaledY}
          scaledWidth={batteryInfo.scaledWidth}
          scaledHeight={batteryInfo.scaledHeight}
          label={batteryInfo.label!}
          fontScaleFactor={scaledDimensions.fontScaleFactor}
          chargeState={chargeState}
          chargeAmount={batteryCharge}
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
                    width: '300px',
                    textAlign: 'center',
                    fontSize: `${scaledDimensions.fontScaleFactor}rem`,
                    top: `${
                      img.scaledY +
                      img.scaledHeight +
                      10 * scaledDimensions.fontScaleFactor
                    }px`,
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
        <ScrollArrow
          onClick={handleScrollDown}
          scaleFactor={scaledDimensions.fontScaleFactor}
        />
      </Box>
    </Box>
  );
};

export default BatteryDemoFeature;
