import React, {useState, useEffect} from "react";
import '../assetss/css/mensajeCss.css';
import jwt_decode from 'jwt-decode';
import Axios from "axios";
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

function Mensaje(){
    const [mensajes, setMensajes] = useState([]);
    const [form, setForm] = useState({
      nombre: '',
      apellidos: '',
      perfil:{
        imagen: ''
      }
    });
    const [mostrarMensaje, setMostrarMensaje] = useState(true)

    /* function CerrarChat(){
      setMostrarMensaje(false)
    } */
    useEffect(() =>{
     const token = localStorage.getItem("token");
      if (token){
        let pk = jwt_decode(token).user_id.toString();
        console.log(pk);
        if (token) {
            // Configurar cabecera de la solicitud
            const config = {
                headers: {
                    "Authorization": `Token ${token}`
                }
            };

            // Realizar solicitud GET a la API para obtener el perfil del usuario
            Axios.get(`http://127.0.0.1:8000/usuarioid/${pk}`, config)
                .then(response => {
                    const data = response.data;
                    setForm({
                        
                        username: data.username,
                        nombre: data.nombre,
                        apellidos: data.apellidos,
                        perfil: {
                            imagen: data.perfil.imagen
                        }
                    });
                })
                .catch(error => console.log(error));
        }
      }
    }, []);

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
                        <li
                          className="p-2 border-bottom"
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,.3) !important",
                          }}
                        >
                          <a
                            href="#!"
                            className="d-flex justify-content-between link-light"
                          >
                            <div className="d-flex flex-row">
                              <img
                                src={form.perfil.imagen}
                                alt="avatar"
                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                width="60"
                              />
                              <div className="pt-1">
                                <p className="fw-bold mb-0">{form.nombre} {form.apellidos}</p>
                                <p className="small text-white">
                                  Hombe, que hay por ahí?
                                </p>
                              </div>
                            </div>
                            <div className="pt-1">
                              <p className="small mb-1 text-white">Just now</p>
                              <span className="badge bg-danger float-end">1</span>
                            </div>
                          </a>
                        </li>
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
        
                <MDBCol md="6" lg="7" xl="8" className="mask-custom">
                  <MDBTypography listUnStyled className="text-white">
                    <li className="d-flex justify-content-between mb-4">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                        alt="avatar"
                        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                        width="60"
                      />
                      <MDBCard className="mask-custom">
                        <MDBCardHeader
                          className="d-flex justify-content-between p-3"
                          style={{ borderBottom: "1px solid rgba(255,255,255,.3)" }}
                        >
                          <p className="fw-bold mb-0">Pablo Boa</p>
                          <p className="text-light small mb-0">
                            <MDBIcon far icon="clock" /> 12 mins ago
                          </p>
                        </MDBCardHeader>
                        <MDBCardBody>
                          <p className="mb-0">
                            ohh mary! tú le apartastes los huesos a Digna, y la libra de carne.
                          </p>
                        </MDBCardBody>
                      </MDBCard>
                    </li>
                    <li className="d-flex justify-content-between mb-4">
                      <MDBCard className="w-100 mask-custom">
                        <MDBCardHeader
                          className="d-flex justify-content-between p-3"
                          style={{ borderBottom: "1px solid rgba(255,255,255,.3)" }}
                        >
                          <p className="fw-bold mb-0">Mary Margarita</p>
                          <p className="text-light small mb-0">
                            <MDBIcon far icon="clock" /> 13 mins ago
                          </p>
                        </MDBCardHeader>
                        <MDBCardBody>
                          <p className="mb-0">
                            ayy Pablo se me olvidó.
                          </p>
                        </MDBCardBody>
                      </MDBCard>
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                        alt="avatar"
                        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                        width="60"
                      />
                    </li>
                    <li className="d-flex justify-content-between mb-4">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                        alt="avatar"
                        className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                        width="60"
                      />
                      <MDBCard className="mask-custom">
                        <MDBCardHeader
                          className="d-flex justify-content-between p-3"
                          style={{ borderBottom: "1px solid rgba(255,255,255,.3)" }}
                        >
                          <p className="fw-bold mb-0">Pablo Boa</p>
                          <p className="text-light small mb-0">
                            <MDBIcon far icon="clock" /> 10 mins ago
                          </p>
                        </MDBCardHeader>
                      </MDBCard>
                    </li>
                    <li className="mb-3">
                    <MDBTextArea label="Message" name="mensaje" rows={4} />
                  </li>
                  <MDBBtn color="light" size="lg" rounded className="float-end">
                    Send
                  </MDBBtn>
                  </MDBTypography>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
      );
} export default Mensaje;