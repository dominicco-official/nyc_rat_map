import React from 'react';
import {
  FormControlLabel,
  Checkbox,
  Paper,
  FormGroup,
  Typography,
  Divider,
} from '@mui/material';

// Define a list of land use options
const landUseOptions = [
  { value: '01', label: '1-2 Family Bldg' },
  { value: '02', label: 'Multi-Family Walk-Up' },
  { value: '03', label: 'Multi-Family + Elevator' },
  { value: '04', label: 'Residential/Commercial' },
  { value: '05', label: 'Commercial/Office Bldg' },
  { value: '06', label: 'Industrial/Manufacturing' },
  { value: '07', label: 'Transportation/Utility' },
  { value: '08', label: 'Public Institutions' },
  { value: '09', label: 'Outdoor Recreation' },
  { value: '10', label: 'Parking Facilities' },
  { value: '11', label: 'Vacant Land' },
  // { value: '00', label: 'Unknown' },
];

// Define a list of borough options based on boro_name
const boroughOptions = [
  { value: 'Manhattan', label: 'Manhattan' },
  { value: 'Bronx', label: 'Bronx' },
  { value: 'Brooklyn', label: 'Brooklyn' },
  { value: 'Queens', label: 'Queens' },
  { value: 'Staten Island', label: 'Staten Island' },
];

const LandUseFilter = ({
  selectedLandUses,
  onLandUseChange,
  selectedBoroughs,
  onBoroughChange,
}) => {
  // Handler for land use checkbox changes
  const handleLandUseChange = (event) => {
    const { value } = event.target;
    onLandUseChange(value);
  };

  // Handler for borough checkbox changes
  const handleBoroughChange = (event) => {
    const { value } = event.target;
    onBoroughChange(value);
  };

  return (
    <Paper
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
        padding: 2,
        zIndex: 1000,
        marginTop: '5px',
        
      }}
    >
      {/* Land Use Filter Section */}
      <Typography
        sx={{
          fontSize: '.85rem',
          fontWeight: 'bold',
          marginBottom: '7px',
          paddingLeft: '5px',
          color: '#FFFFFF', // Title text color set to white
        }}
      >
        Building Type Filter
      </Typography>
      <FormGroup>
        {landUseOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={selectedLandUses.includes(option.value)}
                onChange={handleLandUseChange}
                value={option.value}
                size="small"
                sx={{
                  color: '#FFFFFF', // Checkbox color for unchecked state
                  '&.Mui-checked': {
                    color: '#FFFFFF', // Checkbox color for checked state
                  },
                  padding: '4px',
                  paddingLeft: '12px',
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  margin: 0,
                  color: '#FFFFFF', // Label text color set to white
                }}
              >
                {option.label}
              </Typography>
            }
            sx={{
              marginBottom: 0,
              marginTop: 0,
            }}
          />
        ))}
      </FormGroup>

      {/* Divider between Land Use and Borough Filters */}
      <Divider sx={{ marginY: 1, backgroundColor: '#FFFFFF33' }} />

      {/* Borough Filter Section */}
      <Typography
        sx={{
          fontSize: '.85rem',
          fontWeight: 'bold',
          marginBottom: '7px',
          paddingLeft: '5px',
          color: '#FFFFFF', // Title text color set to white
        }}
      >
        Borough Filter
      </Typography>
      <FormGroup row>
        {boroughOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={selectedBoroughs.includes(option.value)}
                onChange={handleBoroughChange}
                value={option.value}
                size="small"
                sx={{
                  color: '#FFFFFF', // Checkbox color for unchecked state
                  '&.Mui-checked': {
                    color: '#FFFFFF', // Checkbox color for checked state
                  },
                  padding: '4px',
                  paddingLeft: '12px',
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  lineHeight: 1,
                  margin: 0,
                  color: '#FFFFFF', // Label text color set to white
                }}
              >
                {option.label}
              </Typography>
            }
            sx={{
              marginBottom: 0,
              marginTop: 0,
            }}
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default LandUseFilter;
