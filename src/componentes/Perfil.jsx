import React, { useState, useEffect} from "react";
import '../assetss/css/LoginCss.css';
import { useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import { MDBCol,
     MDBContainer, 
     MDBRow, 
     MDBCard, 
     MDBCardText, 
     MDBCardBody, 
     MDBCardImage, 
     MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import Axios from 'axios';

function Perfil () {
    const navigate = useNavigate();
    //mostrar el chat
    /* const [mostrarChat, setMostrarChat] = useState(false);

    const toggleChat = () => {
        setMostrarChat(!mostrarChat);
    } */
    const [form, setForm] = useState({
        username: "",
        nombre: "",
        apellidos:"",
        genero: "",
        intereses: "",
        perfil: {
            descripcion: "",
            imagen: ""
            
        }
    });

    useEffect(() => {
        // Obtener token de autenticación del almacenamiento local
        const token = localStorage.getItem("token");
        if(token){
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
                        genero: data.genero,
                        intereses: data.intereses,
                        perfil: {
                            descripcion: data.perfil.descripcion,
                            imagen: data.perfil.imagen
                        }
                    });
                })
                .catch(error => console.log(error));
        }
    }
    }, []);

    function BotonPerfil() {
        navigate("/crear");
    }
    return (
        <div className="gradient-custom-2" style={{ backgroundColor: '#9de2ff' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="9" xl="7">
                <MDBCard>
                            <div className="rounded-top text-white d-flex flex-row"
                             style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", backgroundSize: 'cover', height: '200px' }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    <MDBCardImage src={form.perfil.imagen}
                                        alt="Generic placeholder image" className="img" />
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <MDBTypography tag="h5">{form.nombre} {form.apellidos}</MDBTypography>
                                    <MDBCardText>{form.username}</MDBCardText>
                                </div>
                            </div>
                            <br />
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <MDBBtn outline color="dark" style={{ height: '36px', width: '150px', overflow: 'visible' }} onClick={BotonPerfil}>
                                    Editar perfil
                                </MDBBtn>
                        <div className="d-flex justify-content-end text-center py-1">
                        <div>
                            <MDBCardText className="mb-1 h5">253</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                        </div>
                        <div className="px-3">
                            <MDBCardText className="mb-1 h5">1026</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                        </div>
                        <div>
                            <MDBCardText className="mb-1 h5">478</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                        </div>
                        </div>
                    </div>
                    <MDBCardBody className="text-black p-4">
                        <div className="mb-5">
                        <p className="lead fw-normal mb-1">Descripción: {form.perfil.descripcion}</p>
                        <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                            <MDBCardText className="font-italic mb-1">{form.nombre} {form.apellidos}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Genero: {form.genero}</MDBCardText>
                            <MDBCardText className="font-italic mb-0">Intereses: {form.intereses}</MDBCardText>
                        </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                        <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                        <MDBCardText className="mb-0"><a href="#!" className="text-muted">Show all</a></MDBCardText>
                        </div>
                        <MDBRow>
                        <MDBCol className="mb-2">
                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                            alt="image 1" className="w-100 rounded-3" />
                        </MDBCol>
                        <MDBCol className="mb-2">
                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                            alt="image 1" className="w-100 rounded-3" />
                        </MDBCol>
                        </MDBRow>
                        <MDBRow className="g-2">
                        <MDBCol className="mb-2">
                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                            alt="image 1" className="w-100 rounded-3" />
                        </MDBCol>
                        <MDBCol className="mb-2">
                            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                            alt="image 1" className="w-100 rounded-3" />
                        </MDBCol>
                        </MDBRow>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                </MDBRow>
            </MDBContainer>
            {/* <div style={{position: "fixed", right: "0", bottom: "10px", }}>
            <button onClick={toggleChat}>Mensajes</button>
            {mostrarChat && (
            <div >
                <Mensaje style={{width: '100%', height: '100%'}}  />
            </div>
                )}
            
            </div> */}
        </div>
    )
}
export default Perfil;