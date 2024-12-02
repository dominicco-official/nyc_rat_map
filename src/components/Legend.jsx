import React, { useState } from 'react';

const Legend = ({ rawValueRange, valueRange }) => {
  // Define styles for the legend and its elements
  const legendStyle = {
    position: 'fixed',
    top: '69px', // Adjust as needed
    left: '10px', // Position it on the left
    backgroundColor: 'rgba(0, 0, 0, .7)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    zIndex: 10000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    width: '120px', // Reduced width
  };

  const titleStyle = {
    fontSize: '1rem',
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: '6px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const tierContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const tierStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '20px',
    color: '#FFFFFF',
    fontSize: '0.7rem', // Reduced font size
    fontFamily: 'Arial, sans-serif',
    padding: '2px',
  };

  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const infoIconStyle = {
    marginLeft: '5px',
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    backgroundColor: '#000', // Black background
    color: '#fff', // White text
    borderRadius: '50%', // Circular shape
    width: '16px',
    height: '16px',
    textAlign: 'center',
    lineHeight: '16px',
    fontSize: '12px',
    border: '1px solid #fff', // Add a white border for the outline
  };
  

  const tooltipStyle = {
    visibility: isTooltipVisible ? 'visible' : 'hidden',
    backgroundColor: '#000', // Black background
    color: '#fff', // White text
    textAlign: 'left',
    borderRadius: '6px',
    padding: '8px',
    position: 'absolute',
    zIndex: 1,
    top: '50%', // Center vertically relative to the icon
    left: '105%', // Position to the right of the icon
    transform: 'translateY(-50%)',
    width: '180px', // Adjust width as needed
    opacity: isTooltipVisible ? 1 : 0,
    transition: 'opacity 0.3s',
  };

  const tooltipArrowStyle = {
    position: 'absolute',
    top: '50%',
    right: '100%',
    transform: 'translateY(-50%)',
    borderWidth: '5px',
    borderStyle: 'solid',
    borderColor: 'transparent #000 transparent transparent',
  };

  // Function to interpolate between two colors
  function interpolateColor(color1, color2, factor) {
    const hex = function (x) {
      x = x.toString(16);
      return x.length === 1 ? '0' + x : x;
    };

    const rgb1 = [
      parseInt(color1.substring(1, 3), 16),
      parseInt(color1.substring(3, 5), 16),
      parseInt(color1.substring(5, 7), 16),
    ];
    const rgb2 = [
      parseInt(color2.substring(1, 3), 16),
      parseInt(color2.substring(3, 5), 16),
      parseInt(color2.substring(5, 7), 16),
    ];

    const resultColor = rgb1.map((c1, i) =>
      Math.round(c1 + factor * (rgb2[i] - c1))
    );

    return (
      '#' +
      hex(resultColor[0]) +
      hex(resultColor[1]) +
      hex(resultColor[2])
    );
  }

  // Generate tiers based on rawValueRange
  const tiers = [];
  const numberOfTiers = 5;

  if (
    rawValueRange &&
    rawValueRange.min !== undefined &&
    rawValueRange.max !== undefined
  ) {
    const minValue = rawValueRange.min;
    const maxValue = rawValueRange.max;
    const step = (maxValue - minValue) / numberOfTiers;

    for (let i = 0; i < numberOfTiers; i++) {
      const tierMin = minValue + i * step;
      const tierMax = minValue + (i + 1) * step;

      const tierValue = (tierMin + tierMax) / 2;

      // Calculate shifted log value
      const logTierValue = Math.log10(tierValue) + valueRange.shift;

      // Determine color based on shifted log value
      const colorInterpolation =
        (logTierValue - valueRange.min) / (valueRange.max - valueRange.min);
      const color = interpolateColor('#e0b4a1', '#ee3f50', colorInterpolation);

      let label;
      if (i === 0) {
        label = `>0 - ${tierMax.toFixed(2)}`;
      } else {
        label = `${tierMin.toFixed(2)} - ${tierMax.toFixed(2)}`;
      }

      tiers.unshift({
        min: tierMin,
        max: tierMax,
        value: tierValue,
        color,
        label,
      });
    }

    // Add "No Activity" tier at the bottom
    
  }

  // Handle case when no tiers are generated
  if (tiers.length <= 1) {
    return (
      <div style={legendStyle}>
        <h4 style={titleStyle}>Rat Activity</h4>
        <div style={tierContainerStyle}>
          <div style={tierStyle}>No Data Available</div>
        </div>
      </div>
    );
  }

  return (
    <div style={legendStyle}>
      <h4 style={titleStyle}>
        Rat Activity
        <span
          style={infoIconStyle}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          i
          {/* Tooltip */}
          <div style={tooltipStyle}>
            {/* Tooltip content */}
            The colors represent the rat score, calculated based on the product of the number of DOH building rodent inspection checks and mean of rat sightings for the selected year.
            <div style={tooltipArrowStyle}></div>
          </div>
        </span>
      </h4>
      <div style={tierContainerStyle}>
        {tiers.map((tier, index) => {
          let labelContent = tier.label;

          // Add "HIGH" label to the top tier
          if (index === 0 && !tier.label.includes('No Activity')) {
            labelContent = `HIGH (${labelContent})`;
          }
          // Add "LOW" label to the bottom numerical tier (before "No Activity")
          else if (index === tiers.length - 2) {
            labelContent = `LOW (${tier.label})`;
          }
          // For "No Activity" tier, label remains as is

          return (
            <div
              key={index}
              style={{
                ...tierStyle,
                backgroundColor: tier.color,
              }}
            >
              {labelContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;
