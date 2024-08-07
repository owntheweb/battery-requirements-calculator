import React, {useEffect, useRef} from 'react';

interface LineConfig {
  id: string;
  path: string;
  strokeWidth: string;
  strokeDasharray: string;
}

interface ConnectionLinesProps {
  enabledDevices: string[];
  scaledWidth: number;
  scaledHeight: number;
}

const lineConfigs: LineConfig[] = [
  {
    id: 'junctionToBattery',
    path: 'M80.219,268.282L254.929,268.282',
    strokeWidth: '11.99px',
    strokeDasharray: '16.91,16.91',
  },
  {
    id: 'solarToJunction',
    path: 'M254.929,268.282L254.929,0L376.32,0',
    strokeWidth: '12.38px',
    strokeDasharray: '17.46,17.46',
  },
  {
    id: 'alternatorToJunction',
    path: 'M2548.56,1123.81L2548.56,1446.76L2804.19,1446.76',
    strokeWidth: '22.68px',
    strokeDasharray: '32,32',
  },
  {
    id: 'batteryToLowVolt',
    path: 'M0,0L373.396,0L373.396,194.222L429.207,194.222',
    strokeWidth: '13.78px',
    strokeDasharray: '19.33,19.33',
  },
  {
    id: 'batteryToDcAc',
    path: 'M1371.21,1113.8L1371.21,1303.35L1267.75,1303.35',
    strokeWidth: '22.68px',
    strokeDasharray: '31.82,31.82',
  },
  {
    id: 'junctionToFan',
    path: 'M835.336,757.888L656.191,757.888',
    strokeWidth: '22.68px',
    strokeDasharray: '31.82,31.82',
  },
  {
    id: 'junctionToLight',
    path: 'M-53.361,-53.361L53.361,-53.361',
    strokeWidth: '12.38px',
    strokeDasharray: '17.46,17.46',
  },
  {
    id: 'dcAcToGaming',
    path: 'M883.45,1320.54L583.006,1320.54',
    strokeWidth: '22.68px',
    strokeDasharray: '31.82,31.82',
  },
  {
    id: 'dcAcToAirFryer',
    path: 'M1047.01,1604.98L1047.01,1757.87L876.339,1757.87',
    strokeWidth: '22.68px',
    strokeDasharray: '31.82,31.82',
  },
];

const deviceLineMap: {[key: string]: string[]} = {
  airFryer: ['batteryToDcAc', 'dcAcToAirFryer'],
  alternator: ['junctionToBattery', 'alternatorToJunction'],
  dcToAcConverter: ['batteryToDcAc'],
  fan: ['batteryToLowVolt', 'junctionToFan'],
  gamingSystem: ['batteryToDcAc', 'dcAcToGaming'],
  ledLight: ['batteryToLowVolt', 'junctionToLight'],
  solarPanel: ['junctionToBattery', 'solarToJunction'],
};

