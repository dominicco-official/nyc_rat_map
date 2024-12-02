import React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const YearSlider = ({ selectedYear, onYearChange }) => {
  const handleChange = (event, newValue) => {
    onYearChange(newValue);
  };

  const marks = Array.from({ length: 15 }, (_, i) => ({
    value: 2010 + i,
    label: (
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
        {2010 + i}
      </span>
    ),
  }));

  return (
    <Box
      sx={{
        width: '85%',
        position: 'fixed',
        bottom: 50, // Adjusted for better positioning
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px',
        backgroundColor: 'transparent',
        zIndex: 1000,
      }}
    >
      <Slider
        value={selectedYear}
        onChange={handleChange}
        min={2010}
        max={2024}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        sx={{
          '& .MuiSlider-track': {
            height: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          '& .MuiSlider-rail': {
            height: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '2px solid #ffffff',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
          },
          '& .MuiSlider-markActive': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          '& .MuiSlider-markLabel': {
            marginTop: '10px',
            padding: '2px 0',
          },
          '& .MuiSlider-mark': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            height: 12,
            width: 2,
            marginTop: '10px',
          },
          
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'black', // Black background for popup
            color: 'white', // White text color
            fontWeight: 'bold', // Optional: Make the text bold
            borderRadius: '3px', // Rounded corners for popup
            padding: '4px 8px', // Adjust padding for better spacing
          },
          '&:focus': {
            outline: 'none',
          },
          '& .MuiSlider-track:focus': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
};

export default YearSlider;
