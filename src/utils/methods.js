export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export const getAddressFromCoords = async (lat, lng) => {
  const apiKey = "AIzaSyA4giJjY94Cl2MJegYyp0NZYIUEOUTq9I0";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error("Unable to fetch address");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown location";
  }
};
