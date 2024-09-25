import React, {useState} from 'react';
import {ButtonBase} from '@mui/material';

interface ScrollArrowProps {
  onClick: () => void;
  scaleFactor: number;
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({onClick, scaleFactor}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Original dimensions
  const originalWidth = 44;
  const originalHeight = 26;

  // Scaled dimensions
  const scaledWidth = originalWidth * scaleFactor;
  const scaledHeight = originalHeight * scaleFactor;

  return (
    <ButtonBase
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'absolute',
        bottom: '5%',
        right: '7%',
        transform: 'translateX(-50%)',
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`,
        padding: 0,
        backgroundColor: 'transparent',
        transition: 'filter 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <img
        src={process.env.PUBLIC_URL + '/images/eightBitArrow.png'}
        alt="Scroll Down"
        style={{
          width: '100%',
          height: '100%',
          filter: isHovered ? 'brightness(0) invert(1)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        }}
      />
    </ButtonBase>
  );
};

export default ScrollArrow;
