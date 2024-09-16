import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBBtn, MDBBtnGroup, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCol, MDBInput } from 'mdb-react-ui-kit';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const CreatePost = ({ type, onClose }) => {
    const [form, setForm] = useState({
        title: "",
        content: null,
        type: type,
        author: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        setForm(prevState => ({
            ...prevState,
            type: type,
            content: null // Reset content when type changes
        }));
    }, [type]);

    const manejadorInput = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const manejarCambioArchivo = (event) => {
        const archivo = event.target.files[0];
        setForm(prevState => ({
            ...prevState,
            content: archivo
        }));
    };

    const manejarTipo = (type) => () => {
        setForm(prevState => ({
            ...prevState,
            type,
            content: null // Reset content when type changes
        }));
    };

    const manejadorBoton = async () => {
        try {
            let contentUrl = "";
            const token = localStorage.getItem("token");
            if (token) {
                const pk = jwt_decode(token).userId.toString();

                // Solo intentar subir archivo si es de tipo imagen o video
                if (form.type === 'image' || form.type === 'video') {
                    const formData = new FormData();
                    formData.append('content', form.content);
                    const uploadResponse = await axios.post('http://localhost:4000/post/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    contentUrl = uploadResponse.data.url;
                } else {
                    contentUrl = form.content; // Para publicaciones de texto, el contenido es el texto mismo
                }

                const paquete = {
                    title: form.title,
                    type: form.type,
                    author: pk,
                    content: contentUrl
                };

                const respuesta = await axios.post('http://localhost:4000/post/', paquete);
                console.log('enviado', paquete);
                alert('Post creado con éxito');
                navigate("/perfil");
                onClose(); // Cerrar el formulario después de enviar
            }
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
                            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Crear tu Post</h3>
                            <MDBRow>
                                <MDBCol md='12' className='mt-4'>
                                    {form.type === 'image' && (
                                        <MDBInput wrapperClass='mb-4' label='Subir Imagen' size='md' accept="image/*" name="content" type='file' onChange={manejarCambioArchivo} />
                                    )}
                                    {form.type === 'video' && (
                                        <MDBInput wrapperClass='mb-4' label='Subir Video' size='md' accept="video/*" name="content" type='file' onChange={manejarCambioArchivo} />
                                    )}
                                    {form.type === 'text' && (
                                        <MDBInput wrapperClass='mb-4' label='Contenido del Post' size='md' name="content" type='textarea' onChange={manejadorInput} />
                                    )}
                                </MDBCol>
                                <MDBCol md='12'>
                                    <MDBInput wrapperClass='mb-4' label='Título del Post' size='md' name="title" type='text' onChange={manejadorInput} />
                                </MDBCol>
                                </MDBRow>
                            <MDBBtn className="mb-4 w-50 gradient-custom-2" size='md' onClick={manejadorBoton}>Registrar</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBRow>
            </MDBContainer>
        </div>
    );
}

export default CreatePost;
