import React from 'react';
import { AppBar, Toolbar, Typography, Link, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 

const TopBar = () => {
  return (
    <AppBar position="fixed" style={{ backgroundColor: 'black', height: '60px' }}>
      <Toolbar style={{ justifyContent: 'space-between', minHeight: '60px', alignItems: 'center' }}>
        {/* Title with Icon */}
        <Box display="flex" alignItems="center">
            <img 
            src="/Frame 2.png" 
            alt="Icon" 
            style={{ height: '24px', marginRight: '8px' }} 
          />
          <Typography 
            variant="h6" 
            style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: 800 
            }}
          >
            NYC Rat Incidence Map
          </Typography>
        </Box>

        {/* Portfolio Link */}
        {/* <Link 
          href="https://dominicco.com" 
          color="inherit"
          underline="hover"
          variant="h1"
          style={{ 
            display: 'flex', 
            alignItems: 'center', // Align text and icon vertically
            cursor: 'pointer', 
            fontSize: '1rem', 
            fontWeight: 200
          }}
        >
          Return To Dominic's Portfolio
          <ArrowForwardIcon 
            style={{ 
              fontSize: '1rem', // Match the font size of the text
              marginLeft: '5px', // Add space between text and arrow
            }} 
          />
        </Link> */}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
