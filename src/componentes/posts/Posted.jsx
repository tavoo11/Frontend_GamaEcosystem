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
  const [plantNeeds, setPlantNeeds] = useState({});

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

          // Obtener necesidades de las plantas
          const plantNeedsIds = [...new Set(data.map(task => task.plantNeeds.id))];
          const fetchPlantNeeds = plantNeedsIds.map(plantNeedsId =>
            Axios.get(`http://localhost:4000/plant-needs/${plantNeedsId}`, config)
              .then(response => ({ plantNeedsId, needs: response.data }))
          );

          Promise.all(fetchPlantNeeds).then(results => {
            const needsByPlantNeedsId = results.reduce((acc, { plantNeedsId, needs }) => {
              acc[plantNeedsId] = needs;
              return acc;
            }, {});
            setPlantNeeds(needsByPlantNeedsId);
          });
        })
        .catch(err => console.log("Error al traer las tareas", err));
    }
  }, [setTasks]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).userId.toString();
    const socket = io('http://localhost:4000', { query: { userId } });

    socket.on('task-created', (task) => {
      console.log('Nueva tarea recibida:', task);
      const parsedTask = {
        ...task,
        description: parseDescription(task.description),
      };
      setTasks(prev => [parsedTask, ...prev]);
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
          }
        };
      }

      const weatherData = JSON.parse(conditionsText);
      const currentWeather = weatherData.current;

      const temperature = currentWeather?.temp_c ?? 'No disponible';
      const precipitation = currentWeather?.precip_mm ?? 'No disponible';
      const windSpeed = currentWeather?.wind_kph ?? 'No disponible';

      return {
        description: descriptionText,
        weather: {
          temperature,
          precipitation,
          windSpeed: windSpeed.toFixed(2),
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
        const needs = plantNeeds[task.plantNeeds.id] || {};

        return (
          <div key={`${task.id}-${index}`} className="task-container">
            <div className="task-content">
              <p className="task-text">{task.description.description}</p>
              <p className="task-date">
                <strong>Fecha y Hora de Creación:</strong> {formattedDate} {formattedTime}
              </p>
              <p className="task-weather">
                <strong>Condiciones Meteorológicas:</strong><br />
                {task.description.weather ? (
                  <>
                    Temperatura: {task.description.weather.temperature} °C<br />
                    Precipitación: {task.description.weather.precipitation} mm<br />
                    Velocidad del Viento: {task.description.weather.windSpeed} km/h<br />
                  </>
                ) : (
                  <span>No hay datos meteorológicos disponibles.</span>
                )}
              </p>
              <p className="plant-needs">
                <strong>Necesidades de la Planta:</strong><br />
                Requisito de Agua: {needs.waterRequirement} litros por semana<br />
                Temperatura de: {needs.minTemperature} °C a {needs.maxTemperature} °C<br />
                Humedad Requerida: {needs.humidityRequirement} %<br />
                Velocidad del Viento de: {needs.minWindSpeed} km/h a {needs.maxWindSpeed} km/h<br />
                Precipitación Máxima: {needs.maxPrecipitation} mm
              </p>

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
