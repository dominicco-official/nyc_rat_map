import React from 'react';
import { FormControlLabel, Checkbox, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Define a list of land use options
const landUseOptions = [
  { value: '01', label: '1-2 Family Bldg' },
  { value: '02', label: 'Multi-Family Walk-Up Bldg' },
  { value: '03', label: 'Multi-Family Elevator Bldg' },
  { value: '04', label: 'Mixed Residential/Commercial' },
  { value: '05', label: 'Commercial/Office Bldg' },
  { value: '06', label: 'Industrial/Manufacturing' },
  { value: '07', label: 'Transportation/Utility' },
  { value: '08', label: 'Public Facilities/Institutions' },
  { value: '09', label: 'Open Space/Outdoor Recreation' },
  { value: '10', label: 'Parking Facilities' },
  { value: '11', label: 'Vacant Land' },
  { value: '00', label: 'Unknown' }
  // Add more land use options as needed
];

const LandUseFilter = ({ selectedLandUses, onChange }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    console.log(`Checkbox changed: ${value}`); // Debugging statement
    // Update the parent component with the new land use selections
    onChange(value);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'grid', // Use grid display
        gridTemplateColumns: '100%', // Ensure full width
        zIndex: 100000
      }}
    >
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="land-use-filter-content"
          id="land-use-filter-header"
        >
          <Typography sx={{ fontSize: '2.2rem', fontWeight: "bold"}}>Building Type Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {landUseOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedLandUses.includes(option.value)}
                  onChange={handleChange}
                  value={option.value}
                />
              }
              label={<Typography sx={{ fontSize: '2.2rem' }}>{option.label}</Typography>} 
              sx={{ marginBottom: 1 }}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      
    </Box>
  );
};

export default LandUseFilter;
