import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import "./AirQualityCalendar.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getAQIStatus = (aqi) => {
  if (aqi === null || aqi === undefined || Number.isNaN(Number(aqi))) {
    return {
      label: "No Data",
      className: "calendar-no-data",
    };
  }

  const value = Number(aqi);

  if (value <= 50) {
    return {
      label: "Good",
      className: "calendar-good",
    };
  }

  if (value <= 100) {
    return {
      label: "Moderate",
      className: "calendar-moderate",
    };
  }

  if (value <= 150) {
    return {
      label: "Unhealthy",
      className: "calendar-sensitive",
    };
  }

  if (value <= 200) {
    return {
      label: "Unhealthy",
      className: "calendar-unhealthy",
    };
  }

  if (value <= 300) {
    return {
      label: "Very Unhealthy",
      className: "calendar-very-unhealthy",
    };
  }

  return {
    label: "Hazardous",
    className: "calendar-hazardous",
  };
};

const AirQualityCalendar = ({ city = "Kolkata" }) => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const year = 2026;

  const fetchCalendarData = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      /*
       * Current backend history API supports the days parameter.
       * We request the maximum practical recent period used
       * by the existing HistoricalAnalysis component.
       */
      const response = await api.get(
        `/aqi/${encodeURIComponent(city)}/history?days=30`
      );

      if (response.data?.success) {
        setHistoryData(response.data.data);
      } else {
        setError("Calendar data not available");
      }
    } catch (err) {
      console.error("Calendar AQI error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load air quality calendar"
      );

      setHistoryData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [city]);

  /*
   * Convert hourly AQI data into daily average AQI.
   *
   * Backend history format:
   *
   * historyData.time[]
   * historyData.aqi[]
   */
  const dailyAQI = useMemo(() => {
    if (!historyData?.time || !historyData?.aqi) {
      return {};
    }

    const grouped = {};

    historyData.time.forEach((time, index) => {
      const aqi = historyData.aqi?.[index];

      if (
        aqi === null ||
        aqi === undefined ||
        Number.isNaN(Number(aqi))
      ) {
        return;
      }

      const date = new Date(time);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(Number(aqi));
    });

    const result = {};

    Object.entries(grouped).forEach(([date, values]) => {
      const average =
        values.reduce((sum, value) => sum + value, 0) /
        values.length;

      result[date] = Math.round(average);
    });

    return result;
  }, [historyData]);

  /*
   * Create complete 2026 calendar.
   */
  const calendarMonths = useMemo(() => {
    return MONTHS.map((monthName, monthIndex) => {
      const firstDay = new Date(year, monthIndex, 1).getDay();

      const totalDays = new Date(
        year,
        monthIndex + 1,
        0
      ).getDate();

      const days = [];

      /*
       * Empty cells before first day.
       */
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }

      /*
       * Actual month days.
       */
      for (let day = 1; day <= totalDays; day++) {
        const key = [
          year,
          String(monthIndex + 1).padStart(2, "0"),
          String(day).padStart(2, "0"),
        ].join("-");

        days.push({
          day,
          dateKey: key,
          aqi: dailyAQI[key] ?? null,
        });
      }

      return {
        monthName,
        monthIndex,
        days,
      };
    });
  }, [dailyAQI]);

  const dataCount = Object.keys(dailyAQI).length;

  return (
    <section className="aq-calendar-section">
      {/* HEADER */}
      <div className="aq-calendar-header">
        <div>
          <span className="aq-calendar-kicker">
            AIR QUALITY HISTORY
          </span>

          <h2>Air Quality Calendar 2026</h2>

          <p>
            Daily AQI overview for{" "}
            <strong>{city}</strong>
          </p>
        </div>

        <button
          className="aq-calendar-refresh"
          onClick={fetchCalendarData}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* LEGEND */}
      <div className="aq-calendar-legend">
        <div>
          <span className="legend-box legend-good"></span>
          Good
        </div>

        <div>
          <span className="legend-box legend-moderate"></span>
          Moderate
        </div>

        <div>
          <span className="legend-box legend-sensitive"></span>
          Unhealthy for Sensitive Groups
        </div>

        <div>
          <span className="legend-box legend-unhealthy"></span>
          Unhealthy
        </div>

        <div>
          <span className="legend-box legend-very"></span>
          Very Unhealthy
        </div>

        <div>
          <span className="legend-box legend-hazardous"></span>
          Hazardous
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="aq-calendar-error">
          ⚠️ {error}
        </div>
      )}

      {/* INFO */}
      {!loading && !error && (
        <div className="aq-calendar-info">
          <span>📊</span>

          <span>
            {dataCount > 0
              ? `${dataCount} day(s) of AQI data available`
              : "No historical AQI data available"}
          </span>
        </div>
      )}

      {/* CALENDAR */}
      <div className="aq-calendar-grid">
        {calendarMonths.map((month) => (
          <div
            className="aq-calendar-month"
            key={month.monthName}
          >
            <div className="aq-month-title">
              {month.monthName}
            </div>

            <div className="aq-weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="aq-days">
              {month.days.map((item, index) => {
                if (!item) {
                  return (
                    <div
                      className="aq-day empty"
                      key={`empty-${index}`}
                    />
                  );
                }

                const status = getAQIStatus(item.aqi);

                return (
                  <div
                    key={item.dateKey}
                    className={`aq-day ${status.className}`}
                    title={
                      item.aqi !== null
                        ? `${item.dateKey} • AQI ${item.aqi} • ${status.label}`
                        : `${item.dateKey} • No AQI data`
                    }
                  >
                    <span className="aq-day-number">
                      {item.day}
                    </span>

                    {item.aqi !== null && (
                      <span className="aq-day-aqi">
                        {item.aqi}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="aq-calendar-footer">
        <span>
          📍 City: <strong>{city}</strong>
        </span>

        <span>
          📅 Year: <strong>2026</strong>
        </span>

        <span>
          Data: <strong>Historical AQI</strong>
        </span>
      </div>
    </section>
  );
};

export default AirQualityCalendar;