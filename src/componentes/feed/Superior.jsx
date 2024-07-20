import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import '../../assetss/css/Superior.css';
import { UserContext } from '../context/UserContext';
import Mensaje from '../chat/Mensaje';

const SOCKET_SERVER_URL = 'http://localhost:4000';

const Superior = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showMensaje, setShowMensaje] = useState(false);
  const socketRef = useRef(null);
  const mensajeRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pk = jwtDecode(token).userId.toString();

    const socket = io(SOCKET_SERVER_URL, {
      query: { userId: pk }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${pk}`);
    });

    socket.on('receiveMessage', (receiveMessage) => {
      console.log('Notificación recibida del servidor:', receiveMessage);
      setNotifications((prevNotifications) => [...prevNotifications, receiveMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function logout() {
    localStorage.clear();
    navigate('/');
  }

  function ReturnActivity() {
    navigate('/principal');
  }

  function GoProfile() {
    navigate('/perfil');
  }

  function GoProfiles() {
    navigate('/following');
  }

  const toggleMensaje = () => {
    setShowMensaje(!showMensaje);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mensajeRef.current && !mensajeRef.current.contains(event.target)) {
        setShowMensaje(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mensajeRef]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Red Social</h1>
        </div>
        <div className="navbar-center">
          <i className="bi bi-activity" onClick={ReturnActivity} style={{ margin: '0 30px' }}></i>
          <i className="bi bi-person-circle" onClick={GoProfile} style={{ margin: '0 30px' }}></i>
          <i className="bi bi-people-fill" onClick={GoProfiles} style={{ margin: '0 30px' }}></i>
        </div>
        <div className="navbar-right">
          <form className="search-form">
            <input type="search" placeholder="Search" aria-label="Search" />
          </form>
          <ul className="nav-icons">
            <li>
              <a href="#">
                <i className="bi bi-bell-fill"></i>
              </a>
              <ul className="dropdown-menu">
                {notifications.map((notification, index) => (
                  <li key={index}>{notification.message}</li>
                ))}
              </ul>
            </li>
            <li>
              <a href="#" onClick={toggleMensaje}>
                <i className="bi bi-wechat"></i>
                {notifications.length > 0 && (
                  <span className="badge badge-primary">{notifications.length}</span>
                )}
              </a>
              {showMensaje && (
                <div ref={mensajeRef}>
                  <Mensaje />
                </div>
              )}
            </li>
            <li>
              <a href="#">
                <img
                  src={user.profilePhotoUrl}
                  className="rounded-circle"
                  height="45"
                  width="45"
                  alt="Avatar"
                  loading="lazy"
                />
              </a>
              <ul className="dropdown-menu">
                <li><a href="#">My Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#" onClick={logout}>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Superior;
