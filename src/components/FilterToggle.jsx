import React from 'react';
import { Checkbox, FormControlLabel, Typography, Paper } from '@mui/material';

const FilterToggle = ({ isEnabled, onToggle }) => {
  return (
    <Paper
    sx={{
      position: 'fixed', // Ensures positioning context
      top: '235px',
      left: '10px',
      fontSize: '.85rem',
      fontFamily: "Arial, sans-serif",
      background: 'rgba(0, 0, 0, .7)',
      backgroundColor: 'rgba(0, 0, 0, .7)',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
      color: '#FFFFFF',
      width: '120px',
      zIndex: 1000, // Higher z-index for visibility
      margin: '10px 0',
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.8)', // Add background for better contrast
      padding: '8px',
      borderRadius: '5px',
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)', // Subtle shadow for clarity

      
 
    }}
    >
      <FormControlLabel
      
        control={
          <Checkbox
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            sx={{
              color: '#FFFFFF', // Checkbox color for unchecked state
              '&.Mui-checked': {
                color: 'yellow', // Checkbox color for checked state
              },
              padding: '4px',
              paddingLeft: '12px',
              marginRight: "5px"
            }}
          />
        }
        label={
          <Typography
            sx={{
              fontSize: '0.85rem',
              lineHeight: 1.2,
              margin: 0,
              color: '#FFFFFF', // Label text color set to white
            }}
          >
            Show Zero Rat Activity Buildings
          </Typography>
        }
        sx={{
          marginRight: '10px', // Adjust marginRight here
        }}
      />
    </Paper>
  );
};

export default FilterToggle;

  