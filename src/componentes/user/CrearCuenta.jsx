import React, { useState } from "react";
import '../../assetss/css/LoginCss.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
} from 'mdb-react-ui-kit';

function CrearCuenta() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName:"",
        email: "",
        birthDate: "",
        profilePhotoUrl: null
    });
    const navigate = useNavigate();

    const manejadorInput = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const manejarCambioImagen = (event) => {
        const archivo = event.target.files[0];
        setForm((prevState) => ({
            ...prevState,
            profilePhotoUrl: archivo
        }));
    };

    const manejadorBoton = async () => {
        try {
            // Subir la imagen primero
            let profilePhotoUrl = "";
            if (form.profilePhotoUrl) {
                const formData = new FormData();
                formData.append('profilePhoto', form.profilePhotoUrl);
                const uploadResponse = await axios.post('http://localhost:4000/users/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                profilePhotoUrl = uploadResponse.data.url;
            }

            // Ahora enviar el formulario con la URL de la imagen
            const paquete = {
                username: form.username,
                password: form.password,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                birthDate: form.birthDate,
                profilePhotoUrl
            };

            const respuesta = await axios.post('http://localhost:4000/users/', paquete);
            console.log(respuesta);
            console.log('enviado', paquete);
            alert('Recuerdalo, tu username es:  ' + paquete.username);
            navigate("/");
        } catch (error) {
            console.error(error, form);
        }
    };

    return (
        <div>
            <MDBContainer fluid>
                <MDBRow className='justify-content-center align-items-center m-5'>
                    <MDBCard>
                        <MDBCardBody className='px-4'>
                            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Crear tu cuenta</h3>
                            <MDBRow>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Imagen' size='lg' accept="image/*" name="profilePhotoUrl" type='file' onChange={manejarCambioImagen}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Username' size='lg' name="username" type='text' onChange={manejadorInput}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Password' size='lg' name="password" type='password' onChange={manejadorInput}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Nombres' size='lg' name="firstName" type='text' onChange={manejadorInput}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Apellidos' size='lg' name="lastName" type='text' onChange={manejadorInput}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Email' size='lg' name="email" type='email' onChange={manejadorInput}/>
                                </MDBCol>
                                <MDBCol md='6'>
                                    <MDBInput wrapperClass='mb-4' label='Fecha de nacimiento' size='lg' name="birthDate" type='text' placeholder="YYYY-MM-DD" onChange={manejadorInput}/>
                                </MDBCol>
                            </MDBRow>
                            <MDBBtn className="mb-4 w-50 gradient-custom-2" size='lg' onClick={manejadorBoton}>Registrar</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default CrearCuenta;
