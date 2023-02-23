import React, { useState } from "react";
import './assetss/css/LoginCss.css'
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
}
from 'mdb-react-ui-kit';

function CrearCuenta() {
    const [form, setForm] = useState({
        username: "",
        password: "",
        nombre: "",
        apellidos:"",
        email: "",
        fechaNacimiento: "",
        genero: "",
        intereses: "",
        perfil: {
            descripcion: "",
            imagen: ""
            
        }
    });
    const navigate = useNavigate();

    const manejadorInput = (event) => {
        const { name, value } = event.target;
        const names = name.split(".");
        if (names.length === 2) {
            setForm(prevState => ({
                ...prevState,
                [names[0]]: {
                    ...prevState[names[0]],
                    [names[1]]: value
                }
            }));
        } else {
            setForm(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    //convertir la imagen en formato Base64
    const manejarCambioImagen = (event) => {
        const archivo = event.target.files[0];
        const lector = new FileReader();
    
        lector.readAsDataURL(archivo);
    
        lector.onload = () => {
            setForm((prevState) => ({
                ...prevState,
                perfil: {
                    ...prevState.perfil,
                    imagen: lector.result,
                },
            }));
        };
    };
    

    const manejadorBoton = async () => {
        const paquete = {
            username: form.username,
            password: form.password,
            nombre: form.nombre,
            apellidos: form.apellidos,
            email: form.email,
            fechaNacimiento: form.fechaNacimiento,
            genero: form.genero,
            intereses: form.intereses,
            perfil: {
                descripcion: form.perfil.descripcion,
                imagen: form.perfil.imagen
                
            }
        };

        try {
            const respuesta = await axios.post('http://127.0.0.1:8000/usuario/', paquete);
            console.log(respuesta);
            console.log('enviado', paquete)
            alert('Recuerdalo, tu username es:  ' + paquete.username);
            navigate("/");
        } catch (error) {
            console.error(error, form);
        }
    };
        return(
            <div>
                <MDBContainer fluid>

                    <MDBRow className='justify-content-center align-items-center m-5'>

                        <MDBCard>
                            <MDBCardBody className='px-4'>

                            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Crear tu cuenta</h3>

                            <MDBRow>
                            <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Descripción' size='lg'  name="perfil.descripcion" type='text' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Imagen' size='lg' accept="image/*" name="perfil.imagen" type='file' onChange={manejarCambioImagen}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Username' size='lg' name="username" type='text' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Password' size='lg' name="password" type='password' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Nombres' size='lg' name="nombre" type='text' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Apellidos' size='lg' name="apellidos" type='text' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Email' size='lg' name="email" type='email' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Fecha de nacimiento' size='lg' name="fechaNacimiento" type='text' placeholder="YYYY-MM-DD" onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Genero' size='lg' name="genero" type='text' onChange={manejadorInput}/>
                                </MDBCol>

                                <MDBCol md='6'>
                                <MDBInput wrapperClass='mb-4' label='Intereses' size='lg' name="intereses" type='text' onChange={manejadorInput}/>
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
