import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link } from '@mui/material';

const TopBar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: 'black', height: '100px' }}>
      <Toolbar style={{ justifyContent: 'space-between', minHeight: '4rem' }}>
      <Typography 
          variant="h6" 
          style={{ 
            color: 'white', 
            fontSize: '3rem', // Adjust the font size here
            lineHeight: '150px' // Center vertically
          }}
        >
          NYC Rat Incidence Map
        </Typography>
        <Link 
          href="https://dominicco.com" // Replace with your portfolio URL
          color="inherit"
          underline="hover"
          style={{ 
            cursor: 'pointer', 
            fontSize: '3rem', // Adjust the font size here
            lineHeight: '60px' // Center vertically
          }}
        >
          Return to Dominic Co's Portfolio
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
