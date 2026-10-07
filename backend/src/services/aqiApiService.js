const getCityCoordinates = async (city) => {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(city)}` +
    `&count=1` +
    `&language=en` +
    `&format=json` +
    `&countryCode=IN`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Geocoding API failed");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }

  return data.results[0];
};


// Get live AQI for one city
const getAQIFromAPI = async (city) => {
  const location = await getCityCoordinates(city);

  const { latitude, longitude, name } = location;

  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Air Quality API failed");
  }

  const data = await response.json();

  return {
    city: name,
    latitude,
    longitude,
    aqi: data.current?.us_aqi ?? 0,
    pm25: data.current?.pm2_5 ?? 0,
    pm10: data.current?.pm10 ?? 0,
    no2: data.current?.nitrogen_dioxide ?? 0,
    so2: data.current?.sulphur_dioxide ?? 0,
    co: data.current?.carbon_monoxide ?? 0,
    o3: data.current?.ozone ?? 0,
    recordedAt: data.current?.time || new Date(),
  };
};


// Get live AQI for major Indian cities
const getIndiaAQI = async () => {
  const cities = [
    { city: "Delhi", latitude: 28.6139, longitude: 77.2090 },
    { city: "Mumbai", latitude: 19.0760, longitude: 72.8777 },
    { city: "Kolkata", latitude: 22.5726, longitude: 88.3639 },
    { city: "Bengaluru", latitude: 12.9716, longitude: 77.5946 },
    { city: "Chennai", latitude: 13.0827, longitude: 80.2707 },
    { city: "Hyderabad", latitude: 17.3850, longitude: 78.4867 },
    { city: "Ahmedabad", latitude: 23.0225, longitude: 72.5714 },
    { city: "Pune", latitude: 18.5204, longitude: 73.8567 },
    { city: "Jaipur", latitude: 26.9124, longitude: 75.7873 },
    { city: "Lucknow", latitude: 26.8467, longitude: 80.9462 },
    { city: "Patna", latitude: 25.5941, longitude: 85.1376 },
    { city: "Chandigarh", latitude: 30.7333, longitude: 76.7794 },
    { city: "Bhopal", latitude: 23.2599, longitude: 77.4126 },
    { city: "Bhubaneswar", latitude: 20.2961, longitude: 85.8245 },
    { city: "Guwahati", latitude: 26.1445, longitude: 91.7362 },
  ];

  const results = await Promise.all(
    cities.map(async (city) => {
      try {
        const url =
          `https://air-quality-api.open-meteo.com/v1/air-quality` +
          `?latitude=${city.latitude}` +
          `&longitude=${city.longitude}` +
          `&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
          `&timezone=auto`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("AQI API failed");
        }

        const data = await response.json();

        return {
          city: city.city,
          latitude: city.latitude,
          longitude: city.longitude,
          aqi: data.current?.us_aqi ?? 0,
          pm25: data.current?.pm2_5 ?? 0,
          pm10: data.current?.pm10 ?? 0,
          no2: data.current?.nitrogen_dioxide ?? 0,
          so2: data.current?.sulphur_dioxide ?? 0,
          co: data.current?.carbon_monoxide ?? 0,
          o3: data.current?.ozone ?? 0,
          recordedAt: data.current?.time || new Date(),
        };
      } catch (error) {
        return {
          city: city.city,
          latitude: city.latitude,
          longitude: city.longitude,
          aqi: null,
          error: "AQI unavailable",
        };
      }
    })
  );

  return results;
};
// Get historical air quality data
const getHistoricalAQI = async (city, days = 7) => {
  const location = await getCityCoordinates(city);

  const { latitude, longitude, name } = location;

  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - Number(days));

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const startDateString = formatDate(startDate);
  const endDateString = formatDate(endDate);

  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone` +
    `&start_date=${startDateString}` +
    `&end_date=${endDateString}` +
    `&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Historical Air Quality API failed");
  }

  const data = await response.json();

  return {
    city: name,
    latitude,
    longitude,
    startDate: startDateString,
    endDate: endDateString,
    time: data.hourly?.time || [],
    aqi: data.hourly?.us_aqi || [],
    pm25: data.hourly?.pm2_5 || [],
    pm10: data.hourly?.pm10 || [],
    no2: data.hourly?.nitrogen_dioxide || [],
    so2: data.hourly?.sulphur_dioxide || [],
    co: data.hourly?.carbon_monoxide || [],
    o3: data.hourly?.ozone || [],
  };
};


module.exports = {
  getAQIFromAPI,
  getIndiaAQI,
  getHistoricalAQI,
};