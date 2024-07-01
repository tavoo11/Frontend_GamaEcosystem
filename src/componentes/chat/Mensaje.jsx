import React, { useState, useEffect, useRef } from "react";
import '../../assetss/css/mensajeCss.css';
import Axios from "axios";
import Chat from "./Chat";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBTypography,
} from "mdb-react-ui-kit";
import jwtDecode from 'jwt-decode';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:4000';

function Mensaje() {
    const [conversaciones, setConversaciones] = useState([]);
    const [usuarioChat, setUsuarioChat] = useState(null);
    const [form, setForm] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const socketRef = useRef(null);

    const token = localStorage.getItem("token");
    let pk = jwtDecode(token).userId.toString();

    useEffect(() => {
        if (pk) {
            obtenerPerfilUsuario();
        }
    }, [pk]);

    useEffect(() => {
        obtenerListaUsuarios();
    }, [usuarioChat]);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            query: { userId: pk }
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log(`Conectado al servidor de WebSocket como usuario ${pk}`);
        });

        socket.on('receiveMessage', (message) => {
            console.log('Mensaje recibido del servidor:', message);
            setNotifications((prevNotifications) => [...prevNotifications, message]);
        });

        socket.on('disconnect', () => {
            console.log('Desconectado del servidor de WebSocket');
        });

        return () => {
            socket.disconnect();
        };
    }, [pk]);

    async function obtenerPerfilUsuario() {
        try {
            const config = { headers: { Authorization: `Token ${token}` } };
            const response = await Axios.get(
                `http://localhost:4000/users/${pk}`,
                config
            );
            const data = response.data;
            setForm({
                username: data.username,
                firstname: data.firstName,
                lastname: data.lastName,
                profilePhotourl: data.profilePhotourl
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function obtenerListaUsuarios() {
        try {
            const config = { headers: { Authorization: `Token ${token}` } };
            const response = await Axios.get("http://localhost:4000/users", config);
            const data = response.data;
            setUsuarios(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUserClick = (usuario) => {
        setUsuarioChat(usuario);
        // Limpiar las notificaciones para el usuario seleccionado
        setNotifications(notifications.filter(notification => notification.sender.id !== usuario.id));
    }

    return (
        <MDBContainer fluid className="py-5 gradient-custom">
            <MDBRow>
                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <h5 className="font-weight-bold mb-3 text-center text-white">
                        Miembros
                    </h5>
                    <MDBCard className="mask-custom">
                        <MDBCardBody>
                            <MDBTypography listUnStyled className="mb-0">
                                <ul>
                                    {usuarios.map(usuario => (
                                        <li key={usuario.id}
                                            className="p-2 border-bottom"
                                            style={{
                                                listStyleType: 'none',
                                                borderBottom: "1px solid rgba(255,255,255,.3) !important",
                                            }}
                                        >
                                            <a onClick={() => handleUserClick(usuario)} style={{ textDecoration: 'none' }}
                                                href="#!"
                                                className="d-flex justify-content-between link-light"
                                            >
                                                <div className="d-flex flex-row">
                                                    <img
                                                        src={usuario.profilePhotoUrl}
                                                        alt="avatar"
                                                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                        width="60"
                                                        height="60"
                                                    />
                                                    <div className="pt-1">
                                                        <p className="fw-bold mb-0">{usuario.firstName} {usuario.lastName}</p>
                                                        <p className="small text-white">
                                                            Hola, Estoy usando Finderlove!!
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="pt-1">
                                                    <p className="small mb-1 text-white">Just now</p>
                                                    {notifications.some(notification => notification.sender.id === usuario.id) && (
                                                        <span className="badge bg-danger float-end">
                                                            {notifications.filter(notification => notification.sender.id=== usuario.id).length}
                                                        </span>
                                                    )}
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </MDBTypography>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol>
                {usuarioChat && (
                    <Chat
                        usuarioChat={usuarioChat}
                        conversaciones={conversaciones}
                        setConversaciones={setConversaciones}
                    />
                )}
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default Mensaje;