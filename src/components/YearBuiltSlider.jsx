import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

const YearBuiltSlider = ({ yearBuiltRange, selectedYearBuilt, onYearBuiltChange }) => {
  const handleChange = (event, newValue) => {
    onYearBuiltChange(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography id="year-built-slider" gutterBottom>
        Year Built Filter
      </Typography>
      <Slider
        value={selectedYearBuilt}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={yearBuiltRange.min}
        max={yearBuiltRange.max}
        step={1} // Year increments by 1
        marks={[
          { value: yearBuiltRange.min, label: yearBuiltRange.min },
          { value: yearBuiltRange.max, label: yearBuiltRange.max },
        ]}
        aria-labelledby="year-built-slider"
      />
    </Box>
  );
};

export default YearBuiltSlider;
