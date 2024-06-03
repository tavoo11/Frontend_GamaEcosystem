// ChatComponent.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Asegúrate de usar la URL correcta para tu servidor backend
const SOCKET_SERVER_URL = 'http://localhost:4000';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socket = io(SOCKET_SERVER_URL);

  useEffect(() => {
    // Conectar al servidor de Socket.IO
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSocket');
    });

    // Escuchar mensajes del servidor
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Desconectar del servidor cuando el componente se desmonta
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('createChat', { content: message, senderId: 1, receiverId: 2 });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat en Vivo</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
};

export default ChatComponent;
