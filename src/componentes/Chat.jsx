import React, { useState, useEffect, useRef } from 'react';
import '../assetss/css/Chat.css';
import io from 'socket.io-client';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBCardFooter,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import jwtDecode from 'jwt-decode';

const SOCKET_SERVER_URL = 'http://localhost:4000';

const ChatComponent = ({ usuarioChat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

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
      console.log('Mensajes qeu manda el servidor: ', data);
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

  const sendMessage = () => {
    if (message.trim() !== '' && usuarioChat && socketRef.current) {
      const newMessage = { content: message, senderId: Number(pk), receiverId: Number(usuarioChat.id) };
      console.log('Mensaje enviado:', newMessage);
      socketRef.current.emit('createChat', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      console.log(messages);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    // Normaliza la estructura del mensaje si es necesario
    if (msg.sender && msg.sender.id) {
      // Si el mensaje tiene una estructura de remitente diferente, normalízala
      msg.senderId = msg.sender.id;
      delete msg.sender;
    }
    if (msg.receiver && msg.receiver.id) {
      // Si el mensaje tiene una estructura de receptor diferente, normalízala
      msg.receiverId = msg.receiver.id;
      delete msg.receiver;
    }
  
    // Ahora puedes trabajar con la estructura unificada
    const senderId = msg.senderId;
    const receiverId = msg.receiverId;
  
    return (
      (senderId === Number(pk) && receiverId === Number(usuarioChat.id)) ||
      (senderId === Number(usuarioChat.id) && receiverId === Number(pk))
    );
  });
  

  console.log('Todos los mensajes:', messages);
  console.log('Mensajes filtrados:', filteredMessages);
  return (
    <MDBContainer fluid className="py-5">
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="8" lg="6" xl="4">
          <MDBCard>
            <MDBCardHeader
              className="d-flex justify-content-between align-items-center p-3"
              style={{ borderTop: "4px solid #ffa900" }}
            >
              <img
                src={usuarioChat.profilePhotoUrl}
                alt="avatar"
                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                width="40"
                height="40"
              />
              <h5 className="mb-0">{usuarioChat.firstName} {usuarioChat.lastName}</h5>
              <div className="d-flex flex-row align-items-center">
                <MDBIcon
                  fas
                  icon="minus"
                  size="xs"
                  className="me-3 text-muted"
                />
                <MDBIcon
                  fas
                  icon="comments"
                  size="xs"
                  className="me-3 text-muted"
                />
                <MDBIcon
                  fas
                  icon="times"
                  size="xs"
                  className="me-3 text-muted"
                />
              </div>
            </MDBCardHeader>
            <div className="messages-container"
              style={{ position: "relative", height: "400px",
                overflowY: "auto",
                scrollBehavior: "smooth",
                flexDirection: "column-end",}}
            >
              <MDBCardBody>
                {filteredMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.senderId === Number(pk) ? "sent" : "received"}`}>
                   
                    <div>
                      <div>
                        <p
                         
                          style={{ backgroundColor: msg.senderId === Number(pk) ? "#4c24eea4" : "#161a388c" }}
                        >
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </MDBCardBody>
            </div>
            <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
              <MDBInputGroup className="mb-0">
                <input
                  className="form-control"
                  placeholder="Mensaje"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <MDBBtn color="primary" style={{ paddingTop: ".55rem" }} onClick={sendMessage}>
                <i class="bi bi-arrow-right-circle-fill"></i>
                </MDBBtn>
              </MDBInputGroup>
            </MDBCardFooter>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ChatComponent;