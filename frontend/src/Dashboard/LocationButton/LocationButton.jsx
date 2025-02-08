import React, { useState } from "react";

const LocationButton = () => {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [error, setError] = useState(null);

  const getLocation = () => {
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });

        console.log("📍 Raw Coordinates:", lat, lng); // Debug: Log exact coordinates

        try {
          // 🔹 Fetch location name using OpenStreetMap API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          console.log("📌 Location Name:", data.display_name); // Debug: Log location name
          
          if (data.display_name) {
            setLocationName(data.display_name);
          } else {
            setLocationName("Location name not found");
          }
        } catch (error) {
          console.error("❌ Error fetching location name:", error);
          setLocationName("Error fetching location name");
        }
      },
      (error) => {
        console.error("❌ Error getting location:", error.message);
        setError(error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // 🔹 Force GPS Accuracy
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
      >
        Get My Location
      </button>

      {error && <p className="text-red-500">❌ {error}</p>}

      {location && (
        <div className="text-center">
          <p>📍 Latitude: {location.lat}, Longitude: {location.lng}</p>
          <p className="font-bold text-lg">📌 Location: {locationName || "Loading..."}</p>
        </div>
      )}
    </div>
  );
};

export default LocationButton;
