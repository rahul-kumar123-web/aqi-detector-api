
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-auth-page">

      {/* Left Side */}
      <div className="auth-visual">

        <div className="auth-visual-content">

          <div className="auth-logo">
            🌿 AQI Detector
          </div>

          <div className="auth-visual-main">

            <span className="auth-live-badge">
              ● JOIN AQI DETECTOR
            </span>

            <h1>
              Know your air.
              <br />
              <span>Live healthier.</span>
            </h1>

            <p>
              Create your account and get access to
              real-time air quality information,
              pollutant levels and city comparisons.
            </p>

          </div>

          <div className="auth-info-cards">

            <div>
              <strong>🌍</strong>
              <span>Live City Data</span>
            </div>

            <div>
              <strong>📊</strong>
              <span>City Comparison</span>
            </div>

            <div>
              <strong>🔐</strong>
              <span>Secure Account</span>
            </div>

          </div>

        </div>

      </div>


      {/* Right Side */}
      <div className="auth-form-side">

        <div className="modern-auth-card">

          <div className="mobile-auth-logo">
            🌿 AQI Detector
          </div>

          <div className="auth-heading">

            <p>GET STARTED</p>

            <h2>Create your account</h2>

            <span>
              Join AQI Detector and start monitoring
              air quality around you.
            </span>

          </div>


          {/* Error */}
          {error && (
            <div className="modern-error">
              ⚠️ {error}
            </div>
          )}


          {/* Success */}
          {success && (
            <div className="modern-success">
              ✓ {success}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="modern-auth-form"
          >

            {/* Name */}
            <div className="modern-input-group">

              <label>Full name</label>

              <div className="modern-input">

                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="modern-input-group">

              <label>Email address</label>

              <div className="modern-input">

                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="modern-input-group">

              <label>Password</label>

              <div className="modern-input">

                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                />

              </div>

            </div>


            {/* Register */}
            <button
              type="submit"
              className="modern-login-btn"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account →"}
            </button>

          </form>


          <div className="auth-divider">
            <span>SECURE REGISTRATION</span>
          </div>


          <p className="auth-register-text">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;

