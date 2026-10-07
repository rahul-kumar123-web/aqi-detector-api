function PollutantCard({ name, value, unit = "µg/m³" }) {
  return (
    <div className="pollutant-card">
      <div className="pollutant-icon">
        🌫️
      </div>

      <div className="pollutant-info">
        <h3>{name}</h3>

        <div className="pollutant-value">
          {value ?? 0}
          <span>{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default PollutantCard;