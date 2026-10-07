
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import api from "../api/axios";


// ========================================
// AQI STATUS
// ========================================

function getAQIStatus(aqi) {
  if (aqi === null || aqi === undefined) {
    return {
      label: "Unavailable",
      className: "map-unavailable",
      color: "#94a3b8",
    };
  }

  if (aqi <= 50) {
    return {
      label: "Good",
      className: "map-good",
      color: "#16a34a",
    };
  }

  if (aqi <= 100) {
    return {
      label: "Moderate",
      className: "map-moderate",
      color: "#eab308",
    };
  }

  if (aqi <= 150) {
    return {
      label: "Sensitive",
      className: "map-sensitive",
      color: "#f97316",
    };
  }

  if (aqi <= 200) {
    return {
      label: "Unhealthy",
      className: "map-unhealthy",
      color: "#ef4444",
    };
  }

  if (aqi <= 300) {
    return {
      label: "Very Unhealthy",
      className: "map-very-unhealthy",
      color: "#a855f7",
    };
  }

  return {
    label: "Hazardous",
    className: "map-hazardous",
    color: "#7f1d1d",
  };
}


// ========================================
// MAP VIEW
// ========================================

function IndiaMapView({ cities, selectedCity, setSelectedCity }) {
  const map = useMap();

  useEffect(() => {
    map.setView([22.5, 80], 5);
  }, [map]);

  useEffect(() => {
    if (selectedCity) {
      map.flyTo(
        [selectedCity.latitude, selectedCity.longitude],
        7,
        {
          duration: 1,
        }
      );
    }
  }, [selectedCity, map]);

  return (
    <>
      {cities.map((city) => {
        if (
          city.aqi === null ||
          city.latitude === undefined ||
          city.longitude === undefined
        ) {
          return null;
        }

        const status = getAQIStatus(city.aqi);

        return (
          <CircleMarker
            key={city.city}
            center={[
              city.latitude,
              city.longitude,
            ]}
            radius={
              selectedCity?.city === city.city
                ? 16
                : 11
            }
            pathOptions={{
              color: status.color,
              fillColor: status.color,
              fillOpacity: 0.85,
              weight:
                selectedCity?.city === city.city
                  ? 5
                  : 3,
            }}
            eventHandlers={{
              click: () => {
                setSelectedCity(city);
              },
            }}
          >
            <Popup>
              <div className="map-popup">

                <div className="popup-top">

                  <div>
                    <span className="popup-country">
                      🇮🇳 INDIA
                    </span>

                    <h3>{city.city}</h3>
                  </div>

                  <div
                    className="popup-status-dot"
                    style={{
                      backgroundColor:
                        status.color,
                    }}
                  ></div>

                </div>


                <div className="popup-aqi-box">

                  <div>
                    <span className="popup-aqi-label">
                      US AQI
                    </span>

                    <strong
                      style={{
                        color: status.color,
                      }}
                    >
                      {city.aqi}
                    </strong>
                  </div>

                  <span
                    className={`popup-status ${status.className}`}
                  >
                    {status.label}
                  </span>

                </div>


                <div className="popup-divider"></div>


                <div className="popup-pollutants">

                  <div>
                    <span>PM2.5</span>
                    <strong>
                      {city.pm25 ?? "--"}
                    </strong>
                    <small>µg/m³</small>
                  </div>

                  <div>
                    <span>PM10</span>
                    <strong>
                      {city.pm10 ?? "--"}
                    </strong>
                    <small>µg/m³</small>
                  </div>

                  <div>
                    <span>NO₂</span>
                    <strong>
                      {city.no2 ?? "--"}
                    </strong>
                    <small>µg/m³</small>
                  </div>

                  <div>
                    <span>SO₂</span>
                    <strong>
                      {city.so2 ?? "--"}
                    </strong>
                    <small>µg/m³</small>
                  </div>

                </div>


                <div className="popup-footer">
                  <span>● Live data</span>
                  <span>
                    {city.recordedAt || "Updated"}
                  </span>
                </div>

              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}


// ========================================
// MAIN COMPONENT
// ========================================

function AirQualityMap() {

  const [cities, setCities] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedCity, setSelectedCity] =
    useState(null);


  // ========================================
  // FETCH INDIA AQI
  // ========================================

  const fetchIndiaAQI = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/aqi/india");

      const cityData =
        response.data.data || [];

      setCities(cityData);

      if (cityData.length > 0) {
        setSelectedCity(cityData[0]);
      }

    } catch (error) {

      setError(
        error.response?.data?.message ||
          "Unable to load India AQI data"
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchIndiaAQI();
  }, []);


  // ========================================
  // CITY SELECT
  // ========================================

  const handleCitySelect = (city) => {

    setSelectedCity(city);

  };


  // ========================================
  // LOADING UI
  // ========================================

  if (loading) {

    return (
      <section className="india-map-section">

        <div className="map-header">

          <div>

            <span className="map-label">
              LIVE MONITORING
            </span>

            <h2>
              India Air Quality
            </h2>

            <p>
              Loading real-time air quality
              data across major Indian cities...
            </p>

          </div>

        </div>


        <div className="map-loading">

          <div className="map-loader"></div>

          <strong>
            Loading India AQI...
          </strong>

          <span>
            Fetching live air quality data
          </span>

        </div>

      </section>
    );

  }


  // ========================================
  // ERROR UI
  // ========================================

  if (error) {

    return (
      <section className="india-map-section">

        <div className="map-header">

          <div>

            <span className="map-label">
              LIVE MONITORING
            </span>

            <h2>
              India Air Quality
            </h2>

          </div>

        </div>


        <div className="map-error">

          <div className="map-error-icon">
            ⚠️
          </div>

          <div>

            <strong>
              Unable to load AQI data
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={fetchIndiaAQI}
            >
              Try Again
            </button>

          </div>

        </div>

      </section>
    );

  }


  // ========================================
  // MAIN UI
  // ========================================

  return (

    <section className="india-map-section">


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="map-header">

        <div>

          <div className="map-label-row">

            <span className="map-live-dot"></span>

            <span className="map-label">
              LIVE MONITORING
            </span>

          </div>

          <h2>
            India Air Quality
          </h2>

          <p>
            Real-time air quality across
            major Indian cities
          </p>

        </div>


        <button
          className="map-refresh-btn"
          onClick={fetchIndiaAQI}
          disabled={loading}
        >
          <span className="refresh-icon">
            ↻
          </span>

          Refresh
        </button>

      </div>


      {/* ====================================
          MAP + SIDE INFO
      ==================================== */}

      <div className="map-layout">


        {/* MAP */}

        <div className="map-wrapper">

          <MapContainer
            center={[22.5, 80]}
            zoom={5}
            minZoom={4}
            maxZoom={9}
            scrollWheelZoom={true}
            className="india-leaflet-map"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <IndiaMapView
              cities={cities}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />

          </MapContainer>


          {/* MAP OVERLAY */}

          <div className="map-overlay-badge">

            <span>●</span>

            Live AQI

          </div>

        </div>


        {/* ====================================
            CITY LIST
        ==================================== */}

        <div className="map-city-panel">

          <div className="city-panel-header">

            <div>

              <span>
                CITIES
              </span>

              <h3>
                Air Quality
              </h3>

            </div>

            <strong>
              {cities.length}
            </strong>

          </div>


          <div className="city-list">

            {cities.map((city) => {

              const status =
                getAQIStatus(city.aqi);

              const isSelected =
                selectedCity?.city ===
                city.city;

              return (

                <button
                  key={city.city}
                  className={`city-list-item ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleCitySelect(city)
                  }
                >

                  <div
                    className="city-color"
                    style={{
                      backgroundColor:
                        status.color,
                    }}
                  ></div>


                  <div className="city-list-info">

                    <strong>
                      {city.city}
                    </strong>

                    <span>
                      {status.label}
                    </span>

                  </div>


                  <div className="city-list-aqi">

                    <strong>
                      {city.aqi ?? "--"}
                    </strong>

                    <span>
                      AQI
                    </span>

                  </div>

                </button>

              );

            })}

          </div>

        </div>

      </div>


      {/* ====================================
          LEGEND
      ==================================== */}

      <div className="map-legend">

        <div className="legend-heading">
          AQI LEVEL
        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#16a34a",
            }}
          ></span>

          <span>Good</span>

          <small>0–50</small>

        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#eab308",
            }}
          ></span>

          <span>Moderate</span>

          <small>51–100</small>

        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#f97316",
            }}
          ></span>

          <span>Sensitive</span>

          <small>101–150</small>

        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#ef4444",
            }}
          ></span>

          <span>Unhealthy</span>

          <small>151–200</small>

        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#a855f7",
            }}
          ></span>

          <span>Very Unhealthy</span>

          <small>201–300</small>

        </div>


        <div className="legend-item">

          <span
            className="legend-color"
            style={{
              background: "#7f1d1d",
            }}
          ></span>

          <span>Hazardous</span>

          <small>300+</small>

        </div>

      </div>


      {/* ====================================
          SELECTED CITY
      ==================================== */}

      {selectedCity && (

        <div className="selected-city-card">

          <div className="selected-city-left">

            <div className="selected-city-icon">
              📍
            </div>

            <div>

              <span>
                SELECTED CITY
              </span>

              <h3>
                {selectedCity.city}
              </h3>

            </div>

          </div>


          <div className="selected-city-stats">

            <div>

              <span>
                AQI
              </span>

              <strong
                style={{
                  color:
                    getAQIStatus(
                      selectedCity.aqi
                    ).color,
                }}
              >
                {selectedCity.aqi}
              </strong>

            </div>


            <div>

              <span>
                PM2.5
              </span>

              <strong>
                {selectedCity.pm25 ?? "--"}
              </strong>

            </div>


            <div>

              <span>
                PM10
              </span>

              <strong>
                {selectedCity.pm10 ?? "--"}
              </strong>

            </div>


            <div>

              <span>
                NO₂
              </span>

              <strong>
                {selectedCity.no2 ?? "--"}
              </strong>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default AirQualityMap;

