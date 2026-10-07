
import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    city: "",
    aqi: "",
    pm25: "",
    pm10: "",
    no2: "",
    so2: "",
    co: "",
    o3: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchRecords = async () => {
    try {
      const response = await api.get("/aqi");
      setRecords(response.data.data);
    } catch (error) {
      setError("Unable to fetch AQI records");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addAQI = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/aqi", {
        city: form.city,
        aqi: Number(form.aqi),
        pm25: Number(form.pm25 || 0),
        pm10: Number(form.pm10 || 0),
        no2: Number(form.no2 || 0),
        so2: Number(form.so2 || 0),
        co: Number(form.co || 0),
        o3: Number(form.o3 || 0),
      });

      setMessage("AQI record added successfully.");

      setForm({
        city: "",
        aqi: "",
        pm25: "",
        pm10: "",
        no2: "",
        so2: "",
        co: "",
        o3: "",
      });

      fetchRecords();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add AQI"
      );
    }
  };

  const deleteAQI = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this AQI record?"
    );

    if (!confirmDelete) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/aqi/${id}`);

      setMessage("AQI record deleted.");

      fetchRecords();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete record"
      );
    }
  };

  return (
    <div className="admin-modern-page">

      {/* HERO */}
      <section className="admin-hero">
        <div>
          <span className="admin-badge">
            🛡️ ADMIN PANEL
          </span>

          <h1>
            AQI Management
            <span> Dashboard</span>
          </h1>

          <p>
            Add, monitor and manage air quality records
            for metropolitan cities.
          </p>
        </div>

        <div className="admin-hero-icon">
          📊
        </div>
      </section>

      {/* STATS */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📋
          </div>

          <div>
            <span>Total Records</span>
            <strong>{records.length}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            🌍
          </div>

          <div>
            <span>City Data</span>
            <strong>
              {new Set(records.map((record) => record.city)).size}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            📈
          </div>

          <div>
            <span>Latest AQI</span>
            <strong>
              {records.length > 0
                ? records[0].aqi
                : "--"}
            </strong>
          </div>
        </div>

      </section>

      {/* MESSAGE */}
      {message && (
        <div className="admin-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="admin-error">
          ⚠️ {error}
        </div>
      )}

      {/* ADD AQI */}
      <section className="admin-section">

        <div className="admin-section-heading">
          <div>
            <span>DATA MANAGEMENT</span>
            <h2>Add AQI Record</h2>
          </div>

          <div className="admin-heading-icon">
            +
          </div>
        </div>

        <div className="admin-form-card">

          <form onSubmit={addAQI}>

            <div className="admin-form-grid">

              <div className="admin-field">
                <label>City</label>

                <input
                  name="city"
                  placeholder="e.g. Kolkata"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-field">
                <label>AQI</label>

                <input
                  name="aqi"
                  type="number"
                  placeholder="e.g. 56"
                  value={form.aqi}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-field">
                <label>PM2.5</label>

                <input
                  name="pm25"
                  type="number"
                  step="0.1"
                  placeholder="PM2.5 value"
                  value={form.pm25}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>PM10</label>

                <input
                  name="pm10"
                  type="number"
                  step="0.1"
                  placeholder="PM10 value"
                  value={form.pm10}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>NO₂</label>

                <input
                  name="no2"
                  type="number"
                  step="0.1"
                  placeholder="NO2 value"
                  value={form.no2}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>SO₂</label>

                <input
                  name="so2"
                  type="number"
                  step="0.1"
                  placeholder="SO2 value"
                  value={form.so2}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>CO</label>

                <input
                  name="co"
                  type="number"
                  step="0.1"
                  placeholder="CO value"
                  value={form.co}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>O₃</label>

                <input
                  name="o3"
                  type="number"
                  step="0.1"
                  placeholder="O3 value"
                  value={form.o3}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="admin-add-btn"
            >
              + Add AQI Record
            </button>

          </form>

        </div>
      </section>

      {/* RECORDS */}
      <section className="admin-section">

        <div className="admin-section-heading">
          <div>
            <span>DATABASE</span>
            <h2>AQI Records</h2>
          </div>

          <div className="record-count">
            {records.length} Records
          </div>
        </div>

        <div className="admin-records-modern">

          {records.length === 0 ? (
            <div className="admin-empty">
              <div>📭</div>
              <h3>No AQI records found</h3>
              <p>
                Add your first AQI record using the form above.
              </p>
            </div>
          ) : (
            records.map((record) => (
              <div
                className="admin-record-modern"
                key={record._id}
              >

                <div className="record-city">
                  <div className="record-city-icon">
                    🌍
                  </div>

                  <div>
                    <h3>{record.city}</h3>

                    <small>
                      {new Date(
                        record.recordedAt
                      ).toLocaleString()}
                    </small>
                  </div>
                </div>

                <div className="record-aqi">
                  <span>AQI</span>
                  <strong>{record.aqi}</strong>
                </div>

                <div className="record-pollutants">
                  <div>
                    <span>PM2.5</span>
                    <strong>{record.pm25}</strong>
                  </div>

                  <div>
                    <span>PM10</span>
                    <strong>{record.pm10}</strong>
                  </div>

                  <div>
                    <span>NO₂</span>
                    <strong>{record.no2}</strong>
                  </div>

                  <div>
                    <span>SO₂</span>
                    <strong>{record.so2}</strong>
                  </div>
                </div>

                <button
                  className="admin-delete-btn"
                  onClick={() =>
                    deleteAQI(record._id)
                  }
                >
                  🗑 Delete
                </button>

              </div>
            ))
          )}

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;

