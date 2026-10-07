import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function CityDetails() {
  const { city } = useParams();

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const cityName = decodeURIComponent(city);

        const currentResponse = await api.get(
          `/aqi/${encodeURIComponent(cityName)}`
        );

        setData(currentResponse.data.data);

        try {
          const historyResponse = await api.get(
            `/aqi/${encodeURIComponent(cityName)}/history`
          );

          setHistory(historyResponse.data.data);
        } catch (historyError) {
          console.log("History unavailable");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to fetch city AQI"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [city]);

  if (loading) {
    return <h2 className="center">Loading...</h2>;
  }

  if (error) {
    return <h2 className="center">{error}</h2>;
  }

  return (
    <div className="city-details">
      <h1>{data.city}</h1>

      <div className="city-aqi">
        <h2>Current AQI</h2>
        <div className="large-aqi">
          {data.aqi}
        </div>
      </div>

      <h2>Pollutants</h2>

      <div className="pollutant-grid">
        <div>PM2.5: {data.pm25}</div>
        <div>PM10: {data.pm10}</div>
        <div>NO₂: {data.no2}</div>
        <div>SO₂: {data.so2}</div>
        <div>CO: {data.co}</div>
        <div>O₃: {data.o3}</div>
      </div>

      <h2>Recent History</h2>

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-item">
              <strong>AQI: {item.aqi}</strong>

              <span>
                {new Date(
                  item.recordedAt
                ).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CityDetails;