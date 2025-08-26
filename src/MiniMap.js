// src/MiniMap.js
import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const containerStyle = {
  height: '200px',
  width: '100%',
  borderRadius: '8px',
  marginBottom: '10px'
};

function MiniMap({ lat, lng }) {
  const center = { lat, lng };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16} // Zoom in closer
      options={{
        // Disable controls for a cleaner look
        disableDefaultUI: true, 
        zoomControl: true,
      }}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default React.memo(MiniMap);