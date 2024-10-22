// Legend.jsx
import React from 'react';

const Legend = () => {
  // Define styles for the legend and its elements
  const legendStyle = {
    position: 'absolute',
    top: '110px', // Adjust as needed
    left: '10px', // Position it on the left
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid #ccc',
    borderRadius: '10px', // Increased radius for rounder corners
    padding: '20px',
    zIndex: 1, // Ensure it's above the map
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Add shadow
    textAlign: 'center', // Center-align text
  };

  const gradientStyle = {
    height: '300px', // Adjust height for the gradient
    width: '4rem', // Width of the gradient
    background: 'linear-gradient(to top, red, #FFFFFF)', // Color gradient
    marginBottom: '5px', // Space between gradient and labels
    marginLeft: 'auto', // Center align the gradient
    marginRight: 'auto', // Center align the gradient
  };

  const labelsStyle = {
    display: 'flex',
    justifyContent: 'center', // Center the labels
    fontSize: '2.0rem', // Change font size here
    color: '#000000', // Change font color here
    fontFamily: 'Arial, sans-serif', // Change font style here
  };

  const titleStyle = {
    fontSize: '2.0rem', // Change title font size
    color: '#000000', // Change title font color
    fontWeight: 'bold', // Change title font weight
    marginBottom: '.5rem',
    marginTop: '10px',
    marginRight: '.5rem',
    marginLeft: '10px',
    fontFamily: 'Arial, sans-serif', // Change font style here
  };

  return (
    <div style={legendStyle}>
      <h4 style={titleStyle}>Rat Incidence</h4>
      <div style={labelsStyle}>
        <span>LOW<br/>(0 sightings) </span>
      </div>
      <div style={gradientStyle} />
      <div style={labelsStyle}>
        <span>HIGH<br/>({'>'}10 sightings) </span>
      </div>
    </div>
  );
};

export default Legend;
