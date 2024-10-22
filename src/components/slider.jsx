import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const YearSlider = ({ selectedYear, onYearChange }) => {
  // Handle slider value change and pass it to the parent component
  const handleChange = (event, newValue) => {
    onYearChange(newValue); // Call the provided callback with the new value
  };

  // Create marks for the slider with custom styling
  const marks = Array.from({ length: 15 }, (_, i) => ({
    value: 2010 + i,
    label: (
      <span style={{ fontSize: '2.7rem', color: '#000000' }}>
        {2010 + i}
      </span>
    ),
  }));

  return (
    <Box
      sx={{
        width: '85%',
        position: 'fixed',
        bottom: 250,
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
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
            height: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            width: "calc(100% + 140px)",
            zIndex: 1,
            marginLeft: '-50px',
          },
          '& .MuiSlider-rail': {
            height: 50,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            marginBottom: '2rem',
            width: "calc(100% + 100px)",
            marginLeft: '-50px',
          },
          '& .MuiSlider-thumb': {
            height: 110,
            width: 110,
            zIndex: 2,
            backgroundColor: '#fff',
            border: '10px solid #ffffff',
            '&:hover, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
          },
          '& .MuiSlider-markActive': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          '& .MuiSlider-markLabel': {
            marginTop: '8rem',
            padding: '10px 0',
          },
          '& .MuiSlider-mark': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            height: 80,
            width: 8,
            marginTop: '64px',
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
