import "./MajorAirPollutants.css";

const POLLUTANTS = [
  {
    key: "pm25",
    symbol: "PM2.5",
    name: "Fine Particulate Matter",
    description: "Particles smaller than 2.5 micrometers",
    unit: "µg/m³",
  },
  {
    key: "pm10",
    symbol: "PM10",
    name: "Particulate Matter",
    description: "Particles smaller than 10 micrometers",
    unit: "µg/m³",
  },
  {
    key: "no2",
    symbol: "NO₂",
    name: "Nitrogen Dioxide",
    description: "Reactive gaseous air pollutant",
    unit: "µg/m³",
  },
  {
    key: "so2",
    symbol: "SO₂",
    name: "Sulphur Dioxide",
    description: "Gas mainly from fuel combustion",
    unit: "µg/m³",
  },
  {
    key: "co",
    symbol: "CO",
    name: "Carbon Monoxide",
    description: "Colourless and odourless gas",
    unit: "µg/m³",
  },
  {
    key: "o3",
    symbol: "O₃",
    name: "Ozone",
    description: "Ground-level atmospheric ozone",
    unit: "µg/m³",
  },
];

const getPollutantLevel = (key, value) => {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return {
      label: "No Data",
      className: "pollutant-level-none",
      percentage: 0,
    };
  }

  const number = Number(value);

  /*
   * Visual scale only.
   * This percentage is used for the progress bar.
   */
  const limits = {
    pm25: 150,
    pm10: 250,
    no2: 200,
    so2: 200,
    co: 10000,
    o3: 200,
  };

  const limit = limits[key] || 200;

  const percentage = Math.min(
    (number / limit) * 100,
    100
  );

  let label = "Low";
  let className = "pollutant-level-low";

  if (percentage > 75) {
    label = "High";
    className = "pollutant-level-high";
  } else if (percentage > 40) {
    label = "Moderate";
    className = "pollutant-level-moderate";
  }

  return {
    label,
    className,
    percentage,
  };
};

const MajorAirPollutants = ({ data }) => {
  return (
    <section className="major-pollutants-section">
      {/* HEADER */}
      <div className="major-pollutants-header">
        <div>
          <span className="major-pollutants-kicker">
            AIR QUALITY
          </span>

          <h2>Major Air Pollutants</h2>

          <p>
            Current pollutant concentration in the selected city
          </p>
        </div>

        <span className="pollutant-live-badge">
          ● LIVE
        </span>
      </div>

      {/* POLLUTANT CARDS */}
      <div className="major-pollutants-grid">
        {POLLUTANTS.map((pollutant) => {
          const value = data?.[pollutant.key];

          const level = getPollutantLevel(
            pollutant.key,
            value
          );

          return (
            <article
              className={`major-pollutant-card pollutant-${pollutant.key}`}
              key={pollutant.key}
            >
              <div className="major-pollutant-top">
                <span
                  className={`major-pollutant-symbol ${pollutant.key}`}
                >
                  {pollutant.symbol}
                </span>

                <span className="major-pollutant-unit">
                  {pollutant.unit}
                </span>
              </div>

              <div className="major-pollutant-value">
                {value !== null &&
                value !== undefined
                  ? Number(value).toFixed(1)
                  : "--"}
              </div>

              <div className="major-pollutant-name">
                {pollutant.name}
              </div>

              <p className="major-pollutant-description">
                {pollutant.description}
              </p>

              <div className="pollutant-progress">
                <span
                  style={{
                    width: `${level.percentage}%`,
                  }}
                ></span>
              </div>

              <div className="pollutant-bottom">
                <span>Current level</span>

                <strong className={level.className}>
                  {level.label}
                </strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MajorAirPollutants;