import React, { useState, useEffect, useRef } from 'react';
import '../../assetss/css/Chat.css';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';

const SOCKET_SERVER_URL = 'http://localhost:4000';

const ChatComponent = ({ usuarioChat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const pk = jwtDecode(token).userId.toString();

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${SOCKET_SERVER_URL}/chat/messages?senderId=${pk}&receiverId=${usuarioChat.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();

    const socket = io(SOCKET_SERVER_URL, {
      query: { userId: pk }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${pk}`);
    });

    socket.on('receiveMessage', (newMessage) => {
      console.log('Mensaje recibido del servidor:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, [pk, token, usuarioChat.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== '' && usuarioChat && socketRef.current) {
      const newMessage = { content: message, senderId: Number(pk), receiverId: Number(usuarioChat.id), createdAt: new Date().toISOString() };
      socketRef.current.emit('createChat', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return messageDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    }
  };

  const formatTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessages = () => {
    let currentDate = null;
    return filteredMessages.map((msg, index) => {
      const formattedDate = formatDate(msg.createdAt);
      const formattedTime = formatTime(msg.createdAt);

      // Mostrar fecha solo una vez si es el mismo día
      const showDate = formattedDate !== currentDate;
      currentDate = formattedDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="message-date-center">
              {formattedDate}
            </div>
          )}
          <div className={`message ${msg.senderId === Number(pk) ? "sent" : "received"}`}>
            <div className="message-content" style={{ backgroundColor: msg.senderId === Number(pk) ? "#4c24eea4" : "#161a388c" }}>
              {msg.content}
              <span className="message-time">{formattedTime}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  const filteredMessages = messages.filter((msg) => {
    if (msg.sender && msg.sender.id) {
      msg.senderId = msg.sender.id;
      delete msg.sender;
    }
    if (msg.receiver && msg.receiver.id) {
      msg.receiverId = msg.receiver.id;
      delete msg.receiver;
    }
    const senderId = msg.senderId;
    const receiverId = msg.receiverId;
    return (
      (senderId === Number(pk) && receiverId === Number(usuarioChat.id)) ||
      (senderId === Number(usuarioChat.id) && receiverId === Number(pk))
    );
  });

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img
          src={usuarioChat.profilePhotoUrl}
          alt="avatar"
          className="avatar"
        />
        <h5>{usuarioChat.firstName} {usuarioChat.lastName}</h5>
        <div className="chat-icons">
          <span className="icon-minus"></span>
          <span className="icon-comments"></span>
          <span className="icon-times"></span>
        </div>
      </div>
      <div className="messages-container">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <input
          className="form-control"
          placeholder="Mensaje"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>
          <i className="bi bi-arrow-right-circle-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
