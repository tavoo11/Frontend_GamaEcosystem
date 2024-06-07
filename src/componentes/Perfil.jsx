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
import Post from "./Post";
import NavBar from "./NavBar";

function Perfil () {
    const navigate = useNavigate();
   
    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname:"",
        birthDate: "",
        profilePhotoUrl: ""
    });
    const bird = form.birthDate.slice(0, 10);

    useEffect(() => {
        // Obtener token de autenticación del almacenamiento local
        const token = localStorage.getItem("token");
        if(token){
        const pk = jwt_decode(token).userId.toString();
        console.log(pk);
        if (token) {
            // Configurar cabecera de la solicitud
            const config = {
                headers: {
                    "Authorization": `Token ${token}`
                }
            };

            // Realizar solicitud GET a la API para obtener el perfil del usuario
            Axios.get(`http://localhost:4000/users/${pk}`, config)
                .then(response => {
                    const data = response.data;
                    console.log(data)
                    setForm({
                        
                        username: data.username,
                        firstname: data.firstName,
                        lastname: data.lastName,
                        birthDate: data.birthDate,
                        profilePhotoUrl: data.profilePhotoUrl
                    });
                })
                .catch(error => console.log(error));
        }
    }
    }, []);
   
    function BotonPerfil() {
        navigate("/crear-post");
    }
    return (
        <div className="gradient-custom-2" style={{ backgroundColor: '#f8f9fa' }}>
            <MDBContainer className="py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol lg="9" xl="7">
                <MDBCard>
                            <div className="rounded-top text-white d-flex flex-row"
                             style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", backgroundSize: 'cover', height: '250px' }}>
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    <MDBCardImage src={form.profilePhotoUrl}
                                        alt="Generic placeholder image" className="img" />
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <MDBTypography tag="h5">{form.firstname} {form.lastname}</MDBTypography>
                                </div>
                                <div>
                                <NavBar photoProfile = {form.profilePhotoUrl} />
                                </div>
                            </div>
                            <br />
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <MDBBtn outline color="dark" style={{ height: '36px', width: '150px', overflow: 'visible' }} onClick={BotonPerfil}>
                                    Crear Post<i class="bi bi-file-plus-fill"></i>
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
                        <p className="lead fw-normal mb-1">Descripción:</p>
                        <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                            <MDBCardText className="font-italic mb-1">{form.firstname} {form.lastname}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Fecha De Nacimiento: {bird}</MDBCardText>
                            <MDBCardText className="font-italic mb-0">Intereses: todavia no tengo nadad aqui</MDBCardText>
                        </div>
                        </div>
                        <Post />
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