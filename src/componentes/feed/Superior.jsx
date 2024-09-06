import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import '../../assetss/css/Superior.css';
import { UserContext } from '../context/UserContext';

const SOCKET_SERVER_URL = 'http://localhost:4000';

const Superior = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const socketRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const { userId } = jwtDecode(token);  // Obtén el ID del usuario del token

    const socket = io(SOCKET_SERVER_URL, {
      query: { userId: userId.toString() }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${userId}`);
    });

    socket.on('receiveNotification', (notification) => {
      console.log('Notificación recibida del servidor:', notification);
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      const token = localStorage.getItem("token");
      if (token) {
        const { userId } = jwtDecode(token);
        if (socketRef.current) {
          socketRef.current.emit('markNotificationsAsRead', userId);  // Marca las notificaciones como leídas
        }
        setNotifications([]);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          <h1>GamaEcosystem</h1>
        </div>
        <div className="navbar-right">
          <ul className="nav-icons">
            <li>
              <a href="#" onClick={toggleNotifications}>
                <i className="bi bi-bell-fill"></i>
                {notifications.length > 0 && (
                  <span className="badge badge-primary">{notifications.length}</span>
                )}
              </a>
              {showNotifications && (
                <ul className="dropdown-menu" ref={notificationsRef}>
                  {notifications.map((notification, index) => (
                    <li key={index}>{notification.message}</li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <a href="#">
                <img
                  src={user.profilePhotoUrl}
                  className="rounded-circle"
                  height="50"
                  width="50"
                  alt="Avatar"
                  loading="lazy"
                />
              </a>
              <ul className="dropdown-menu">
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Superior;
