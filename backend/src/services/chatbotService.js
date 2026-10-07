const {
  getAQIFromAPI,
  getHistoricalAQI,
} = require("./aqiApiService");

const chatbotResponse = async (message) => {
  const text = message.toLowerCase().trim();

  // -----------------------------------------
  // Greeting
  // -----------------------------------------

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return {
      reply:
        "👋 Hello! I am your AQI Assistant. Ask me about AQI, pollution, PM2.5, PM10 or a city's air quality.",
    };
  }

  // -----------------------------------------
  // General AQI information
  // -----------------------------------------

  if (
    text === "what is aqi" ||
    text.includes("what is aqi") ||
    text.includes("meaning of aqi")
  ) {
    return {
      reply:
        "AQI stands for Air Quality Index. It tells us how clean or polluted the air is. A higher AQI generally means poorer air quality.",
    };
  }

  // -----------------------------------------
  // PM2.5
  // -----------------------------------------

  if (text.includes("pm2.5")) {
    return {
      reply:
        "PM2.5 refers to very small particles in the air with a diameter of 2.5 micrometers or smaller. High PM2.5 levels can indicate poor air quality.",
    };
  }

  // -----------------------------------------
  // PM10
  // -----------------------------------------

  if (text.includes("pm10")) {
    return {
      reply:
        "PM10 refers to particulate matter with a diameter of 10 micrometers or smaller. Dust and construction activity are common sources.",
    };
  }

  // -----------------------------------------
  // Historical AQI
  // -----------------------------------------

  if (
    text.includes("history") ||
    text.includes("historical") ||
    text.includes("last 7 days")
  ) {
    const cities = [
      "Delhi",
      "Mumbai",
      "Kolkata",
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Ahmedabad",
      "Pune",
      "Jaipur",
      "Lucknow",
      "Patna",
      "Chandigarh",
      "Bhopal",
      "Bhubaneswar",
      "Guwahati",
    ];

    const city = cities.find((cityName) =>
      text.includes(cityName.toLowerCase())
    );

    if (!city) {
      return {
        reply:
          "Please mention a city. Example: 'Kolkata last 7 days AQI batao'.",
      };
    }

    const data = await getHistoricalAQI(city, 7);

    const validAQI = data.aqi.filter(
      (value) => value !== null && value !== undefined
    );

    if (!validAQI.length) {
      return {
        reply: `Sorry, historical AQI data is not available for ${city}.`,
      };
    }

    const average =
      validAQI.reduce((sum, value) => sum + value, 0) / validAQI.length;

    const maximum = Math.max(...validAQI);
    const minimum = Math.min(...validAQI);

    return {
      reply:
        `📊 ${city} last 7 days AQI analysis:\n\n` +
        `Average AQI: ${Math.round(average)}\n` +
        `Maximum AQI: ${maximum}\n` +
        `Minimum AQI: ${minimum}`,
    };
  }

  // -----------------------------------------
  // Live AQI
  // -----------------------------------------

  // -----------------------------------------
// Live AQI
// -----------------------------------------

const cities = [
  "Delhi",
  "Mumbai",
  "Kolkata",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Patna",
  "Chandigarh",
  "Bhopal",
  "Bhubaneswar",
  "Guwahati",
];

const city = cities.find((cityName) =>
  text.includes(cityName.toLowerCase())
);

// If user mentions a city, fetch its live AQI
if (city) {
  const data = await getAQIFromAPI(city);

  return {
    reply:
      `🌍 ${data.city} Air Quality\n\n` +
      `AQI: ${data.aqi}\n` +
      `PM2.5: ${data.pm25}\n` +
      `PM10: ${data.pm10}\n` +
      `NO₂: ${data.no2}\n` +
      `SO₂: ${data.so2}\n` +
      `CO: ${data.co}\n` +
      `O₃: ${data.o3}`,
  };
}

  // -----------------------------------------
  // Default response
  // -----------------------------------------

  return {
    reply:
      "🤖 I can help you with live AQI, historical AQI, PM2.5, PM10 and other air-quality information.\n\n" +
      "Try:\n" +
      "• Kolkata AQI\n" +
      "• Delhi air quality\n" +
      "• Kolkata last 7 days AQI\n" +
      "• What is PM2.5?",
  };
};

module.exports = {
  chatbotResponse,
};