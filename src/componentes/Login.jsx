import React from "react";
import '../assetss/css/LoginCss.css'
import { Link } from 'react-router-dom';
import Axios from '../Axios';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBInput
  }
  from 'mdb-react-ui-kit';
  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  
  function Login() {
    const [form, setForm] = useState({
      username: '',
      password: ''
    });
    const navigate = useNavigate();
  
    const manejadorInput = (event) => {
      const { name, value } = event.target;
      setForm(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
   /* const manejadorSubmit = e => {
      e.preventDefault();
    };*/
  
    const manejadorBoton = async () => {
      const paquete = {
        username: form.username,
        password: form.password
      };
     // manejadorSubmit();
    
      try {
        const respuesta = await Axios.post('http://localhost:4000/auth/login', paquete);
        console.log(respuesta);
        localStorage.setItem('token', respuesta.data);
        navigate('/perfil')
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
            <div>
                <MDBContainer className="my-5 gradient-form">

                <MDBRow>

                  <MDBCol col='6' className="mb-5">
                    <div className="d-flex flex-column ms-5">

                      <div className="text-center">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                          style={{width: '185px'}} alt="logo" />
                        <h4 className="mt-1 mb-5 pb-1">Bienvenido a LoveFinder</h4>
                      </div>

                      <p>Por favor ingresa con tu cuenta</p>


                      <MDBInput wrapperClass='mb-4' label='Username' name="username" type='text' onChange={manejadorInput}/>
                      <MDBInput wrapperClass='mb-4' label='Password' name="password" type='password' onChange={manejadorInput}/>


                      <div  className="text-center pt-1 mb-5 pb-1">
                        <MDBBtn onClick={manejadorBoton} className="mb-4 w-100 gradient-custom-2">Iniciar sesión</MDBBtn>
                        <a className="text-muted" href="#!">Olvidaste tu contraseña?</a>
                      </div>

                      <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                        <p className="mb-0">No tienes una cuenta?  </p>
                        <Link to="/crear">Registrarse</Link>
                      </div>

                    </div>

                  </MDBCol>

                  <MDBCol col='6' className="mb-5">
                    <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">

                      <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                        <h4 className="mb-4">"Conectando corazones"</h4>
                        <p className="small mb-0">Bienvenido a nuestra aplicación de citas, donde podrás conocer gente nueva y encontrar el amor. 
                        Con una interfaz intuitiva y un sistema de coincidencias sofisticado, estamos seguros de que encontrarás a alguien que sea perfecto para ti.
                        Nuestra comunidad está formada por personas de todo el mundo, 
                        lo que te da la oportunidad de conocer a alguien especial sin importar donde estés. 
                        ¡Regístrate ahora y comienza tu búsqueda de amor hoy mismo!
                        </p>
                      </div>

                    </div>

                  </MDBCol>

                </MDBRow>

                </MDBContainer>
            </div>
        );
    }

export default Login
