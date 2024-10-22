import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import YearSlider from './components/slider.jsx';
import LayerToggleMenu from './components/LayerToggleMenu';
import './App.css';
import Legend from './components/Legend'; // Import the Legend component
import LandUseFilter from './components/LandUseFilter'; // Import the new LandUseFilter component
import TopBar from './components/appbar'; // Adjust the path according to your project structure




const App = () => {
  const mapRef = useRef();
  const mapContainerRef = useRef();

  const [activeLayerIds, setActiveLayerIds] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2010);
  const [selectedLandUses, setSelectedLandUses] = useState(['00', '01','02', '03','04', '05','06', '07','08','09','10','11']); // State for land use types


  const layers = [
    { id: 'trees-layer', name: 'Trees' },
    { id: 'catchBasin-layer', name: 'Catch Basins' },
  ];
  
  // Initialize the map only once test
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_API_KEY; // Replace with your actual token
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-74.0242, 40.6941],
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 14,
      maxZoom: 16,
    });

    mapRef.current.on('load', () => {
      console.log("Map has loaded successfully.");
      setMapLoaded(true);

      mapRef.current.addSource('total_set', {
        type: 'vector',
        url: 'mapbox://dominicco1995.rat_map_nyc',
      });

      // Adding layers
      addMapLayers();
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  // Function to add the necessary map layers
  const addMapLayers = () => {
    mapRef.current.addLayer({
      id: 'catchBasin-layer',
      type: 'circle',
      source: 'total_set',
      'source-layer': 'catch_basins',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': 20,
        'circle-color': '#0000FF',
        'circle-opacity': 0.8,
      },
    });

    mapRef.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'total_set',
      'source-layer': 'heatmap_rats',
      paint: {
        'heatmap-weight': {
          property: 'score',
          type: 'exponential',
          stops: [
            [0.5, 0],
            [6, 6],
            [11, 12],
          ],
        },
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          14, 8,
          15, 16,
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.5, 'rgb(239,138,98)',
          1, 'rgb(128,0,0)',
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 10,
          9, 100,
        ],
        'heatmap-opacity': {
          default: 1,
          stops: [
            [15, 1],
            [18, 0],
          ],
        },
      },
    });

    mapRef.current.addLayer({
      id: 'building-rats-extrusion',
      type: 'fill-extrusion',
      source: 'total_set',
      'source-layer': 'building_rats',
      paint: {
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['get', `${selectedYear}_rat_mean`],
          0, '#FFFFFF',
          0.5, '#d9b45f',
          1, '#d9635f',
        ],
        'fill-extrusion-height': ['get', 'heightroof'],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.7,
      },
    });

    mapRef.current.addLayer({
      id: 'trees-layer',
      type: 'circle',
      source: 'total_set',
      'source-layer': 'trees',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['coalesce', ['get', 'tree_dbf'], 20],
          0, 20,
          318, 100,
        ],
        'circle-color': '#76c893',
        'circle-opacity': 0.8,
      },
    });
  };


  

  // Function to update the building layer based on selected year
  const updateBuildingLayer = () => {
    if (mapRef.current.getLayer('building-rats-extrusion')) {
      console.log("Updating 'building-rats-extrusion' layer.");
      mapRef.current.setPaintProperty('building-rats-extrusion', 'fill-extrusion-color', [
        'interpolate',
        ['linear'],
        ['get', `${selectedYear}_rat_mean`],
        0, '#f8d4d4',
        0.5, '#f0a3a3',
        1, '#d44f4f',
      ]);
    }
  };

  const updateBuildingLayerVisibility = () => {
    if (mapRef.current.getLayer('building-rats-extrusion')) {
        console.log("Updating 'building-rats-extrusion' layer visibility.");
        
        const filter = selectedLandUses.length > 0 
            ? ['in', 'LandUse', ...selectedLandUses] 
            : ['!=', 'LandUse', 'unknown_value']; // Show all if no land uses are selected

        mapRef.current.setFilter('building-rats-extrusion', filter);
    }
};


  // Function to update the heatmap layer based on selected year
  const updateHeatmapLayer = () => {
    if (mapRef.current.getLayer('heatmap-layer')) {
      console.log("Filtering 'heatmap-layer' by selected year.");
      mapRef.current.setFilter('heatmap-layer', ['==', ['get', 'date'], selectedYear]);
    }
  };

  // Update the layers when `selectedYear` changes
  useEffect(() => {
    if (mapLoaded) {
      console.log(`Updating layers for the year ${selectedYear}.`);
      updateBuildingLayer();
      updateHeatmapLayer();
    }
  }, [selectedYear, mapLoaded]);

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
  };

  useEffect(() => {
    if (mapLoaded) {
      updateBuildingLayerVisibility(); // Call the visibility update function
    }
  }, [selectedLandUses, mapLoaded]);

  const handleLandUseChange = (value) => {
    setSelectedLandUses((prev) => {
      if (prev.includes(value)) {
        return prev.filter((lu) => lu !== value);
      } else {
        return [...prev, value];
      }
    });
  };



  

 

  return (
    <>
    <TopBar />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // Stack components vertically
        
        alignItems: 'stretch', // Stretch children to avoid shifts
        position: 'absolute',
        borderRadius: '8px',
        top: '110px',
        right: '10px',
        zIndex: 10,
        width: '500px', // Set the width for the container
        height: 'auto', // Let height adjust based on content
        
        
        
        
      }}
    >
      
       <LandUseFilter
        selectedLandUses={selectedLandUses}
        onChange={handleLandUseChange} // Pass the handler to LandUseFilter
        
      />
      <LayerToggleMenu
        layers={layers}
        activeLayerIds={activeLayerIds}
        setActiveLayerIds={setActiveLayerIds}
      />
      </div>
      <div id="map-container" ref={mapContainerRef} />
      <YearSlider selectedYear={selectedYear} onYearChange={handleYearChange} />
      <Legend />
    </>
  );
};

export default App;
