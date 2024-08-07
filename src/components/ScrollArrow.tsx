import React, {useState} from 'react';
import {ButtonBase} from '@mui/material';

interface ScrollArrowProps {
  onClick: () => void;
}

const ScrollArrow: React.FC<ScrollArrowProps> = ({onClick}) => {
  const [isHovered, setIsHovered] = useState(false);

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
        width: '44px',
        height: '26px',
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
