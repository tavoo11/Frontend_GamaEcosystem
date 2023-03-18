import React, {useState, useEffect} from "react";
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
    MDBIcon,
    MDBBtn,
    MDBTypography,
    MDBTextArea,
    MDBCardHeader,
  } from "mdb-react-ui-kit";

  function Mensaje() {
    const [mensajes, setMensajes] = useState({});
    const [conversaciones, setConversaciones] = useState([]);
    const [usuarioChat, setUsuarioChat] = useState(null);
    const [form, setForm] = useState({});
    const [usuarios, setUsuarios] = useState([]);
  
    const token = localStorage.getItem("token");
    const pk = parseInt(jwt_decode(token).user_id, 10);
  
    function manejarInput(event) {
      const { name, value } = event.target;
      setMensajes((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  
    function enviarMensaje(event) {
      event.preventDefault();
      const data = {
        contenido: mensajes.mensaje,
        id_emisor: pk,
        id_receptor: usuarioChat.id,
      };
      Axios.post("http://127.0.0.1:8000/mensaje/", data)
        .then((response) => {
          setConversaciones([...conversaciones, response.data]);
          setMensajes({});
        })
        .catch((error) => console.log(data));
    }
  
    useEffect(() => {
      obtenerPerfilUsuario();
      obtenerConversaciones();
      obtenerListaUsuarios();
    }, [usuarioChat]);
  
    async function obtenerPerfilUsuario() {
      try {
        const config = { headers: { Authorization: `Token ${token}` } };
        const response = await Axios.get(
          `http://127.0.0.1:8000/usuarioid/${pk}`,
          config
        );
        const data = response.data;
        setForm({
          username: data.username,
          nombre: data.nombre,
          apellidos: data.apellidos,
          perfil: {
            imagen: data.perfil.imagen,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  
    async function obtenerConversaciones() {
      try {
        if (!usuarioChat) {
          return;
        }
        const userId = jwt_decode(token).user_id;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await Axios.get(
          `http://127.0.0.1:8000/mensaje/${userId}/${usuarioChat.id}`,
          config
        );
        setConversaciones(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  
    async function obtenerListaUsuarios() {
      try {
        const config = { headers: { Authorization: `Token ${token}` } };
        const response = await Axios.get("http://127.0.0.1:8000/usuarioid/", config);
        setUsuarios(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    return (
            <MDBContainer fluid className="py-5 gradient-custom">
              <Chat usuarioChat={usuarioChat} conversaciones={conversaciones} userId={pk}/>
              <MDBRow>
                <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                  <h5 className="font-weight-bold mb-3 text-center text-white">
                    Miembros
                  </h5>
        
                  <MDBCard className="mask-custom">
                    <MDBCardBody>
                      <MDBTypography listUnStyled className="mb-0">
                        <ul>
                        {usuarios.map(user => (
                        <li key={user.id}
                          className="p-2 border-bottom"
                          style={{ listStyleType:'none',
                            borderBottom: "1px solid rgba(255,255,255,.3) !important",
                          }}
                        >
                          <a onClick={()=> setUsuarioChat(user)} style={{textDecoration: 'none'}}
                            href="#!"
                            className="d-flex justify-content-between link-light"
                          >
                            <div className="d-flex flex-row">
                              <img
                                src={user.perfil.imagen}
                                alt="avatar"
                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                width="60"
                                height="60"
                              />
                              <div className="pt-1">
                                <p className="fw-bold mb-0" >{user.nombre} {user.apellidos}</p>
                                <p className="small text-white">
                                  {user.perfil.descripcion}
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
                {usuarioChat  ? (
                  <MDBCol md="6" lg="7" xl="8" className="mask-custom">
                    <MDBTypography listUnStyled className="text-white">
                      <li className="d-flex justify-content-between mb-4">
                        <img
                          src={usuarioChat.perfil.imagen}
                          alt="avatar"
                          className="avatar1"
                          width="60"
                        />
                        <MDBCard className="mask-custom">
                          <MDBCardHeader
                            className="d-flex justify-content-between p-3"
                            style={{ borderBottom: "1px solid rgba(255,255,255,.3)" }}
                          >
                            <p className="fw-bold mb-0">{usuarioChat.nombre} {usuarioChat.apellidos}</p>
                            <p className="text-light small mb-0">
                              <MDBIcon far icon="clock" /> 12 mins ago
                            </p>
                          </MDBCardHeader>
                          <MDBCardBody>
                            <ul>
                              {conversaciones.map(msm =>(
                            <li style={{listStyleType: "none"}} key={msm.id_receptor.nombre}>
                            <p className="mb-0">
                             {msm.contenido}
                            </p>
                            </li>
                            ))}
                            </ul>
                          </MDBCardBody>
                        </MDBCard>
                      </li>
                      <li className="mb-3">
                        <MDBTextArea label="Message" name="mensaje" value={mensajes.mensaje} rows={4} onChange={manejarInput}/>
                      </li>
                      <MDBBtn color="light" size="lg" rounded className="float-end" onClick={enviarMensaje}>
                        Enviar
                      </MDBBtn>
                    </MDBTypography>
                  </MDBCol>
                ) : (
                  <></>
                )}
              </MDBRow>
            </MDBContainer>
      );
} export default Mensaje;