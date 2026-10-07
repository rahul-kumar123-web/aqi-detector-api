
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">

          <div className="home-badge">
            ● REAL-TIME AIR QUALITY
          </div>

          <h1>
            Breathe Better.
            <br />
            <span>Know Your Air.</span>
          </h1>

          <p>
            Monitor real-time air quality, track pollutant levels,
            and compare the air quality of metropolitan cities.
          </p>

          <div className="home-buttons">
            <Link to="/dashboard" className="home-primary-btn">
              Check Air Quality →
            </Link>

            <Link to="/compare" className="home-secondary-btn">
              Compare Cities
            </Link>
          </div>

          <div className="home-stats">
            <div>
              <strong>Live</strong>
              <span>AQI Data</span>
            </div>

            <div>
              <strong>6+</strong>
              <span>Pollutants</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Monitoring</span>
            </div>
          </div>

        </div>

        {/* AQI Visual Card */}
        <div className="home-aqi-card">

          <div className="home-aqi-top">
            <span>CURRENT AQI</span>
            <span className="live-dot">● LIVE</span>
          </div>

          <div className="home-aqi-circle">
            <strong>56</strong>
            <span>US AQI</span>
          </div>

          <div className="home-aqi-status">
            <span></span>
            Moderate
          </div>

          <p className="home-aqi-city">
            📍 Kolkata
          </p>

          <div className="home-mini-pollutants">
            <div>
              <span>PM2.5</span>
              <strong>10.2</strong>
            </div>

            <div>
              <span>PM10</span>
              <strong>11</strong>
            </div>

            <div>
              <span>NO₂</span>
              <strong>11.1</strong>
            </div>
          </div>

        </div>
      </section>


      {/* Features Section */}
      <section className="home-features">

        <div className="home-section-heading">
          <p>WHAT WE PROVIDE</p>
          <h2>Everything you need to understand the air</h2>
        </div>

        <div className="home-feature-grid">

          <div className="home-feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Live AQI</h3>
            <p>
              Get real-time air quality information
              for cities using live air quality data.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="feature-icon">📊</div>
            <h3>Compare Cities</h3>
            <p>
              Compare AQI and pollutant levels
              between different cities.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="feature-icon">💨</div>
            <h3>Pollutant Tracking</h3>
            <p>
              Monitor PM2.5, PM10, NO₂, SO₂,
              CO and O₃ levels.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Access</h3>
            <p>
              Secure authentication with separate
              user and admin access.
            </p>
          </div>

        </div>
      </section>


      {/* CTA Section */}
      <section className="home-cta">

        <div>
          <p className="cta-label">START MONITORING</p>

          <h2>
            Curious about the air
            <br />
            you're breathing?
          </h2>

          <p>
            Search your city and discover its current
            air quality in seconds.
          </p>
        </div>

        <Link to="/dashboard" className="cta-button">
          Explore AQI →
        </Link>

      </section>

    </div>
  );
}

export default Home;

