
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      login(response.data);

      if (response.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
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
              ● LIVE AIR QUALITY
            </span>

            <h1>
              Understand the air.
              <br />
              <span>Protect your tomorrow.</span>
            </h1>

            <p>
              Monitor real-time air quality, track pollutants
              and compare cities from one simple dashboard.
            </p>
          </div>

          <div className="auth-info-cards">

            <div>
              <strong>🌍</strong>
              <span>Live City Data</span>
            </div>

            <div>
              <strong>📊</strong>
              <span>Pollutant Tracking</span>
            </div>

            <div>
              <strong>⚡</strong>
              <span>Real-Time Updates</span>
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
            <p>WELCOME BACK</p>

            <h2>Sign in to your account</h2>

            <span>
              Enter your details to continue monitoring
              air quality.
            </span>
          </div>


          {error && (
            <div className="modern-error">
              ⚠️ {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="modern-auth-form"
          >

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


            <div className="modern-input-group">

              <label>Password</label>

              <div className="modern-input">
                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>


            <button
              type="submit"
              className="modern-login-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>


          <div className="auth-divider">
            <span>SECURE ACCESS</span>
          </div>


          <p className="auth-register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;