const reversedLines = new Set([
  'junctionToBattery',
  'solarToJunction',
  'alternatorToJunction',
  'batteryToLowVolt',
  'junctionTo',
]);

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  enabledDevices,
  scaledWidth,
  scaledHeight,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const animateLines = () => {
      lineConfigs.forEach((config) => {
        const path = svg.getElementById(config.id) as SVGPathElement | null;
        if (path) {
          const isEnabled = enabledDevices.some((device) =>
            deviceLineMap[device]?.includes(config.id)
          );
          path.style.display = isEnabled ? 'block' : 'none';

          if (isEnabled) {
            const dashArray = config.strokeDasharray.split(',').map(Number);
            const totalLength = dashArray.reduce((a, b) => a + b, 0);
            const animationDuration = 1; // seconds
            const isReversed = reversedLines.has(config.id);

            path.style.strokeDashoffset = isReversed ? `-${totalLength}` : '0';
            path.animate(
              [
                {strokeDashoffset: isReversed ? `-${totalLength}` : '0'},
                {strokeDashoffset: isReversed ? '0' : `-${totalLength}`},
              ],
              {
                duration: animationDuration * 1000,
                iterations: Infinity,
                easing: 'linear',
              }
            );
          }
        }
      });
    };

    animateLines();
  }, [enabledDevices]);

  return (
    <svg
      ref={svgRef}
      width={scaledWidth}
      height={scaledHeight}
      style={{position: 'absolute', top: 0, left: 0}}
      viewBox="0 0 3520 2080"
    >
      <g
        id="junctionToBattery"
        transform="matrix(1.94949,5.65138e-15,5.65138e-15,1.83247,2051.58,632.188)"
      >
        <path
          d={lineConfigs[0].path}
          style={{
            fill: 'none',
            fillRule: 'nonzero',
            stroke: 'rgb(102,255,251)',
            strokeWidth: lineConfigs[0].strokeWidth,
            strokeDasharray: lineConfigs[0].strokeDasharray,
          }}
        />
      </g>
      <g
        id="solarToJunction"
        transform="matrix(1.83247,0,0,1.83247,2081.41,632.188)"
      >
        <path
          d={lineConfigs[1].path}
          style={{
            fill: 'none',
            fillRule: 'nonzero',
            stroke: 'rgb(102,255,251)',
            strokeWidth: lineConfigs[1].strokeWidth,
            strokeDasharray: lineConfigs[1].strokeDasharray,
          }}
        />
      </g>
      <path
        id="alternatorToJunction"
        d={lineConfigs[2].path}
        style={{
          fill: 'none',
          fillRule: 'nonzero',
          stroke: 'rgb(102,255,251)',
          strokeWidth: lineConfigs[2].strokeWidth,
          strokeDasharray: lineConfigs[2].strokeDasharray,
        }}
      />
      <g
        id="batteryToLowVolt"
        transform="matrix(1.43513,0,0,1.83247,835.336,757.888)"
      >
        <path
          d={lineConfigs[3].path}
          style={{
            fill: 'none',
            fillRule: 'nonzero',
            stroke: 'rgb(252,177,229)',
            strokeWidth: lineConfigs[3].strokeWidth,
            strokeDasharray: lineConfigs[3].strokeDasharray,
          }}
        />
      </g>
      <path
        id="batteryToDcAc"
        d={lineConfigs[4].path}
        style={{
          fill: 'none',
          fillRule: 'nonzero',
          stroke: 'rgb(252,177,229)',
          strokeWidth: lineConfigs[4].strokeWidth,
          strokeDasharray: lineConfigs[4].strokeDasharray,
        }}
      />
      <path
        id="junctionToFan"
        d={lineConfigs[5].path}
        style={{
          fill: 'none',
          fillRule: 'nonzero',
          stroke: 'rgb(252,177,229)',
          strokeWidth: lineConfigs[5].strokeWidth,
          strokeDasharray: lineConfigs[5].strokeDasharray,
        }}
      />
      <g
        id="junctionToLight"
        transform="matrix(0,1.83247,1.83247,0,933.634,660.105)"
      >
        <path
          d={lineConfigs[6].path}
          style={{
            fill: 'none',
            fillRule: 'nonzero',
            stroke: 'rgb(252,177,229)',
            strokeWidth: lineConfigs[6].strokeWidth,
            strokeDasharray: lineConfigs[6].strokeDasharray,
          }}
        />
      </g>
      <path
        id="dcAcToGaming"
        d={lineConfigs[7].path}
        style={{
          fill: 'none',
          fillRule: 'nonzero',
          stroke: 'rgb(252,177,229)',
          strokeWidth: lineConfigs[7].strokeWidth,
          strokeDasharray: lineConfigs[7].strokeDasharray,
        }}
      />
      <path
        id="dcAcToAirFryer"
        d={lineConfigs[8].path}
        style={{
          fill: 'none',
          fillRule: 'nonzero',
          stroke: 'rgb(252,177,229)',
          strokeWidth: lineConfigs[8].strokeWidth,
          strokeDasharray: lineConfigs[8].strokeDasharray,
        }}
      />
    </svg>
  );
};

export default ConnectionLines;
