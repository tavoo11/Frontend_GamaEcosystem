import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatComponent from './Chat';
import '../../assetss/css/mensajeCss.css';

const Mensaje = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setChatVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatRef]);

  return (
    <div className="mensaje-container">
      <h5>Mis Amigos</h5>
      <div className="user-list" >
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            onClick={() => {
              setUsuarioChat(usuario);
              setChatVisible(true);
            }}
            className={`user ${usuarioChat && usuario.id === usuarioChat.id ? 'active' : ''}`} style={{scrollbarWidth: 'none'}}
          >
            <img src={usuario.profilePhotoUrl} alt="avatar" className="avatar" />
            <span>{usuario.firstName} {usuario.lastName}</span>
          </div>
        ))}
      </div>

      <button className="toggle-chat-button" onClick={() => setChatVisible(!chatVisible)}>
        Chat
      </button>

      {chatVisible && usuarioChat && (
        <div ref={chatRef} className="floating-chat-container">
          <ChatComponent usuarioChat={usuarioChat} />
        </div>
      )}
    </div>
  );
};

export default Mensaje;
