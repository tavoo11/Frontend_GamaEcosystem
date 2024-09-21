import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

const SOCKET_SERVER_URL = 'http://localhost:4000';
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { userId } = jwtDecode(token);
    const socketInstance = io(SOCKET_SERVER_URL, {
      query: { userId: userId.toString() }
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${userId}`);
    });

    socketInstance.on('receiveNotification', (notification) => {
      console.log('Notificación recibida:', notification);
      setNotifications(prev => [...prev, notification]);
    });

    socketInstance.on('task-created', (task) => {
      console.log('Nueva tarea recibida:', task);
      setTasks(prev => [...prev, task]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, tasks, setTasks, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
