import React, { useEffect, useState } from 'react';
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
  const [socket, setSocket] = useState(null);

  const token = localStorage.getItem("token");
  const pk = jwtDecode(token).userId.toString();

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, {
      query: { userId: pk }
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${pk}`);
    });

    newSocket.on('receiveMessage', (newMessage) => {
      console.log('Mensaje recibido del servidor:', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [pk]);

  const sendMessage = () => {
    if (message.trim() !== '' && usuarioChat && socket) {
      const newMessage = { content: message, senderId: Number(pk), receiverId: Number(usuarioChat.id) };
      console.log('Mensaje enviado:', newMessage);
      socket.emit('createChat', newMessage);
      setMessage('');
    }
  };

  const filteredMessages = messages.filter(
    (msg) => 
      (msg.senderId === Number(pk) && msg.receiverId === Number(usuarioChat.id)) ||
      (msg.senderId === Number(usuarioChat.id) && msg.receiverId === Number(pk))
  );
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
              <h5 className="mb-0">Messages</h5>
              <h6 className="mb-0">{usuarioChat.firstName}</h6>
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
            <div
              style={{ position: "relative", height: "400px", overflowY: "auto" }}
            >
              <MDBCardBody>
                {filteredMessages.map((msg, index) => (
                  <div key={index} className="d-flex justify-content-between">
                    <p className="small mb-1">{msg.senderId === Number(pk) ? "You" : "Them"}</p>
                    <p className="small mb-1 text-muted">Just now</p>
                    <div className="d-flex flex-row justify-content-start">
                      <div>
                        <p
                          className="small p-2 ms-3 mb-3 rounded-3"
                          style={{ backgroundColor: msg.senderId === Number(pk) ? "#f5f6f7" : "#f5f6f7" }}
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
                  placeholder="Type message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <MDBBtn color="warning" style={{ paddingTop: ".55rem" }} onClick={sendMessage}>
                  Send
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
