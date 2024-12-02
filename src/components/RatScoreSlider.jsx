import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

const RatScoreSlider = ({ ratScoreRange, selectedRatScore, onRatScoreChange }) => {
  const handleChange = (event, newValue) => {
    onRatScoreChange(newValue);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography id="rat-score-slider" gutterBottom>
        Rat Score Filter
      </Typography>
      <Slider
        value={selectedRatScore}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={ratScoreRange.min}
        max={ratScoreRange.max}
        step={(ratScoreRange.max - ratScoreRange.min) / 100} // Adjust step as needed
        marks={[
          { value: ratScoreRange.min, label: ratScoreRange.min.toFixed(2) },
          { value: ratScoreRange.max, label: ratScoreRange.max.toFixed(2) },
        ]}
        aria-labelledby="rat-score-slider"
      />
    </Box>
  );
};

export default RatScoreSlider;
