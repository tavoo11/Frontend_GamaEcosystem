import React from 'react';

const WeatherInfo = ({ weather }) => {
  if (!weather) {
    return <div>No hay datos meteorológicos disponibles</div>;
  }

  return (
    <div className="weather-section">
      <div className="weather-info">
        <div className="weather-icon">
          <img src={`${process.env.PUBLIC_URL}/sol-icon.png`} className="icon" alt="Sunny icon" />
        </div>
        <div>
          <div className="temperature">{weather.temperature || 'No disponible'}°C</div>
          <div><h6>Radiación UV</h6> {weather.uv || 'No disponible'} uv</div>
        </div>
      
      <div className="precipitation">
        <img src={`${process.env.PUBLIC_URL}/rain-icon.png`} className="icon" alt="Rain icon" /> 
        <div><h6>Precipitación</h6> {weather.precipitation || 0} mm</div>
      </div>
      <div className="precipitation">
        <img src={`${process.env.PUBLIC_URL}/cloud-icon.png`} className="icon" alt="Cloud icon" /> 
        <div><h6>Nubosidad</h6> {weather.cloud || 0} %</div>
      </div>
      <div className="precipitation">
        <img src={`${process.env.PUBLIC_URL}/wind-icon.png`} className="icon" alt="Wind icon" />
        <div> <h6>Viento</h6> {weather.windSpeed || 0} Km/h</div>
      </div>
      </div>
    </div>
  );
};

export default WeatherInfo;
