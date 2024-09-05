import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assetss/css/Posted.css';
import jwtDecode from 'jwt-decode';
import Axios from '../../Axios';

const Posted = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pk = jwtDecode(token).userId.toString();
    console.log(pk, "este es el id del usuario")
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
            description: parseDescription(task.description),
            likes: [],
            comments: []
          }));
          setTasks(tasksWithDefaults);
          console.log("Task aquí: ", data)
        })
        .catch(err => console.log("Error al traer las tareas", err));
    }
  }, []);

  // Función para decodificar y mostrar información meteorológica
  const parseDescription = (description) => {
    try {
      const descriptionText = description.split("Condiciones meteorológicas:")[0].trim();
      const conditionsText = description.split("Condiciones meteorológicas:")[1];
      const weatherData = JSON.parse(conditionsText);
      const temperature = weatherData.data.find(item => item.parameter === 't_2m:C').coordinates[0].dates[0].value;
      const precipitation = weatherData.data.find(item => item.parameter === 'precip_1h:mm').coordinates[0].dates[0].value;
      const windSpeed = weatherData.data.find(item => item.parameter === 'wind_speed_10m:ms').coordinates[0].dates[0].value.toString();
      const windSpeedTwoDigits = windSpeed.slice(0, 2);


      // Definir el umbral de precipitación
      const precipitationThreshold = 10; // mm

      // Calcular la humedad relativa estimada
      const estimatedHumidityRelative = Math.min((precipitation * 100) / precipitationThreshold, 100);

      // Convertir la velocidad del viento a km/h
      const windSpeedKmh = windSpeed * 3.6;

      return {
        description: descriptionText,
        weather: {
          temperature,
          precipitation,
          windSpeed: windSpeedKmh, // Mostrar velocidad del viento en km/h
          estimatedHumidityRelative,
          windSpeedTwoDigits
        }
      };
    } catch (error) {
      console.log("Error parsing description:", error);
      return description;
    }
  };

  return (
    <div className='task-container'>
      {tasks.map((task) => {
        const formattedDate = new Date(task.createdAt).toLocaleDateString();
        const formattedTime = new Date(task.createdAt).toLocaleTimeString();

        return (
          <div key={task.id} className="task-container">
            <div className="task-content">
              <p className="task-text">{task.description.description}</p>
              <p className="task-weather">
                <strong>Condiciones Meteorológicas:</strong><br />
                Temperatura: {task.description.weather.temperature} °C<br />
                Precipitación: {task.description.weather.precipitation} mm<br />
                Velocidad del Viento: {task.description.weather.windSpeedTwoDigits} km/h<br />
                Humedad: {task.description.weather.estimatedHumidityRelative} %
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posted;
