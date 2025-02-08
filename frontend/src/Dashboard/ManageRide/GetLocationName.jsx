import axios from "axios";

const GetLocationName = async (lat, lon, callback) => {
  try {
    console.log("📍 Fetching location for:", lat, lon); // Debugging log

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    console.log("📌 Location Name:", data.display_name); // Debugging log

    if (data.display_name) {
      callback(data.display_name);
    } else {
      callback("Location name not found");
    }
  } catch (error) {
    console.error("❌ Error fetching location name:", error);
    callback("Unable to fetch location. Please try again.");
  }
};

export default GetLocationName;
