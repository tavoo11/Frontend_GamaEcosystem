import React, { useState, useEffect, useContext} from "react";
import '../../assetss/css/LoginCss.css';
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
import Post from "../posts/Post";
import Superior from "../feed/Superior";
import { UserContext } from '../context/UserContext';

function Perfil () {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [form, setForm] = useState({
        username: "",
        firstname: "",
        lastname:"",
        birthDate: "",
        profilePhotoUrl: "",
        followers: [],
        following: []
    });
    const bird = form.birthDate.slice(0, 10);

    useEffect(() => {
        // Obtener token de autenticación del almacenamiento local
        const token = localStorage.getItem("token");
        if(token){
        const pk = jwt_decode(token).userId.toString();
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
                        profilePhotoUrl: data.profilePhotoUrl,
                        role: data.role,
                        position: data.position,
                        phoneNumber: data.phoneNumber
                    });
                    setUser({
                        profilePhotoUrl: data.profilePhotoUrl,
                        // other user details
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
        <div className="gradient-custom-2">
            <div>
                <Superior photoProfile = {form.profilePhotoUrl} />
            </div>
            <MDBContainer className="py-5 h-100 ">
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
                                
                            </div>
                            <br />
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <MDBBtn outline color="dark" style={{ height: 'auto', width: 'auto', margin: 10}} onClick={BotonPerfil}>
                                    Registrar Plantas<i class="bi bi-file-plus-fill"></i>
                                </MDBBtn>
                                
                            <MDBBtn outline color="dark" style={{ height: 'auto', width: 'auto', overflow: 'visible',  }} onClick={() => navigate("/Principal")}>
                                Página Principal
                            </MDBBtn>
                        <div className="d-flex justify-content-end text-center py-1">
                        <div>
                            <MDBCardText className="mb-1 h5">25</MDBCardText>
                            <MDBCardText className="small text-muted mb-0">Post</MDBCardText>
                        </div>
                        </div>
                    </div>
                    <div className="gradient-custom-2">
                    <MDBCardBody className="text-black p-4" style={{backgroundColor: 'white'}}>
                        <div className="mb-5">
                        <p className="lead fw-normal mb-1">Descripción:</p>
                        <div className="p-4">
                            <MDBCardText className="font-italic mb-1">{form.firstname} {form.lastname}</MDBCardText>
                            <MDBCardText className="font-italic mb-1">Fecha De Nacimiento: {bird}</MDBCardText>
                            <MDBCardText className="font-italic mb-0">Rol: {form.role}</MDBCardText>
                            <MDBCardText className="font-italic mb-0">Cargo: {form.position}</MDBCardText>
                            <MDBCardText className="font-italic mb-0">Celular: {form.phoneNumber}</MDBCardText>
                        </div>
                        </div>
                        <Post />
                    </MDBCardBody>
                    </div>
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