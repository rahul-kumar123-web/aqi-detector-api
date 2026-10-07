import { Link } from "react-router-dom";

function AQICard({ city, aqi }) {
  const getStatus = () => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150)
      return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";

    return "Hazardous";
  };

  return (
    <div className="aqi-card">
      <h2>{city}</h2>

      <div className="aqi-number">
        {aqi}
      </div>

      <p>AQI</p>

      <strong>{getStatus()}</strong>

      <Link
        to={`/city/${encodeURIComponent(city)}`}
        className="details-btn"
      >
        View Details
      </Link>
    </div>
  );
}

export default AQICard;