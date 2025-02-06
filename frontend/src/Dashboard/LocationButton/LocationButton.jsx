import React, { useState } from "react";

const LocationButton = () => {
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
        <p>
          📍 Latitude: {location.lat}, Longitude: {location.lng}
        </p>
      )}
    </div>
  );
};

export default LocationButton;