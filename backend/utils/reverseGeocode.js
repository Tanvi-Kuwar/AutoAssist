const axios = require("axios");

async function getCity(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "en",
      },
      timeout: 5000,
    });

    const addr = res.data.address;

    return {
      city: addr.city || addr.town || addr.village || addr.suburb || addr.county,
      state: addr.state,
      country: addr.country,
    };
  } catch (err) {
    console.log("Geo error:", err.response?.status || err.message);

    return {
      city: "",
      state: "",
      country: "",
    };
  }
}

module.exports = getCity;