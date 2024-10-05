import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface DashedBorderBoxProps {
  children: ReactNode;
  title: string;
}

const DashedBorderBox: React.FC<DashedBorderBoxProps> = ({ children, title }) => (
  <Box sx={{ position: 'relative', mt: 2 }}>
    <Typography
      variant="h6"
      sx={{
        color: '#FCB1E5',
        position: 'absolute',
        top: -16,
        left: 16,
        backgroundColor: 'background.default',
        px: 1,
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        border: '2px dashed #AEFFFF',
        borderRadius: '8px',
        pt: 3,
        pb: 2,
        px: 2,
      }}
    >
      {children}
    </Box>
  </Box>
);

export default DashedBorderBox;