import axios from 'axios';

// Function to fetch the location name from latitude and longitude using Nominatim API
const getLocationName = async (lat, lon, callback) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat: lat,
        lon: lon,
        format: 'json',
        addressdetails: 1,
      },
    });

    if (response.data && response.data.address) {
      const { road, suburb, city, country } = response.data.address;
      const locationName = `${road || ''}, ${suburb || ''}, ${city || ''}, ${country || ''}`.trim();
      callback(locationName); // Pass the location name to the callback function
    }
  } catch (error) {
    console.error("Error fetching location name:", error);
    callback('Unable to fetch location');
  }
};

export default getLocationName;
