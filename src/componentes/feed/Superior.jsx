import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assetss/css/Superior.css';
import { NotificationContext } from '../context/NotificationContext';
import { UserContext } from '../context/UserContext';

const Superior = () => {
  const { notifications, setNotifications } = useContext(NotificationContext); // Cambia setTasks a setNotifications
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = (event) => {
    event.stopPropagation(); 
    setShowNotifications(!showNotifications);
    
    if (showNotifications) {
      // Si se está ocultando, puedes marcar las notificaciones como leídas
      setNotifications([]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

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
                <ul className="dropdown-menu">
                  {notifications.map((notification, index) => (
                    <li key={index} onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}>
                      {notification.message}
                    </li>
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
                <li><a href="#" onClick={handleLogout}>Cerrar sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Superior;
