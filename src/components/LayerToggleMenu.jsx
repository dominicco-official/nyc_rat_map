import React from 'react';
import { FormGroup, FormControlLabel, Switch, Paper, Typography } from '@mui/material';

const LayerToggleMenu = ({ layers, activeLayerIds, setActiveLayerIds }) => {
  const handleToggle = (layerId) => {
    if (activeLayerIds.includes(layerId)) {
      setActiveLayerIds(activeLayerIds.filter((id) => id !== layerId));
    } else {
      setActiveLayerIds([...activeLayerIds, layerId]);
    }
  };

  return (
    <Paper
      style={{
        position: 'fixed',
        textAlign: 'left', // Align text to the left
        top: '316px', // Adjust as needed
        left: '10px', // Position it on the left
        backgroundColor: 'rgba(0, 0, 0, .7)',
        border: 'none',
        borderRadius: '8px',
        padding: '8px',
        zIndex: 1,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
        width: '120px', // Reduced width
      }}
    >
      <Typography
        sx={{
          marginBottom: '7px',
          fontSize: '0.85rem', // Reduced font size
          fontWeight: 'bold',
          paddingLeft: '4px',
          color: 'white', // Changed Typography text to white
        }}
      >
        Layers
      </Typography>
      <FormGroup>
        {layers.map((layer) => (
          <FormControlLabel
            key={layer.id}
            sx={{
              marginRight: '10px',
              textAlign: 'left', // Ensure text alignment is left
            }}
            control={
              <Switch
                checked={activeLayerIds.includes(layer.id)}
                onChange={() => handleToggle(layer.id)}
                sx={{
                  height: '33px',
                  '& .MuiSwitch-switchBase': {
                    paddingTop: '4px', // Reduce padding locally
                    paddingBottom: '4px', // Reduce padding locally
                  },
                  '& .MuiSwitch-thumb': {
                    marginTop: '3px', // Align thumb vertically
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  color: 'white', // Changed switch label text to white
                  textAlign: 'left', // Align label text left
                }}
              >
                {layer.name}
              </Typography>
            }
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default LayerToggleMenu;
