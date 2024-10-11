// src/components/Task.js
import React from 'react';
import WeatherInfo from './WeatherInfo';
import PlantNeeds from './PlantNeeds';
import CreateObservation from './CreateObservation';

const Task = ({ task, currentTaskId, onObservationClick, closeObservationForm, selectedTask }) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString();
  const formattedTime = new Date(task.createdAt).toLocaleTimeString();

  if (!task || !task.plantNeeds || !task.plantNeeds.id) {
    return null;
  }

  return (
    <div className="task-content">
      <WeatherInfo weather={task.description?.weather} />
      <PlantNeeds needs={task.plantNeeds} plant={task.plant} />

      <div className="plant-section">
        <div className="plant-info">
          <div className="plant-needs">
            <strong>Tarea a realizar:</strong><br />
            Tarea: {task.description.description} <br />
          </div>
        </div>
      </div>

      <div className="footer-section">
        <div className="date-time">
          Fecha: {formattedDate}<br />
          Hora: {formattedTime}
        </div>
        <button onClick={() => onObservationClick(task)}>Anotar Observaciones</button>
        {currentTaskId === task.id && (
          <CreateObservation task={selectedTask} onClose={closeObservationForm} />
        )}
      </div>
    </div>
  );
};

export default Task;
