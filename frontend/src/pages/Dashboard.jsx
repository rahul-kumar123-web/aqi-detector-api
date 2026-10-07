import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../api/axios";

import AQIChatbot from "../components/AQIChatbot";
import AirQualityMap from "../components/AirQualityMap";
import HistoricalAnalysis from "../components/HistoricalAnalysis";
import AirQualityCalendar from "../components/AirQualityCalendar";
import MajorAirPollutants from "../components/MajorAirPollutants";

import "./Dashboard.css";

// ================= AQI STATUS =================

const getAQIStatus = (aqi) => {
  if (aqi === undefined || aqi === null || Number.isNaN(aqi)) {
    return {
      label: "Unknown",
      className: "unknown",
      description: "AQI information unavailable",
    };
  }

  if (aqi <= 50) {
    return {
      label: "Good",
      className: "good",
      description: "Air quality is satisfactory",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Moderate",
      className: "moderate",
      description: "Air quality is acceptable",
    };
  }

  if (aqi <= 150) {
    return {
      label: "Unhealthy for Sensitive Groups",
      className: "sensitive",
      description: "Sensitive people may experience effects",
    };
  }

  if (aqi <= 200) {
    return {
      label: "Unhealthy",
      className: "unhealthy",
      description: "Everyone may experience health effects",
    };
  }

  if (aqi <= 300) {
    return {
      label: "Very Unhealthy",
      className: "very-unhealthy",
      description: "Health alert: increased risk",
    };
  }

  return {
    label: "Hazardous",
    className: "hazardous",
    description: "Health emergency conditions",
  };
};

// ================= WEATHER INFO =================

const getWeatherInfo = (code) => {
  const weatherMap = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mainly clear", icon: "🌤️" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },

    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Fog", icon: "🌫️" },

    51: { text: "Light drizzle", icon: "🌦️" },
    53: { text: "Drizzle", icon: "🌦️" },
    55: { text: "Heavy drizzle", icon: "🌧️" },

    61: { text: "Light rain", icon: "🌦️" },
    63: { text: "Rain", icon: "🌧️" },
    65: { text: "Heavy rain", icon: "🌧️" },

    71: { text: "Light snow", icon: "🌨️" },
    73: { text: "Snow", icon: "❄️" },
    75: { text: "Heavy snow", icon: "❄️" },

    80: { text: "Rain showers", icon: "🌦️" },
    81: { text: "Rain showers", icon: "🌧️" },
    82: { text: "Heavy showers", icon: "⛈️" },

    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm", icon: "⛈️" },
    99: { text: "Thunderstorm", icon: "⛈️" },
  };

  return (
    weatherMap[code] || {
      text: "Unknown",
      icon: "🌍",
    }
  );
};

// ================= UPDATED TIME =================

