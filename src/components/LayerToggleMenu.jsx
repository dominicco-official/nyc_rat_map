import React from 'react';
import { FormGroup, FormControlLabel, Switch, Paper,  Typography } from '@mui/material';

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
      
        zIndex: 9999,  // High z-index to ensure it's above the map
        padding: '10px',
        
        
        marginTop: '5px'
    
      }}
    >
      <Typography sx={{ marginBottom: '10px', fontSize: '2.2rem', fontWeight: "bold", paddingLeft:'10px'}}>
        Layers
      </Typography>
      <FormGroup>
        {layers.map((layer) => (
          <FormControlLabel
            key={layer.id}
            control={
              <Switch
                checked={activeLayerIds.includes(layer.id)}
                onChange={() => handleToggle(layer.id)}
                size="large" // Makes the switch bigger
                
              />
            }
            label={<Typography sx={{ fontSize: '2.2rem'}}>{layer.name}</Typography>}
            
          />
        ))}
      </FormGroup>
    </Paper>
  );
};

export default LayerToggleMenu;
