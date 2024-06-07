import React, { useState, useEffect } from "react";
import '../assetss/css/mensajeCss.css';
import jwt_decode from 'jwt-decode';
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

function Mensaje() {
    const [conversaciones, setConversaciones] = useState([]);
    const [usuarioChat, setUsuarioChat] = useState(null);
    const [form, setForm] = useState({});
    const [usuarios, setUsuarios] = useState([]);
    
    // Obtener el token y el pk del usuario solo una vez
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
                                            <a onClick={() => setUsuarioChat(usuario)} style={{ textDecoration: 'none' }}
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
                                                    <span className="badge bg-danger float-end">1</span>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <li className="p-2 border-bottom">
                                    <a
                                        href="#!"
                                        className="d-flex justify-content-between link-light"
                                    >
                                    </a>
                                </li>
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