const formatUpdatedTime = () => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ================= DASHBOARD =================

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCity =
    searchParams.get("city")?.trim() || "Kolkata";

  const [cityInput, setCityInput] = useState(selectedCity);

  const [data, setData] = useState(null);
  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  // ================= FETCH DASHBOARD =================

  useEffect(() => {
    setCityInput(selectedCity);
    fetchDashboardData(selectedCity);
  }, [selectedCity]);

  // ================= FETCH LIVE AQI =================

  const fetchDashboardData = async (city = selectedCity) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      // Only live AQI is fetched here.
      // HistoricalAnalysis handles historical data separately.

      const response = await api.get(
        `/aqi/${encodeURIComponent(city)}/live`
      );

      const liveData = response.data?.data;

      if (!liveData) {
        throw new Error("AQI data not found");
      }

      setData(liveData);
      setUpdatedAt(formatUpdatedTime());

      // Fetch weather using latitude and longitude
      if (
        liveData.latitude !== undefined &&
        liveData.longitude !== undefined
      ) {
        fetchWeather(
          liveData.latitude,
          liveData.longitude
        );
      }
    } catch (err) {
      console.error("Dashboard AQI error:", err);

      setData(null);

      setError(
        err.response?.data?.message ||
          "Unable to load AQI data. Please check the city name."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH WEATHER =================

  const fetchWeather = async (latitude, longitude) => {
    try {
      setWeatherLoading(true);

      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&daily=uv_index_max` +
        `&timezone=auto`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Weather API failed");
      }

      const weatherData = await response.json();

      setWeather({
        temperature:
          weatherData.current?.temperature_2m,

        humidity:
          weatherData.current?.relative_humidity_2m,

        windSpeed:
          weatherData.current?.wind_speed_10m,

        weatherCode:
          weatherData.current?.weather_code,

        uvIndex:
          weatherData.daily?.uv_index_max?.[0],
      });
    } catch (err) {
      console.error("Weather error:", err);

      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // ================= SEARCH CITY =================

  const handleSearch = (event) => {
    event.preventDefault();

    const city = cityInput.trim();

    if (!city) {
      return;
    }

    setSearchParams({
      city,
    });
  };

  // ================= REFRESH =================

  const handleRefresh = () => {
    fetchDashboardData(selectedCity);
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>

          <h2>Loading AQI data...</h2>

          <p>
            Fetching latest air quality information
          </p>
        </div>

        <AQIChatbot />
      </div>
    );
  }

  // ================= ERROR =================

  if (error || !data) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            Unable to load AQI data
          </h2>

          <p>
            {error ||
              "AQI data is currently unavailable."}
          </p>

          <button
            className="retry-button"
            onClick={() =>
              fetchDashboardData(selectedCity)
            }
          >
            ↻ Try Again
          </button>
        </div>

        <AQIChatbot />
      </div>
    );
  }

  // ================= DATA =================

  const aqi = Number(data.aqi);

  const status = getAQIStatus(aqi);

  const weatherInfo = getWeatherInfo(
    weather?.weatherCode
  );

  // ================= UI =================

  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">
        <div className="header-container">

          <div className="brand-area">

            <div className="brand-icon">
              🌿
            </div>

            <div>
              <h1>
                Air Quality Dashboard
              </h1>

              <p>
                Real-time air pollution monitoring
              </p>
            </div>

          </div>

          <div className="header-actions">

            <div className="live-indicator">
              <span className="live-dot"></span>
              LIVE
            </div>

            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={loading}
            >
              ↻ Refresh
            </button>

          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="dashboard-container">

        {/* ================= SEARCH ================= */}

        <section className="city-search-section">

          <div className="city-heading">

            <span className="location-icon">
              📍
            </span>

            <div>

              <span className="small-label">
                CURRENT LOCATION
              </span>

              <h2>
                {data.city}
              </h2>

            </div>

          </div>

          <form
            className="city-search-form"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              value={cityInput}
              onChange={(event) =>
                setCityInput(event.target.value)
              }
              placeholder="Search city..."
            />

            <button type="submit">
              🔍 Search
            </button>

          </form>

        </section>

        {/* ================= LAST UPDATED ================= */}

        <div className="last-updated">

          <span className="status-dot"></span>

          Last updated at{" "}
          {updatedAt || "--:--"}

          <button onClick={handleRefresh}>
            Update now
          </button>

        </div>

        {/* ================= MAIN AQI CARD ================= */}

        <section className="main-aqi-card">

          <div className="aqi-card-top">

            <div>

              <span className="aqi-label">
                CURRENT AIR QUALITY INDEX
              </span>

              <div className="aqi-location">
                {data.city}
              </div>

            </div>

            <div
              className={`aqi-status ${status.className}`}
            >

              <span className="status-circle"></span>

              {status.label}

            </div>

          </div>

          <div className="aqi-main-content">

            <div className="aqi-number-wrapper">

              <div
                className={`aqi-number ${status.className}`}
              >
                {Math.round(aqi)}
              </div>

              <div className="aqi-unit">
                US AQI
              </div>

            </div>

            <div className="aqi-description">

              <h3>
                {status.label}
              </h3>

              <p>
                {status.description}
              </p>

              <div className="aqi-source">
                Source: Open-Meteo
              </div>

            </div>

            {/* PRIMARY POLLUTANTS */}

            <div className="primary-pollutants">

              <div className="primary-pollutant">

                <span className="pollutant-icon">
                  🫁
                </span>

                <div>

                  <span>
                    PM2.5
                  </span>

                  <strong>
                    {data.pm25 ?? "--"}
                  </strong>

                  <small>
                    µg/m³
                  </small>

                </div>

              </div>

              <div className="primary-pollutant">

                <span className="pollutant-icon">
                  🌫️
                </span>

                <div>

                  <span>
                    PM10
                  </span>

                  <strong>
                    {data.pm10 ?? "--"}
                  </strong>

                  <small>
                    µg/m³
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* ================= AQI SCALE ================= */}

          <div className="aqi-scale-section">

            <div className="scale-header">

              <span>
                US AQI Scale
              </span>

              <strong>
                {Math.round(aqi)}
              </strong>

            </div>

            <div className="aqi-scale">

              <div className="scale-segment good"></div>

              <div className="scale-segment moderate"></div>

              <div className="scale-segment sensitive"></div>

              <div className="scale-segment unhealthy"></div>

              <div className="scale-segment very-unhealthy"></div>

              <div className="scale-segment hazardous"></div>

              <div
                className="aqi-marker"
                style={{
                  left: `${Math.min(
                    (aqi / 500) * 100,
                    100
                  )}%`,
                }}
              >
                <span></span>
              </div>

            </div>

            <div className="scale-labels">

              <span>0</span>
              <span>50</span>
              <span>100</span>
              <span>150</span>
              <span>200</span>
              <span>300</span>
              <span>500+</span>

            </div>

            <div className="scale-legend">

              <span>
                <i className="legend-good"></i>
                Good
              </span>

              <span>
                <i className="legend-moderate"></i>
                Moderate
              </span>

              <span>
                <i className="legend-sensitive"></i>
                Sensitive
              </span>

              <span>
                <i className="legend-unhealthy"></i>
                Unhealthy
              </span>

              <span>
                <i className="legend-very"></i>
                Very Unhealthy
              </span>

              <span>
                <i className="legend-hazardous"></i>
                Hazardous
              </span>

            </div>

          </div>

        </section>

        {/* ================= WEATHER ================= */}

        <section className="section-block">

          <div className="section-title">

            <div>

              <span className="section-kicker">
                WEATHER
              </span>

              <h2>
                Current Weather
              </h2>

            </div>

            <span className="section-badge">

              {weatherLoading
                ? "Loading..."
                : "Live"}

            </span>

          </div>

          <div className="weather-grid">

            {/* Temperature */}

            <div className="weather-card">

              <div className="weather-icon">
                🌡️
              </div>

              <div>

                <span>
                  Temperature
                </span>

                <strong>

                  {weather?.temperature !==
                  undefined
                    ? `${weather.temperature}°C`
                    : "--"}

                </strong>

              </div>

            </div>

            {/* Conditions */}

            <div className="weather-card">

              <div className="weather-icon">
                {weatherInfo.icon}
              </div>

              <div>

                <span>
                  Conditions
                </span>

                <strong>

                  {weather
                    ? weatherInfo.text
                    : "--"}

                </strong>

              </div>

            </div>

            {/* Humidity */}

            <div className="weather-card">

              <div className="weather-icon">
                💧
              </div>

              <div>

                <span>
                  Humidity
                </span>

                <strong>

                  {weather?.humidity !==
                  undefined
                    ? `${weather.humidity}%`
                    : "--"}

                </strong>

              </div>

            </div>

            {/* Wind */}

            <div className="weather-card">

              <div className="weather-icon">
                💨
              </div>

              <div>

                <span>
                  Wind Speed
                </span>

                <strong>

                  {weather?.windSpeed !==
                  undefined
                    ? `${weather.windSpeed} km/h`
                    : "--"}

                </strong>

              </div>

            </div>

            {/* UV */}

            <div className="weather-card">

              <div className="weather-icon">
                ☀️
              </div>

              <div>

                <span>
                  UV Index
                </span>

                <strong>

                  {weather?.uvIndex !==
                  undefined
                    ? weather.uvIndex
                    : "--"}

                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* ================= MAJOR AIR POLLUTANTS ================= */}

        <MajorAirPollutants data={data} />

        {/* ================= AIR QUALITY CALENDAR ================= */}

        <AirQualityCalendar
          city={data.city}
        />

        {/* ================= LOCATION / MAP ================= */}

        <section className="section-block">

          <div className="section-title">

            <div>

              <span className="section-kicker">
                LOCATION
              </span>

              <h2>
                Air Quality Map
              </h2>

            </div>

          </div>

          <div className="map-wrapper">

            <AirQualityMap />

          </div>

        </section>

        {/* ================= HISTORICAL ================= */}

        <section className="section-block">

          <HistoricalAnalysis
            city={data.city}
          />

        </section>

      </main>

      {/* ================= CHATBOT ================= */}

      <AQIChatbot />

    </div>
  );
};

export default Dashboard;