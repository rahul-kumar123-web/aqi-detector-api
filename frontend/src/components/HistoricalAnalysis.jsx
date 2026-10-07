
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./HistoricalAnalysis.css";

const METRICS = {
  aqi: {
    label: "AQI",
    color: "#2563eb",
    unit: "",
  },
  pm25: {
    label: "PM2.5",
    color: "#16a34a",
    unit: " µg/m³",
  },
  pm10: {
    label: "PM10",
    color: "#ea580c",
    unit: " µg/m³",
  },
  no2: {
    label: "NO₂",
    color: "#9333ea",
    unit: " µg/m³",
  },
  so2: {
    label: "SO₂",
    color: "#dc2626",
    unit: " µg/m³",
  },
  co: {
    label: "CO",
    color: "#0891b2",
    unit: " µg/m³",
  },
  o3: {
    label: "O₃",
    color: "#ca8a04",
    unit: " µg/m³",
  },
};

// ==========================================
// Indian Cities
// ==========================================

const CITIES = [
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

const HistoricalAnalysis = ({ city = "Kolkata" }) => {
  const [selectedCity, setSelectedCity] = useState(city);

  const [days, setDays] = useState(7);

  const [selectedMetric, setSelectedMetric] = useState("aqi");

  const [historyData, setHistoryData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // Fetch Historical Data
  // ==========================================

  const fetchHistory = async () => {
    if (!selectedCity) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/aqi/${encodeURIComponent(
          selectedCity
        )}/history?days=${days}`
      );

      if (response.data.success) {
        setHistoryData(response.data.data);
      } else {
        setError("Historical data not available");
      }
    } catch (err) {
      console.error("Historical AQI error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load historical air quality data"
      );

      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch when city or days changes
  // ==========================================

  useEffect(() => {
    fetchHistory();
  }, [selectedCity, days]);

  // ==========================================
  // Convert API data for Recharts
  // ==========================================

  const chartData = useMemo(() => {
    if (!historyData?.time) {
      return [];
    }

    return historyData.time.map((time, index) => ({
      time,

      aqi: historyData.aqi?.[index] ?? null,

      pm25: historyData.pm25?.[index] ?? null,

      pm10: historyData.pm10?.[index] ?? null,

      no2: historyData.no2?.[index] ?? null,

      so2: historyData.so2?.[index] ?? null,

      co: historyData.co?.[index] ?? null,

      o3: historyData.o3?.[index] ?? null,
    }));
  }, [historyData]);

  // ==========================================
  // Current Metric Values
  // ==========================================

  const metricValues = useMemo(() => {
    return chartData
      .map((item) => item[selectedMetric])
      .filter(
        (value) =>
          value !== null &&
          value !== undefined &&
          !Number.isNaN(Number(value))
      )
      .map(Number);
  }, [chartData, selectedMetric]);

  // ==========================================
  // Statistics
  // ==========================================

  const statistics = useMemo(() => {
    if (!metricValues.length) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
      };
    }

    const total = metricValues.reduce(
      (sum, value) => sum + value,
      0
    );

    return {
      average: total / metricValues.length,
      highest: Math.max(...metricValues),
      lowest: Math.min(...metricValues),
    };
  }, [metricValues]);

  // ==========================================
  // Format Chart Time
  // ==========================================

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // ==========================================
  // Format Tooltip
  // ==========================================

  const formatTooltipTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const metric = METRICS[selectedMetric];

  return (
    <section className="historical-section">

      {/* ======================================
          Header
      ====================================== */}

      <div className="historical-header">

        <div>
          <h2>Historical Air Quality Analysis</h2>

          <p>
            Analyze recent air quality trends for{" "}
            <strong>
              {historyData?.city || selectedCity}
            </strong>
          </p>
        </div>

        <button
          className="historical-refresh-btn"
          onClick={fetchHistory}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>

      </div>

      {/* ======================================
          Controls
      ====================================== */}

      <div className="historical-controls">

        {/* City */}

        <div className="control-group">

          <label>City</label>

          <select
            className="city-select"
            value={selectedCity}
            onChange={(e) =>
              setSelectedCity(e.target.value)
            }
          >

            {CITIES.map((cityName) => (
              <option
                key={cityName}
                value={cityName}
              >
                {cityName}
              </option>
            ))}

          </select>

        </div>

        {/* Time Period */}

        <div className="control-group">

          <label>Time Period</label>

          <select
            value={days}
            onChange={(e) =>
              setDays(Number(e.target.value))
            }
          >
            <option value={3}>
              Last 3 Days
            </option>

            <option value={7}>
              Last 7 Days
            </option>

            <option value={14}>
              Last 14 Days
            </option>

            <option value={30}>
              Last 30 Days
            </option>
          </select>

        </div>

      </div>

      {/* ======================================
          Metric Buttons
      ====================================== */}

      <div className="metric-tabs">

        {Object.entries(METRICS).map(
          ([key, item]) => (

            <button
              key={key}
              className={
                selectedMetric === key
                  ? "metric-tab active"
                  : "metric-tab"
              }
              onClick={() =>
                setSelectedMetric(key)
              }
            >
              {item.label}
            </button>

          )
        )}

      </div>

      {/* ======================================
          Error
      ====================================== */}

      {error && (
        <div className="historical-error">

          <span>⚠️</span>

          <p>{error}</p>

          <button onClick={fetchHistory}>
            Try Again
          </button>

        </div>
      )}

      {/* ======================================
          Loading
      ====================================== */}

      {loading && (
        <div className="historical-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading historical air quality data...
          </p>

        </div>
      )}

      {/* ======================================
          Chart
      ====================================== */}

      {!loading &&
        !error &&
        chartData.length > 0 && (
          <>

            <div className="historical-chart-card">

              <div className="chart-heading">

                <div>

                  <h3>
                    {metric.label} Trend
                  </h3>

                  <p>
                    {historyData?.startDate} →{" "}
                    {historyData?.endDate}
                  </p>

                </div>

                <div className="chart-value">

                  <strong>
                    {statistics.average.toFixed(1)}
                  </strong>

                  <span>
                    {metric.label} Average
                  </span>

                </div>

              </div>

              <div className="chart-container">

                <ResponsiveContainer
                  width="100%"
                  height={380}
                >

                  <LineChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="time"
                      tickFormatter={formatTime}
                      minTickGap={40}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipTime
                      }
                      formatter={(value) => [
                        `${Number(value).toFixed(
                          2
                        )}${metric.unit}`,
                        metric.label,
                      ]}
                    />

                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={metric.color}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* ======================================
                Statistics
            ====================================== */}

            <div className="historical-statistics">

              <div className="stat-card">

                <span className="stat-icon">
                  📊
                </span>

                <div>

                  <p>Average</p>

                  <h3>
                    {statistics.average.toFixed(1)}
                    {metric.unit}
                  </h3>

                </div>

              </div>

              <div className="stat-card">

                <span className="stat-icon">
                  ⬆️
                </span>

                <div>

                  <p>Highest</p>

                  <h3>
                    {statistics.highest.toFixed(1)}
                    {metric.unit}
                  </h3>

                </div>

              </div>

              <div className="stat-card">

                <span className="stat-icon">
                  ⬇️
                </span>

                <div>

                  <p>Lowest</p>

                  <h3>
                    {statistics.lowest.toFixed(1)}
                    {metric.unit}
                  </h3>

                </div>

              </div>

            </div>

          </>
        )}

      {/* ======================================
          Empty State
      ====================================== */}

      {!loading &&
        !error &&
        chartData.length === 0 && (

          <div className="historical-empty">

            <div>📈</div>

            <h3>
              No historical data available
            </h3>

            <p>
              Historical air quality information
              could not be found for this city.
            </p>

          </div>

        )}

    </section>
  );
};

export default HistoricalAnalysis;




