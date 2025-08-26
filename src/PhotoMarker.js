// src/PhotoMarker.js
import React from 'react';
import { OverlayView } from '@react-google-maps/api';

const styles = {
  container: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    border: '3px solid white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    overflow: 'hidden',
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)' // Center the marker on the coordinate
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }
};

// This is a custom getPixelPositionOffset function to correctly position the marker
const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
});

function PhotoMarker({ lat, lng, imageUrl, onClick }) {
  return (
    <OverlayView
      position={{ lat, lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div style={styles.container} onClick={onClick}>
        <img src={imageUrl} alt="Report Thumbnail" style={styles.image} />
      </div>
    </OverlayView>
  );
}

export default React.memo(PhotoMarker);