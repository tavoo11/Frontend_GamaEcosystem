import React from 'react';

const PlantNeeds = ({ needs, plant }) => {
  return (
    <div className="plant-section">
      <div className="plant-info">
        <div className="plant-name">Especie: {plant.species}</div>
        <div className="plant-name">Lote: {plant.tag}</div>
        <div className="plant-needs">
          <strong>Necesidades de la Planta:</strong><br />
          <img src={`${process.env.PUBLIC_URL}/water-icon.png`} className="icon" alt="Water icon" />
           <div><h6> Agua:</h6> {needs.waterRequirement} l/d<br /></div>
          <img src={`${process.env.PUBLIC_URL}/sunny-icon.png`} className="icon" alt="Sunny icon" /> 
           <div><h6>Temp.:</h6> {needs.minTemperature} - {needs.maxTemperature} °C<br /></div>
          <img src={`${process.env.PUBLIC_URL}/humidity-icon.png`} className="icon" alt="Humidity icon" /> 
           <div><h6>Humedad:</h6> {needs.humidityRequirement} %<br /></div>
        </div>
      </div>
    </div>
  );
};

export default PlantNeeds;
