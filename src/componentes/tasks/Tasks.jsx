// src/components/Posted.js
import React, { useState, useEffect, useContext } from 'react';
import '../../assetss/css/Posted.css';
import { NotificationContext } from '../context/NotificationContext';
import Axios from '../../Axios';
import Task from './Render';
import { parseDescription } from '../tasks/Utils';
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
        headers: { "Authorization": `Token ${token}` }
      };

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

  const handleObservationClick = (task) => {
    setSelectedTask(task);
    setCurrentTaskId(task.id);
  };

  const closeObservationForm = () => {
    setCurrentTaskId(null);
  };

  return (
    <div className='task-container'>
      {tasks.map((task, index) => (
        <Task 
          key={`${task.id}-${index}`} 
          task={task} 
          currentTaskId={currentTaskId} 
          onObservationClick={handleObservationClick} 
          closeObservationForm={closeObservationForm} 
          selectedTask={selectedTask} 
        />
      ))}
    </div>
  );
};

export default Posted;
