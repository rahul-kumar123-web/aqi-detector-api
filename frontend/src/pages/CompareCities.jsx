
import { useState } from "react";
import api from "../api/axios";
import "./CompareCities.css";

const getAQIStatus = (aqi) => {
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
      label: "Sensitive",
      className: "sensitive",
      description: "Sensitive groups may be affected",
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
      description: "Health alert for everyone",
    };
  }

  return {
    label: "Hazardous",
    className: "hazardous",
    description: "Health emergency conditions",
  };
};

const Pollutant = ({ name, value, unit = "µg/m³" }) => {
  return (
    <div className="pollutant-item">
      <span className="pollutant-name">{name}</span>

      <div className="pollutant-value">
        <strong>{value ?? "—"}</strong>
        <small>{unit}</small>
      </div>
    </div>
  );
};

const CityCard = ({ result }) => {
  const status = getAQIStatus(result.aqi);

  return (
    <div className={`city-result-card ${status.className}`}>
      <div className="city-card-top">
        <div>
          <span className="live-label">
            <span className="live-dot"></span>
            LIVE DATA
          </span>

          <h2>{result.city}</h2>
        </div>

        <div className="location-icon">📍</div>
      </div>

      <div className="aqi-section">
        <div className={`aqi-circle ${status.className}`}>
          <span>AQI</span>
          <strong>{result.aqi}</strong>
        </div>

        <div className="aqi-info">
          <span className={`status-badge ${status.className}`}>
            {status.label}
          </span>

          <p>{status.description}</p>
        </div>
      </div>

      <div className="pollutants-header">
        <span>Pollutants</span>
        <span>Current</span>
      </div>

      <div className="pollutants-grid">
        <Pollutant name="PM2.5" value={result.pm25} />
        <Pollutant name="PM10" value={result.pm10} />
        <Pollutant name="NO₂" value={result.no2} />
        <Pollutant name="SO₂" value={result.so2} />
        <Pollutant name="CO" value={result.co} unit="µg/m³" />
        <Pollutant name="O₃" value={result.o3} />
      </div>
    </div>
  );
};

const CompareCities = () => {
  const [city1, setCity1] = useState("Patna");
  const [city2, setCity2] = useState("Delhi");

  const [result1, setResult1] = useState(null);
  const [result2, setResult2] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const compare = async () => {
    if (!city1.trim() || !city2.trim()) {
      setMessage("Please enter both cities");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const [response1, response2] = await Promise.all([
        api.get(`/aqi/${encodeURIComponent(city1.trim())}/live`),
        api.get(`/aqi/${encodeURIComponent(city2.trim())}/live`),
      ]);

      setResult1(response1.data.data);
      setResult2(response2.data.data);
    } catch (error) {
      console.error(error);

      setResult1(null);
      setResult2(null);

      setMessage(
        error.response?.data?.message ||
          "Unable to get live AQI. Please check the city names."
      );
    } finally {
      setLoading(false);
    }
  };

  const difference =
    result1 && result2
      ? Math.abs(result1.aqi - result2.aqi)
      : null;

  return (
    <div className="compare-page">
      {/* HERO */}

      <section className="compare-hero">
        <div className="hero-content">
          <div className="hero-icon">🌍</div>

          <div>
            <span className="hero-label">AIR QUALITY ANALYSIS</span>

            <h1>Compare Cities</h1>

            <p>
              Compare real-time air quality and pollution levels
              between two cities.
            </p>
          </div>
        </div>

        <div className="hero-status">
          <span className="live-dot"></span>
          Live AQI
        </div>
      </section>

      {/* SEARCH */}

      <section className="compare-controls">
        <div className="city-input-group">
          <label>First City</label>

          <div className="city-input">
            <span>📍</span>

            <input
              type="text"
              value={city1}
              onChange={(e) => setCity1(e.target.value)}
              placeholder="Enter first city"
            />
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div className="city-input-group">
          <label>Second City</label>

          <div className="city-input">
            <span>📍</span>

            <input
              type="text"
              value={city2}
              onChange={(e) => setCity2(e.target.value)}
              placeholder="Enter second city"
            />
          </div>
        </div>

        <button
          className="compare-button"
          onClick={compare}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Comparing...
            </>
          ) : (
            <>
              Compare
              <span>→</span>
            </>
          )}
        </button>
      </section>

      {/* MESSAGE */}

      {message && (
        <div className="compare-message">
          ⚠️ {message}
        </div>
      )}

      {/* RESULTS */}

      {result1 && result2 && (
        <>
          <div className="comparison-title">
            <div>
              <span>REAL-TIME RESULTS</span>
              <h2>Air Quality Comparison</h2>
            </div>

            <span className="updated-badge">
              ● Updated just now
            </span>
          </div>

          <section className="city-results">
            <CityCard result={result1} />

            <div className="center-vs">
              <div className="vs-circle">VS</div>
            </div>

            <CityCard result={result2} />
          </section>

          {/* DIFFERENCE */}

          <section className="difference-card">
            <div className="difference-icon">📊</div>

            <div className="difference-content">
              <span>AQI DIFFERENCE</span>

              <h3>{difference} points</h3>

              <p>
                The AQI values between {result1.city} and{" "}
                {result2.city} differ by {difference} points.
              </p>
            </div>

            <div className="difference-values">
              <div>
                <span>{result1.city}</span>
                <strong>{result1.aqi}</strong>
              </div>

              <div className="difference-line"></div>

              <div>
                <span>{result2.city}</span>
                <strong>{result2.aqi}</strong>
              </div>
            </div>
          </section>
        </>
      )}

      {/* EMPTY STATE */}

      {!result1 && !result2 && !loading && !message && (
        <div className="empty-compare">
          <div>🌿</div>
          <h3>Ready to compare?</h3>
          <p>
            Enter two cities above to see their real-time air
            quality data.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompareCities;

