import React, { useState, useEffect, useContext } from 'react';
import '../../assetss/css/Posted.css';
import { NotificationContext } from '../context/NotificationContext';
import Axios from '../../Axios';
import CreateObservation from './CreateObservation';
import jwtDecode from 'jwt-decode';
import io from 'socket.io-client';

const Posted = () => {
  const { tasks, setTasks } = useContext(NotificationContext);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pk = jwtDecode(token).userId.toString();

    if (token) {
      const config = {
        headers: {
          "Authorization": `Token ${token}`
        }
      };

      // Obtener tareas asignadas
      Axios.get(`http://localhost:4000/tasks/user/${pk}`, config)
        .then(response => {
          const data = response.data;
          const tasksWithDefaults = data.map(task => ({
            ...task,
            description: parseDescription(task.description)
          }));
          setTasks(tasksWithDefaults);
        })
        .catch(err => console.log("Error al traer las tareas", err));
    }
  }, [setTasks]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).userId.toString();
    const socket = io('http://localhost:4000', { query: { userId } });

    socket.on('task-created', (task) => {
      try {
        const parsedTask = {
          ...task,
          description: parseDescription(task.description),
        };
        
        if (parsedTask.description && parsedTask.description.weather) {
          setTasks(prev => [parsedTask, ...prev]);
        } else {
          console.warn("La tarea recibida no tiene datos meteorológicos completos", task);
        }
      } catch (error) {
        console.error("Error procesando la tarea recibida por el socket:", error);
      }
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  const parseDescription = (description) => {
    try {
      const descriptionText = description.split("Condiciones meteorológicas:")[0].trim();
      const conditionsText = description.split("Condiciones meteorológicas:")[1];

      if (!conditionsText) {
        return {
          description: descriptionText,
          weather: {
            temperature: 'No disponible',
            precipitation: 'No disponible',
            windSpeed: 'No disponible',
            humidity: 'No disponible',
            cloud: 'No disponible',
            uv: 'No disponible',
          }
        };
      }

      const weatherData = JSON.parse(conditionsText);
      const currentWeather = weatherData.current;

      const temperature = currentWeather?.temp_c ?? 'No disponible';
      const precipitation = currentWeather?.precip_mm ?? 'No disponible';
      const windSpeed = currentWeather?.wind_kph ?? 'No disponible';
      const humidity = currentWeather?.humidity ?? 'No disponible';
      const cloud = currentWeather?.cloud ?? 'No disponible';
      const uv = currentWeather?.uv ?? 'No disponible';

      return {
        description: descriptionText,
        weather: {
          temperature,
          precipitation,
          windSpeed: windSpeed.toFixed(2),
          humidity,
          cloud,
          uv,
        }
      };
    } catch (error) {
      console.log("Error parsing description:", error);
      return {
        description: description,
        weather: {
          temperature: 'No disponible',
          precipitation: 'No disponible',
          windSpeed: 'No disponible',
          humidity: 'No disponible',
          cloud: 'No disponible',
          uv: 'No disponible'
        }
      };
    }
  };

  const handleObservationClick = (task) => {
    setSelectedTask(task);
    setCurrentTaskId(task.id);
  };

  const closeObservationForm = () => {
    setCurrentTaskId(null);
  };

  return (
    <div className='task-container'>
      {tasks.map((task, index) => {
        if (!task || !task.plantNeeds || !task.plantNeeds.id) {
          console.log(`La tarea en el índice ${index} no tiene plantNeeds o id`);
          return null;
        }
        const formattedDate = new Date(task.createdAt).toLocaleDateString();
        const formattedTime = new Date(task.createdAt).toLocaleTimeString();
        const needs = task.plantNeeds || {};

        const weather = task.description?.weather || {
          temperature: 'No disponible',
          precipitation: 'No disponible',
          windSpeed: 'No disponible',
          humidity: 'No disponible',
          cloud: 'No disponible',
          uv: 'No disponible',
        };
      
        return (
          <div key={`${task.id}-${index}`} className="task-content">
            <div className="weather-section">
              <div className="weather-info">
                <div className="weather-icon"><img src={`${process.env.PUBLIC_URL}/RS5Y.gif`} className="weather-icon" /></div>
                Tarea disponible
                <div className="temperature">{weather.temperature || 'No disponible'}°C </div>
              </div>
              <div className="precipitation">
                Precipitación: {weather.precipitation} mm
              </div>
              <div className="precipitation">
                Humedad: {weather.humidity} %
              </div>
              <div className="precipitation">
                Nubosidad: {weather.cloud} %
              </div>
              <div className="precipitation">
                Radiacion Ultravioleta: {weather.uv} uv
              </div>
              <div className="precipitation">
                Vel Viento: {weather.windSpeed} Km/h
              </div>
            </div>

            <div className="plant-section">
              <div className="plant-info">
                <div className="plant-name">Especie: {task.plant.species}</div>
                <div className="plant-name">Lote: {task.plant.tag}</div>
                <div className="plant-needs">
                  <strong>Necesidades de la Planta:</strong><br />
                  Agua: {needs.waterRequirement} litros por semana<br />
                  Temp.: {needs.minTemperature} °C a {needs.maxTemperature} °C<br />
                  Humedad: {needs.humidityRequirement} %<br />
                </div>
              </div>
            </div>

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
              <button onClick={() => handleObservationClick(task)}>Anotar Observaciones</button>
              {currentTaskId === task.id && (
                <CreateObservation task={selectedTask} onClose={closeObservationForm} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posted;
