import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import YearSlider from './components/slider.jsx';
import LayerToggleMenu from './components/LayerToggleMenu';
import './App.css';
import Legend from './components/Legend'; // Import the Legend component
import LandUseFilter from './components/LandUseFilter'; // Import the new LandUseFilter component
import TopBar from './components/appbar'; // Adjust the path according to your project structure
import * as turf from '@turf/turf';
import FilterToggle from './components/FilterToggle'; // Adjust the path if needed


const App = () => {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const landUseMapping = [
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
    { value: '00', label: 'Unknown' },
  ];

  const [activeLayerIds, setActiveLayerIds] = useState(['heatmap-layer']);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [rawValueRange, setRawValueRange] = useState({ min: 0, max: 1 }); // Added

  const [selectedYear, setSelectedYear] = useState(2010);
  const [selectedLandUses, setSelectedLandUses] = useState([
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
  ]); // State for land use types

  const [selectedBoroughs, setSelectedBoroughs] = useState(['Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island']);


  const selectedYearRef = useRef(selectedYear);
  const popupRef = useRef(null);
  const selectedFeatureRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [ratFilterEnabled, setRatFilterEnabled] = useState(true);

  



  // New state variable for min and max values
  const [loading, setLoading] = useState(true); // To track loading state

  const [valueRange, setValueRange] = useState({ min: 0, max: 1, shift: 0 });
  const [scoreRange, setScoreRange] = useState({ min: 0, max: 1 });
  const [treeDbfRange, setTreeDbfRange] = useState({ min: 0, max: 1 });
  const getLandUseLabel = (value) => {
    const match = landUseMapping.find((item) => item.value === value);
    return match ? match.label : 'Unknown';
  };
  

  useEffect(() => {
    selectedYearRef.current = selectedYear;
  }, [selectedYear]);

  const closePopup = () => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
  
      // Reset highlight on previously selected feature
      if (selectedFeatureRef.current?.feature?.id !== undefined) {
        mapRef.current.setFeatureState(
          {
            source: 'total_set',
            sourceLayer: 'building_rats',
            id: selectedFeatureRef.current.feature.id,
          },
          { selected: false }
        );
      }
      selectedFeatureRef.current = null;
    }
  };
  

  const layers = [
    { id: 'trees-layer', name: 'Trees' },
    { id: 'catchBasin-layer', name: 'Basins' },
    { id: 'heatmap-layer', name: 'Rat Heatmap' },
  ];

  // const computeValueRange = () => {
  //   const source = mapRef.current.getSource('total_set');
  //   if (!source) {
  //     console.error("Source 'total_set' not found.");
  //     return;
  //   }

  //   const features = mapRef.current.querySourceFeatures('total_set', {
  //     sourceLayer: 'building_rats',
  //   });

  //   if (!features.length) {
  //     console.warn("No features found in 'building_rats'.");
  //     return;
  //   }

  //   const logValues = features
  //     .map((feature) => {
  //       const ratMean = feature.properties[`${selectedYear}_rat_mean`];
  //       const ratCount = feature.properties[`${selectedYear}_rat_count`];

  //       if (
  //         ratMean !== undefined &&
  //         ratMean !== null &&
  //         ratCount !== undefined &&
  //         ratCount !== null
  //       ) {
  //         // Adjust rat_mean if between 0 and 0.1
  //         const adjustedRatMean =
  //           ratMean

  //         const product = adjustedRatMean * ratCount;
  //         const log_product = Math.log10(product);
  //         if (product > 0) {
  //           return product;
  //         } else {
  //           return 0; 
  //         }
  //       }
  //       return null;
  //     })
  //     .filter((value) => value !== null);

  //   if (!logValues.length) {
  //     console.warn(`No valid values found for year ${selectedYear}.`);
  //     return;
  //   }

  //   const minLogValue = Math.min(...logValues);
  //   const maxLogValue = Math.max(...logValues);

  //   // Shift values to be non-negative
  //   const shiftAmount = minLogValue < 0 ? Math.abs(minLogValue) + 0.001 : 0;

  //   const shiftedValues = logValues.map((value) => value + shiftAmount);

  //   const minValue = Math.min(...shiftedValues);
  //   const maxValue = Math.max(...shiftedValues);

  //   setValueRange({ min: minValue, max: maxValue, shift: shiftAmount });

  //   console.log(
  //     `Computed valueRange: min = ${minValue}, max = ${maxValue}, shift = ${shiftAmount}`
  //   );
  // };

  const computeValueRange = () => {
    const source = mapRef.current.getSource('total_set');
    if (!source) {
      console.error("Source 'total_set' not found.");
      return;
    }
  
    const features = mapRef.current.querySourceFeatures('total_set', {
      sourceLayer: 'building_rats',
    });
  
    if (!features.length) {
      console.warn("No features found in 'building_rats'.");
      return;
    }
  
    const rawValues = [];
    const adjustedValues = [];

    features.forEach(feature => {
      const ratMean = feature.properties[`${selectedYear}_rat_mean`];
      const ratCount = feature.properties[`${selectedYear}_rat_count`];

      if (
        ratMean !== undefined &&
        ratMean !== null &&
        ratCount !== undefined &&
        ratCount !== null &&
        ratMean > 0 &&
        ratCount > 0
      ) {
        let product = ratMean * ratCount;

        // Apply specified conditions
        if (product === 0.5) product = 1;
        if (product === 1) product = 1.5;

        const logProduct = Math.log10(product);

        rawValues.push(product);
        adjustedValues.push(logProduct);
      }
    });

    if (rawValues.length === 0 || adjustedValues.length === 0) {
      console.warn(`No valid values found for year ${selectedYear}.`);
      return;
    }

    const minRaw = Math.min(...rawValues);
    const maxRaw = Math.max(...rawValues);

    const minLog = Math.min(...adjustedValues);
    const maxLog = Math.max(...adjustedValues);

    const shiftAmount = minLog < 0 ? Math.abs(minLog) + 0.001 : 0;

    const shiftedLogValues = adjustedValues.map(val => val + shiftAmount);
    const minLogShifted = Math.min(...shiftedLogValues);
    const maxLogShifted = Math.max(...shiftedLogValues);

    setRawValueRange({ min: minRaw, max: maxRaw });
    setValueRange({ min: minLogShifted, max: maxLogShifted, shift: shiftAmount });

    
  };
  
  const computeScoreRange = () => {
    const source = mapRef.current.getSource('total_set');
    if (!source) {
      console.error("Source 'total_set' not found.");
      return;
    }

    const features = mapRef.current.querySourceFeatures('total_set', {
      sourceLayer: 'heatmap_rats',
    });

    if (!features.length) {
      console.warn("No features found in 'heatmap_rats'.");
      return;
    }

    const scores = features
      .map((feature) => feature.properties['score'])
      .filter((value) => value !== null && value !== undefined);

    if (!scores.length) {
      console.warn("No valid 'score' values found.");
      return;
    }

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    setScoreRange({ min: minScore, max: maxScore });
  };

  const computeTreeDbfRange = () => {
    const source = mapRef.current.getSource('total_set');
    if (!source) {
      console.error("Source 'total_set' not found.");
      return;
    }

    const features = mapRef.current.querySourceFeatures('total_set', {
      sourceLayer: 'trees',
    });

    if (!features.length) {
      console.warn("No features found in 'trees'.");
      return;
    }

    const treeDbfs = features
      .map((feature) => feature.properties['tree_dbf'])
      .filter((value) => value !== null && value !== undefined);

    if (!treeDbfs.length) {
      console.warn("No valid 'tree_dbf' values found.");
      return;
    }

    const minTreeDbf = Math.min(...treeDbfs);
    const maxTreeDbf = Math.max(...treeDbfs);

    setTreeDbfRange({ min: minTreeDbf, max: maxTreeDbf });
  };

   // Function to add the necessary map layers
   const addMapLayers = () => {
    
    
    mapRef.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'total_set',
      'source-layer': 'heatmap_rats',
      layout: { visibility: 'visible' },
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "score"],
          scoreRange.min,
          0,
          scoreRange.max,
          1
        ],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 12, .3, 16, 1.5],
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          'rgba(33,102,172,0)',
          0.2,
          'rgba(103,169,207,0.5)',
          0.4,
          'rgb(209,229,240)',
          0.6,
          'rgb(253,219,199)',
          0.8,
          'rgb(239,138,98)',
          1,
          'rgb(212, 79, 79)'
        ],
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 12, 20, 16, 60],
        "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 12, 1, 16, 1, 20, 0],
      },
    });
    
    mapRef.current.addLayer({
      id: 'heatmap-point',
      type: 'circle',
      source: 'total_set',
      'source-layer': 'heatmap_rats',
      layout: { visibility: 'visible' },
      minzoom: 15, // Points start appearing after heatmap fades out
      paint: {
        // Size circle radius by score and zoom level
        'circle-radius': [
          'interpolate',
          ['exponential', 1.5], // Add a numeric base for exponential interpolation
          ['get', 'score'],
          0,
          0, // Minimum radius for score = 0
          scoreRange.max / 2,
          3, // Medium radius
          scoreRange.max,
          8 // Maximum radius
        ],
        // Color circle by score
        'circle-color': [
          'interpolate',
          ['exponential', 1.5], // Add a numeric base for exponential interpolation
          ['get', 'score'],
          0,
          'rgba(33,102,172,0.5)', // Low score color
          scoreRange.max / 2,
          'rgb(209,229,240)', // Medium score color
          scoreRange.max,
          'rgb(212,79,79)' // High score color
        ],
        // Transition from heatmap to circle layer by zoom level
        'circle-stroke-color': 'rgba(255,255,255,0.5)',
      'circle-stroke-width': 1,
        'circle-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0, 18, 1]
      }
    });
    




    mapRef.current.addLayer({
      id: 'catchBasin-layer',
      type: 'circle',
      source: 'total_set',
      'source-layer': 'catch_basins',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': {
          base: 1.75,
          stops: [
            [12, 1],
            [16, 5]
          ]
        },
        'circle-color': '#0000FF',
        'circle-opacity': 0.8,
      },
    });

    mapRef.current.addLayer({
      id: 'trees-layer',
      type: 'heatmap',
      source: 'total_set',
      'source-layer': 'trees',
      layout: { visibility: 'none' }, // Adjust visibility as needed
      filter: ['has', 'tree_dbh'], // Filter to include only features with tree_dbh
      paint: {
        // Weight influences the intensity of each feature in the heatmap
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'tree_dbh'], // Use tree_dbh to influence heatmap weight
          0, 0,    // tree_dbh = 0 contributes nothing
          60, 1    // tree_dbh = 30 contributes maximum intensity
        ],
        // Intensity controls the overall brightness of the heatmap
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, .3,    // Lower intensity at zoom level 0
          22, 2    // Higher intensity at zoom level 22
        ],
        // Color of the heatmap (green gradient)
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 128, 0, 0)',   // Transparent green for low density
          0.2, 'rgba(34, 139, 34, 0.4)', // Light green
          0.5, 'rgba(0, 255, 0, 0.7)', // Bright green
          1, 'rgba(0, 100, 0, 1)'     // Dark green for high density
        ],
        // Radius of influence for each point
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,   // Small radius at low zoom levels
          22, 30  // Larger radius at high zoom levels
        ],
        // Opacity of the heatmap
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 0.8,  // Fully opaque at low zoom levels
          22, 0.7  // Slightly transparent at high zoom levels
        ]
      }
    });
    

    mapRef.current.addLayer({
      id: 'building-rats-extrusion',
      type: 'fill-extrusion',
      source: 'total_set',
      'source-layer': 'building_rats',
      paint: {
        'fill-extrusion-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#fac400', // Highlight color
        [
          'case',
          // Check if the product is zero or properties are missing
          ['any',
            ['!', ['has', `${selectedYear}_rat_mean`]],
            ['!', ['has', `${selectedYear}_rat_count`]],
            ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 0]
          ],
          'rgba(45, 45, 45, .05)', // Base color for zero activity
          [
            'interpolate',
            ['linear'],
            [
              '+', // Shifted log value
              [
                'log10',
                [
                  // Adjusted product
                  'case',
                  ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 0.5],
                  1,
                  ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 1],
                  1.5,
                  ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]]
                ]
              ],
              valueRange.shift // Apply shift to ensure non-negative values
            ],
      valueRange.min,
      '#e0b4a1', // Start color
      valueRange.max,
      '#ee3f50' // End color
    ]
  ]
],

        

  
        'fill-extrusion-base': 0,
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'], // Adjust height to ensure consistent visible extrusion
          11, 0, // At zoom 11, height is 0
          16, ['+', ['get', 'heightroof'], 0] // At zoom 16, use heightroof
        ],
        'fill-extrusion-vertical-gradient': true,
        'fill-extrusion-opacity': 0.9
      },
    });
    
  };


  // Initialize the map only once
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_API_KEY; // Replace with your actual token
     
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-73.9857, 40.7484],
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 13,
      maxZoom: 22,
    });

    mapRef.current.on('load', () => {

    
    setMapLoaded(true);

    // Delay the removal of the loading screen
    setTimeout(() => {
      setLoading(false); // Hide loading screen after a delay
    }, 1500); // Delay in milliseconds (e.g., 1.5 seconds)
      

      // Refine to hide only minor street names
    mapRef.current.getStyle().layers.forEach((layer) => {
      if (
        layer.type === 'symbol' && // Look for symbol layers
        layer.layout &&
        layer.layout['text-field'] &&
        layer.id.includes('road-label') // Filter by id to match street labels
      ) {
        // Example: Remove only minor roads (adjust id checks as needed)
        if (layer.id.includes('minor') || layer.id.includes('small')) {
          mapRef.current.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      }
    });

      mapRef.current.addSource('total_set', {
        type: 'vector',
        url: 'mapbox://hlco1997.rat_map_nyc',
      });

      // Adding layers
      addMapLayers();
      

      // Add the click event listener here
      mapRef.current.on('click', handleMapClick);
       // Compute ranges after layers are adde
       mapRef.current.once('idle', () => {
        computeValueRange();
       
      });

      
     // Add click event for the 'heatmap-point' layer
        mapRef.current.on('click', 'heatmap-point', (event) => {
          // Close any existing popup
          if (popupRef.current) {
            popupRef.current.remove();
            popupRef.current = null;
          }

          // Ensure the clicked feature has the required property
          if (event.features.length && event.features[0].properties.score) {
            // Create and store a new popup
            const popup = new mapboxgl.Popup()
              .setLngLat(event.features[0].geometry.coordinates)
              .setHTML(
                `<strong>Number of Rat Sightings:</strong> ${event.features[0].properties.score}`
              )
              .addTo(mapRef.current);

            // Store the popup instance in the ref
            popupRef.current = popup;
          }
        });

    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const fetchAddress = async (lng, lat) => {
    const accessToken = import.meta.env.VITE_API_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();

      // Extract the address (e.g., place name or full address)
      const address = data.features[0]?.place_name || 'Address not found';
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not available';
    }
  };

  const valueRangeRef = useRef(valueRange);

  useEffect(() => {
  valueRangeRef.current = valueRange;
  }, [valueRange]);

  const handleMapClick = async (e) => {
  // If a popup is currently open, ignore this click to allow the popup to close
  if (popupRef.current) {
    // A popup is open; close it and prevent any further action
    popupRef.current.remove();
    popupRef.current = null;

    // Remove highlight from previously selected feature
    if (selectedFeatureRef.current?.feature?.id !== undefined) {
      mapRef.current.setFeatureState(
        {
          source: 'total_set',
          sourceLayer: 'building_rats',
          id: selectedFeatureRef.current.feature.id,
        },
        { selected: false }
      );
    }
    selectedFeatureRef.current = null;

    // Prevent opening a new popup during this click
    return;
  }

  // No popup is open; proceed to open a new popup if a building is clicked
  // Get the features at the clicked point on the 'building-rats-extrusion' layer
  const features = mapRef.current.queryRenderedFeatures(e.point, {
    layers: ['building-rats-extrusion'],
  });

  // If no features are found, simply return
  if (!features.length) {
    return;
  }

  // Proceed if a building extrusion was clicked
  const feature = features[0];

  // Ensure the feature has an ID
  if (feature.id === undefined) {
    console.error(
      'Selected feature does not have an id. Unable to set feature state for highlighting.'
    );
    return;
  }


  // Calculate the building's center for the popup placement
  const buildingCenter =
    feature.geometry.type === 'Point'
      ? feature.geometry.coordinates
      : turf.center(feature).geometry.coordinates;

  // Fetch the address of the building
  const address = await fetchAddress(buildingCenter[0], buildingCenter[1]);

  // If a popup is already open, remove it (should not happen due to the check above)
  if (popupRef.current) {
    popupRef.current.remove();
    popupRef.current = null;
  }

  // Retrieve properties
  const ratMean = feature.properties[`${selectedYearRef.current}_rat_mean`];
  const ratCount = feature.properties[`${selectedYearRef.current}_rat_count`];
  const landUse = feature.properties['LandUse'] || 'N/A';
  const landUseLabel = getLandUseLabel(landUse); // Get the label
  const yearBuilt = feature.properties['YearBuilt'] || 'N/A';
  const heightRoof = feature.properties['heightroof'] || 'N/A';

  // Calculate the rat score using the same logic as in the legend
  let ratScore = null;

  if (
    ratMean !== undefined &&
    ratMean !== null &&
    ratCount !== undefined &&
    ratCount !== null
  ) {
    // Adjust rat_mean if between 0 and 0.1
    const adjustedRatMean =
      ratMean > 0 && ratMean <= 0.1 ? ratMean + 0.1 : ratMean;

    const product = adjustedRatMean * ratCount;
    const logValue = Math.log10(product);

    if (product > 0) {
      const shiftedLogValue = logValue
      ratScore = product;
    } else {
      ratScore = 0; // Zero or negative product
    }
  } else {
    ratScore = null; // Missing data
  }

  // Create a new popup and store it in the ref
  const popup = new mapboxgl.Popup({
    anchor: 'left',
    offset: 30,
    closeOnClick: false,
    focusAfterOpen: false,
  })
    .setLngLat(buildingCenter)
    .setHTML(`
      <div style="padding: 10px;">
        <strong style="font-size: 1.1em; color: #fac400">${address}</strong><br>
        
        <strong>Land Use:</strong> ${landUseLabel}<br>
        <strong>Year Built:</strong> ${yearBuilt}<br>
        <strong>Height:</strong> ${heightRoof}<br>
      
        <strong>Rat Mean (${selectedYearRef.current}):</strong> ${
    ratMean !== null && ratMean !== undefined ? ratMean.toFixed(2) : 'N/A'
  }
        <br>
        <strong>DOH Checks (${selectedYearRef.current}):</strong> ${
    ratCount !== null && ratCount !== undefined ? ratCount : 'N/A'
  }
        <br>
        <strong>Rat Score (${selectedYearRef.current}):</strong> ${
    ratScore !== null ? ratScore.toFixed(2) : 'No Activity'
  }
      </div>
    `)
    .addTo(mapRef.current);

  // Store the popup reference
  popupRef.current = popup;

  // Add an event listener for the 'close' event
  // Add an event listener for the 'close' event (if not already present)
popup.on('close', () => {
  // Remove highlight from previously selected feature
  if (selectedFeatureRef.current?.feature?.id !== undefined) {
    mapRef.current.setFeatureState(
      {
        source: 'total_set',
        sourceLayer: 'building_rats',
        id: selectedFeatureRef.current.feature.id,
      },
      { selected: false }
    );
  }
  selectedFeatureRef.current = null;
  popupRef.current = null;
});


  // Reset the previous selection (if any)
  if (selectedFeatureRef.current?.feature?.id !== undefined) {
    mapRef.current.setFeatureState(
      {
        source: 'total_set',
        sourceLayer: 'building_rats',
        id: selectedFeatureRef.current.feature.id,
      },
      { selected: false }
    );
  }

  // Set the new selection
  mapRef.current.setFeatureState(
    {
      source: 'total_set',
      sourceLayer: 'building_rats',
      id: feature.id,
    },
    { selected: true }
  );

  // Store both the feature and the fetched address
  selectedFeatureRef.current = {
    feature,
    address,
  };
  };
 
  // Function to update the heatmap layer normalization
  const updateHeatmapLayerNormalization = () => {
    if (mapRef.current.getLayer('heatmap-layer')) {
      mapRef.current.setPaintProperty('heatmap-layer', 'heatmap-weight', [
        'interpolate',
        ['linear'],
        ['get', 'score'],
        scoreRange.min,
        0,
        scoreRange.max,
        1,
      ]);

      
    }
  };

  // Function to update the trees layer normalization
  // const updateTreesLayerNormalization = () => {
  //   if (mapRef.current.getLayer('trees-layer')) {
  //     mapRef.current.setPaintProperty('trees-layer', 'circle-radius', [
  //       'interpolate',
  //       ['linear'],
  //       ['coalesce', ['get', 'tree_dbf'], treeDbfRange.min],
  //       treeDbfRange.min,
  //       5,
  //       treeDbfRange.max,
  //       25,
  //     ]);
  //   }
  // };


  // Function to update the building layer based on selected year
  const updateBuildingLayer = () => {
    if (mapRef.current.getLayer('building-rats-extrusion')) {
      mapRef.current.setPaintProperty(
        'building-rats-extrusion',
        'fill-extrusion-color',
        [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#fac400', // Highlight color
          [
            'case',
            // Check if the product is zero or properties are missing
            ['any',
              ['!', ['has', `${selectedYear}_rat_mean`]],
              ['!', ['has', `${selectedYear}_rat_count`]],
              ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 0]
            ],
            'rgba(45, 45, 45, .05)', // Base color for zero activity
            [
              'interpolate',
              ['linear'],
              [
                '+', // Shifted log value
                [
                  'log10',
                  [
                    // Adjusted product
                    'case',
                    ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 0.5],
                    1,
                    ['==', ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]], 1],
                    1.5,
                    ['*', ['get', `${selectedYear}_rat_mean`], ['get', `${selectedYear}_rat_count`]]
                  ]
                ],
                valueRange.shift // Apply shift to ensure non-negative values
              ],
              valueRange.min,
            '#e0b4a1', // Start color
            valueRange.max,
            '#ee3f50' // End color
            ]
          ]
        ]
            

      );
      mapRef.current.setPaintProperty(
        'building-rats-extrusion',
        'fill-extrusion-base',
        0 // Keep the base at ground level
      );

      mapRef.current.setPaintProperty(
        'building-rats-extrusion',
        'fill-extrusion-color-transition', // Transition settings for color
        {
          duration: 1000, // Transition duration in milliseconds
          delay: 100, // No delay
        }
      );

      mapRef.current.setPaintProperty(
        'building-rats-extrusion',
        'fill-extrusion-height',
        [
          'interpolate',
          ['linear'],
          ['zoom'], // Adjust height to ensure consistent visible extrusion
          11, 0, // At zoom 12, use heightroof as-is
          16, ['+', ['get', 'heightroof'], 0] // Adjust height relative to base
        ]
      );
      
    }
  };

  const updateBuildingLayerVisibility = () => {
    if (mapRef.current.getLayer('building-rats-extrusion')) {
  
      // Create land use filter
      const landUseFilter =
        selectedLandUses.length > 0
          ? ['in', 'LandUse', ...selectedLandUses]
          : ['!=', 'LandUse', 'unknown_value']; // Show all if no land uses are selected
  
      // Create borough filter using 'boro_name'
      const boroughFilter =
        selectedBoroughs.length > 0
          ? ['in', 'boro_name', ...selectedBoroughs]
          : ['!=', 'boro_name', 'unknown_value']; // Show all if no boroughs are selected

      let combinedFilter = ['all', landUseFilter, boroughFilter];

      if (!ratFilterEnabled) {
        const ratMeanFilter = ['>',  `${selectedYear}_rat_mean`, 0];
        const ratCountFilter = ['>', `${selectedYear}_rat_count`, 0];
        combinedFilter.push(ratMeanFilter, ratCountFilter);

      }
  

      try {
        mapRef.current.setFilter('building-rats-extrusion', combinedFilter);
      } catch (error) {
        console.error("Error applying filter:", error);
      }
      
    }
  };
  

  // Function to update the heatmap layer based on selected year
  const updateHeatmapLayer = () => {
    if (mapRef.current.getLayer('heatmap-layer')) {
      mapRef.current.setFilter('heatmap-layer', [
        '==',
        ['get', 'date'],
        selectedYear,
      ]);

      mapRef.current.setFilter('heatmap-point', [
        '==',
        ['get', 'date'],
        selectedYear,
      ]);
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      updateHeatmapLayerNormalization();
    }
  }, [scoreRange, mapLoaded]);
  
  // useEffect(() => {
  //   if (mapLoaded) {
  //     updateTreesLayerNormalization();
  //   }
  // }, [treeDbfRange, mapLoaded]);
  
  // Update the building layer when valueRange changes
  useEffect(() => {
    if (mapLoaded) {
      updateBuildingLayer();
    }
  }, [valueRange, mapLoaded]);


  useEffect(() => {
    if (mapLoaded) {
      console.log(`Updating layers for the year ${selectedYear}.`);
      computeValueRange();
      updateHeatmapLayer();
  
      if (popupRef.current && selectedFeatureRef.current) {
  
        const { feature, address } = selectedFeatureRef.current;
  
        // Re-query the feature to get updated properties
        const updatedFeatures = mapRef.current.queryRenderedFeatures({
          layers: ['building-rats-extrusion'],
          filter: ['==', ['id'], feature.id],
        });
  
        if (updatedFeatures.length > 0) {
          const updatedFeature = updatedFeatures[0];
  
          // Recalculate the Rat Score using the same logic
          const ratMean = updatedFeature.properties[`${selectedYear}_rat_mean`];
          const ratCount = updatedFeature.properties[`${selectedYear}_rat_count`];
          const landUseValue = updatedFeature.properties['LandUse'] || '00';
          const landUseLabel = getLandUseLabel(landUseValue); // Map LandUse value to label
          const yearBuilt = updatedFeature.properties['YearBuilt'] || 'N/A';
          const heightRoof = updatedFeature.properties['heightroof'] || 'N/A';
  
          let ratScore = null;
  
          if (
            ratMean !== undefined &&
            ratMean !== null &&
            ratCount !== undefined &&
            ratCount !== null
          ) {
            const adjustedRatMean =
              ratMean > 0 && ratMean <= 0.1 ? ratMean + 0.1 : ratMean;
  
            const product = adjustedRatMean * ratCount;
            ratScore = product > 0 ? product : 0;
          } else {
            ratScore = null; // Missing data
          }
  
          // Update the popup content with the new year and updated attributes
          popupRef.current.setHTML(`
            <div style="padding: 10px;">
              <strong style="font-size: 1.1em; color: #fac400">${address}</strong><br>
              <strong>Land Use:</strong> ${landUseLabel}<br>
              <strong>Year Built:</strong> ${yearBuilt}<br>
              <strong>Height:</strong> ${heightRoof}<br>
              <strong>Rat Mean (${selectedYear}):</strong> ${
            ratMean !== null && ratMean !== undefined ? ratMean.toFixed(2) : 'N/A'
          }<br>
              <strong>DOH Checks (${selectedYear}):</strong> ${
            ratCount !== null && ratCount !== undefined ? ratCount : 'N/A'
          }<br>
              <strong>Rat Score (${selectedYear}):</strong> ${
            ratScore !== null ? ratScore.toFixed(2) : 'No Activity'
          }
              
            </div>
          `);
  
          // Update the reference to the feature
          selectedFeatureRef.current.feature = updatedFeature;
        } else {
          console.error('Could not find updated feature.');
        }
      }
    }
  }, [selectedYear, mapLoaded]);
  

  useEffect(() => {
    if (mapRef.current) {
      setZoomLevel(mapRef.current.getZoom());
  
      mapRef.current.on('zoom', () => {
        setZoomLevel(mapRef.current.getZoom());
      });
    }
  }, [mapLoaded]);
  

  useEffect(() => {
    if (!mapLoaded) return;

    layers.forEach(({ id }) => {
      mapRef.current.setLayoutProperty(
        id,
        'visibility',
        activeLayerIds.includes(id) ? 'visible' : 'none'
      );
    });
  }, [activeLayerIds, mapLoaded]);

  const handleYearChange = (year) => {
    setSelectedYear(year); // Update the selected year state
  
    // Close the popup if it exists
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  };

  useEffect(() => {
    if (mapLoaded) {
      updateBuildingLayerVisibility(); // Call the visibility update function
      closePopup();
    }
  }, [selectedLandUses, selectedBoroughs, selectedYear, ratFilterEnabled, mapLoaded]);

  const handleLandUseChange = (value) => {
    setSelectedLandUses((prev) => {
      if (prev.includes(value)) {
        closePopup();
        return prev.filter((lu) => lu !== value);
      } else {
        closePopup();
        return [...prev, value];
      }
    });
  };

  const handleBoroughChange = (value) => {
    setSelectedBoroughs((prev) =>
      prev.includes(value)
        ? prev.filter((boro) => boro !== value)
        : [...prev, value]
    );
    closePopup();
  };

  return (
    <>
    <div id="loading-screen" className={loading ? '' : 'hidden'}>
      <div className="loading-circle"></div>
    </div>
      <TopBar />
      
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', // Stack components vertically
          alignItems: 'stretch', // Stretch children to avoid shifts
          position: 'fixed',
          borderRadius: '8px',
          top: '65px',
          right: '10px',
          zIndex: 10,
          width: '250px', // Set the width for the container
          height: 'auto', // Let height adjust based on content
          boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 5px',

        }}
      >
        <LandUseFilter
          selectedLandUses={selectedLandUses}
          onLandUseChange={handleLandUseChange}
          selectedBoroughs={selectedBoroughs}
          onBoroughChange={handleBoroughChange}
        />
        

      </div>
      <YearSlider selectedYear={selectedYear} onYearChange={handleYearChange} />
      <div id="map-container" ref={mapContainerRef} />
      <Legend rawValueRange={rawValueRange} valueRange={valueRange} />

      <FilterToggle
  isEnabled={ratFilterEnabled}
  onToggle={(isEnabled) => {
    setRatFilterEnabled(isEnabled);
    closePopup(); // Close the popup when the rat filter is toggled
  }}
/>
<LayerToggleMenu
          layers={layers}
          activeLayerIds={activeLayerIds}
          setActiveLayerIds={setActiveLayerIds}
        />
      

      <div className="zoom-level">Zoom: {zoomLevel.toFixed(2)}</div>

    </>
  );
};

export default App;
