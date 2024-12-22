// src/components/MapCard.js
import { React, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '120px',
};

const mapOptions = {
  disableDefaultUI: true,
  mapTypeId: 'roadmap',
};

const parseCoordinatesFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const query = params.get('query');
    if (query) {
      const [lat, lng] = query.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (error) {
    console.error('Invalid URL:', error);
  }
  return { lat: 14.5995, lng: 120.9842 };
};



const GoogleMapsCard = ({ item }) => {
  const [center, setCenter] = useState({ lat: 14.5995, lng: 120.9842 });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyA4giJjY94Cl2MJegYyp0NZYIUEOUTq9I0',
  });

  const handleMarkerClick = () => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  useEffect(() => {
    if (item.url) {
      const coordinates = parseCoordinatesFromUrl(item.url);
      setCenter(coordinates);
    }
  }, [item.url]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="max-w-md rounded-xl overflow-hidden mr-4">
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          options={mapOptions}
        >
          <Marker
            position={center}
            title="Location"
            icon="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            onClick={handleMarkerClick}
          />
        </GoogleMap>
        <div className="absolute bottom-0 w-full left-0 right-0 bg-chipBackground bg-opacity-70 text-white p-1">
          <p className="text-xs px-2 font-inter text-textColor font-normal p-0">{item.text}</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsCard;