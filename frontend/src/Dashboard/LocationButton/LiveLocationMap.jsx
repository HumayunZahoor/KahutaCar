import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const RecenterMap = ({ position }) => {
  const map = useMap();
  map.setView(position, map.getZoom()); // Recenter the map when position updates
  return null;
};

const LiveLocationMap = () => {
  const [location, setLocation] = useState(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("❌ Error getting location:", error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <button onClick={getLocation} className="bg-blue-500 text-white px-4 py-2 rounded">
        Get My Location
      </button>
      {location && (
        <>
          <p>📍 Latitude: {location.lat}, Longitude: {location.lng}</p>
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "500px", width: "100%" }}>
            <RecenterMap position={[location.lat, location.lng]} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here!</Popup>
            </Marker>
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default LiveLocationMap;